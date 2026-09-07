import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { Storage } from "@google-cloud/storage";
import { Pool } from "pg";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const GCS_BUCKET_NAME = process.env.GCS_BUCKET || "deka-media-default";

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

const storage = new Storage();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

console.log("[MEDIA-WORKER] Starting DEKA Media Processing Service...");
console.log(`[MEDIA-WORKER] Connected to Redis at ${REDIS_URL.split("@").pop()}`);
console.log(`[MEDIA-WORKER] GCS Bucket: ${GCS_BUCKET_NAME}`);

interface MediaJobData {
  jobId: string;
  assetId: string;
  jobType: string;
  rawObjectKey: string;
  options?: {
    generateThumbnail?: boolean;
    targetResolution?: string;
  };
}

async function processMediaJob(job: Job<MediaJobData>) {
  const { jobId, assetId, rawObjectKey } = job.data;
  console.log(`[MEDIA-WORKER] Processing Job ${jobId} for Asset ${assetId}...`);

  const tmpDir = path.join("/tmp", "deka-media", jobId);
  fs.mkdirSync(tmpDir, { recursive: true });

  const inputPath = path.join(tmpDir, "input.raw");
  const outputPath = path.join(tmpDir, "output.mp4");
  const thumbPath = path.join(tmpDir, "thumb.jpg");

  try {
    // 1. Download raw file from Cloud Storage
    const bucket = storage.bucket(GCS_BUCKET_NAME);
    const rawFile = bucket.file(rawObjectKey);

    console.log(`[MEDIA-WORKER] Downloading gs://${GCS_BUCKET_NAME}/${rawObjectKey}...`);
    await rawFile.download({ destination: inputPath });

    // 2. FFmpeg Transcoding / Processing
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions(["-c:v libx264", "-crf 23", "-preset fast", "-c:a aac", "-b:a 128k", "-movflags +faststart"])
        .output(outputPath)
        .screenshots({
          count: 1,
          folder: tmpDir,
          filename: "thumb.jpg",
          size: "640x360",
        })
        .on("progress", (progress) => {
          if (progress.percent) {
            job.updateProgress(Math.round(progress.percent));
          }
        })
        .on("end", () => {
          console.log(`[MEDIA-WORKER] Transcoding completed for ${jobId}`);
          resolve();
        })
        .on("error", (err) => {
          console.error(`[MEDIA-WORKER] FFmpeg error:`, err);
          reject(err);
        })
        .run();
    });

    // 3. Upload processed outputs to Cloud Storage
    const processedKey = `processed/${assetId}/master.mp4`;
    const thumbKey = `thumbnails/${assetId}/preview.jpg`;

    console.log(`[MEDIA-WORKER] Uploading to gs://${GCS_BUCKET_NAME}/${processedKey}...`);
    await bucket.upload(outputPath, { destination: processedKey });
    await bucket.upload(thumbPath, { destination: thumbKey });

    // 4. Update Database Job Status
    if (process.env.DATABASE_URL) {
      await pool.query(
        `UPDATE jobs 
         SET status = 'completed', 
             progress_pct = 100, 
             completed_at = NOW(),
             payload = payload || $1::jsonb
         WHERE id = $2`,
        [JSON.stringify({ processedKey, thumbKey }), jobId]
      );
    }

    console.log(`[MEDIA-WORKER] Successfully completed Job ${jobId}`);
  } catch (err: any) {
    console.error(`[MEDIA-WORKER] Job ${jobId} failed:`, err.message);
    if (process.env.DATABASE_URL) {
      await pool.query(
        `UPDATE jobs SET status = 'failed', error_message = $1 WHERE id = $2`,
        [err.message, jobId]
      );
    }
    throw err;
  } finally {
    // 5. Cleanup temporary local disk storage
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (_) {}
  }
}

// Start BullMQ Worker
const worker = new Worker<MediaJobData>("media-queue", processMediaJob, {
  connection,
  concurrency: 2, // Right-sized for e2-standard-2
});

worker.on("failed", (job, err) => {
  console.error(`[MEDIA-WORKER] Job ${job?.id} failed with error: ${err.message}`);
});

process.on("SIGTERM", async () => {
  console.log("[MEDIA-WORKER] Shutting down worker...");
  await worker.close();
  await pool.end();
  process.exit(0);
});
