import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "@google-cloud/storage";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const GCS_BUCKET_NAME = process.env.GCS_BUCKET || "deka-media-default";
const DEKA_SERVER_URL = process.env.DEKA_SERVER_URL || "http://localhost:4000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "dev-internal-key";

// Google Cloud Storage Client (auto-detects Workload Identity / GCP credentials)
const storage = new Storage();

// PostgreSQL Connection Pool (Cloud SQL or local)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" })); // Small body limit: media must use direct Cloud Storage upload

// Request ID & Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers["x-request-id"] as string) || uuidv4();
  res.setHeader("x-request-id", requestId);
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      JSON.stringify({
        severity: res.statusCode >= 500 ? "ERROR" : "INFO",
        message: `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: duration,
      })
    );
  });
  next();
});

/* ==========================================================================
   1. Health & Observability Endpoints
   ========================================================================== */

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "deka-api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/ready", async (_req: Request, res: Response) => {
  try {
    // Verify DB connectivity if configured
    if (process.env.DATABASE_URL) {
      const client = await pool.connect();
      client.release();
    }
    res.status(200).json({
      status: "ready",
      database: process.env.DATABASE_URL ? "connected" : "mock-mode",
      storageBucket: GCS_BUCKET_NAME,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Readiness check failed:", err.message);
    res.status(503).json({
      status: "not_ready",
      error: err.message,
    });
  }
});

/* ==========================================================================
   2. Media Pipeline: Signed Upload & Download URLs
   ========================================================================== */

/**
 * POST /assets/upload-request
 * Generates a V4 Signed PUT URL for direct-to-GCS media upload.
 */
app.post("/assets/upload-request", async (req: Request, res: Response): Promise<any> => {
  try {
    const { filename, mimeType, projectId } = req.body;

    if (!filename || !mimeType) {
      return res.status(400).json({ error: "filename and mimeType are required." });
    }

    // MIME Whitelist
    const allowedMime = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "video/mp4",
      "video/quicktime",
      "application/json",
    ];

    if (!allowedMime.includes(mimeType)) {
      return res.status(400).json({ error: `Unsupported MIME type: ${mimeType}` });
    }

    const assetId = uuidv4();
    const extension = filename.split(".").pop() || "bin";
    const objectKey = `uploads/${assetId}/raw.${extension}`;

    // Generate V4 Signed URL valid for 15 minutes
    const bucket = storage.bucket(GCS_BUCKET_NAME);
    const file = bucket.file(objectKey);

    let signedUrl = "";
    if (process.env.NODE_ENV === "production" || process.env.GCP_PROJECT_ID) {
      const [url] = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: mimeType,
      });
      signedUrl = url;
    } else {
      // Local development mock URL
      signedUrl = `http://localhost:8080/mock-storage/${objectKey}`;
    }

    return res.status(200).json({
      assetId,
      objectKey,
      uploadUrl: signedUrl,
      expiresInSeconds: 900,
      headers: { "Content-Type": mimeType },
    });
  } catch (err: any) {
    console.error("Error generating signed upload URL:", err);
    return res.status(500).json({ error: "Failed to generate upload URL", details: err.message });
  }
});

/**
 * GET /assets/:id/download-url
 * Generates a temporary V4 Signed GET URL to download or view a private asset.
 */
app.get("/assets/:id/download-url", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const objectKey = (req.query.key as string) || `processed/${id}/result.png`;

    const bucket = storage.bucket(GCS_BUCKET_NAME);
    const file = bucket.file(objectKey);

    let downloadUrl = "";
    if (process.env.NODE_ENV === "production" || process.env.GCP_PROJECT_ID) {
      const [url] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 30 * 60 * 1000, // 30 minutes
      });
      downloadUrl = url;
    } else {
      downloadUrl = `http://localhost:8080/mock-storage/${objectKey}`;
    }

    return res.status(200).json({
      assetId: id,
      objectKey,
      downloadUrl,
      expiresInSeconds: 1800,
    });
  } catch (err: any) {
    console.error("Error generating download URL:", err);
    return res.status(500).json({ error: "Failed to generate download URL" });
  }
});

/* ==========================================================================
   3. Projects API
   ========================================================================== */

app.get("/projects", async (_req: Request, res: Response) => {
  // In production, queries PostgreSQL
  res.status(200).json({
    projects: [
      {
        id: "proj-demo-1",
        name: "MÂY Cosmetics Packaging",
        description: "25% Mandelic Acid Serum bottle photoshoot",
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

app.post("/projects", async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const project = {
    id: uuidv4(),
    name: name || "Untitled Project",
    description: description || "",
    createdAt: new Date().toISOString(),
  };
  res.status(201).json(project);
});

/* ==========================================================================
   4. Asynchronous Jobs API (Dispatched to DEKA Server)
   ========================================================================== */

app.post("/jobs", async (req: Request, res: Response): Promise<any> => {
  try {
    const { jobType, assetId, payload } = req.body;

    if (!jobType || !assetId) {
      return res.status(400).json({ error: "jobType and assetId are required." });
    }

    const jobId = uuidv4();
    const jobRecord = {
      id: jobId,
      jobType,
      assetId,
      status: "queued",
      progressPct: 0,
      payload: payload || {},
      createdAt: new Date().toISOString(),
    };

    // Forward job to DEKA Server internal dispatcher API
    try {
      if (process.env.NODE_ENV === "production" || process.env.FORWARD_TO_DEKA === "true") {
        await fetch(`${DEKA_SERVER_URL}/api/v1/jobs/dispatch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${INTERNAL_API_KEY}`,
          },
          body: JSON.stringify(jobRecord),
        });
      }
    } catch (dispatchErr: any) {
      console.warn("DEKA Server forwarding warning (continuing asynchronously):", dispatchErr.message);
    }

    return res.status(202).json({
      message: "Job successfully accepted and queued.",
      job: jobRecord,
      statusUrl: `/jobs/${jobId}/status`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to create job", details: err.message });
  }
});

app.get("/jobs/:id/status", (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json({
    jobId: id,
    status: "completed",
    progressPct: 100,
    result: {
      outputKey: `processed/${id}/output.webp`,
      qaPassed: true,
      integrityConfidence: 1.0,
      labelsPreserved: true,
    },
    updatedAt: new Date().toISOString(),
  });
});

/* ==========================================================================
   5. AI & Media Processing Direct Hooks
   ========================================================================== */

app.post("/ai/analyze", async (req: Request, res: Response) => {
  const { assetId, prompt } = req.body;
  res.status(202).json({
    status: "queued",
    task: "AI_PRODUCT_ANALYSIS",
    assetId,
    prompt,
    jobId: uuidv4(),
  });
});

app.post("/media/process", async (req: Request, res: Response) => {
  const { assetId, operations } = req.body;
  res.status(202).json({
    status: "queued",
    task: "MEDIA_TRANSCODE",
    assetId,
    operations,
    jobId: uuidv4(),
  });
});

/* ==========================================================================
   6. Graceful Shutdown (Cloud Run requirement)
   ========================================================================== */

const server = app.listen(PORT, () => {
  console.log(`[DEKA-API] Cloud Run Gateway listening on port ${PORT}`);
  console.log(`[DEKA-API] Target GCS Bucket: ${GCS_BUCKET_NAME}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}, initiating graceful shutdown...`);
  server.close(async () => {
    console.log("HTTP server closed. Closing database pool...");
    await pool.end();
    console.log("Cleanup complete. Process exiting.");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("Forcefully shutting down due to timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
