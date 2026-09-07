import express, { Request, Response, NextFunction } from "express";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "dev-internal-key";

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

const mediaQueue = new Queue("media-queue", { connection });
const aiQueue = new Queue("ai-queue", { connection });

app.use(express.json());

// Authentication Middleware
app.use((req: Request, res: Response, next: NextFunction): any => {
  if (req.path === "/health") return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== INTERNAL_API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid internal API key" });
  }

  next();
});

/* ==========================================================================
   Inspection & Health Endpoints
   ========================================================================== */

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "deka-internal-dispatcher",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/queue-status", async (_req: Request, res: Response) => {
  const [mediaWaiting, mediaActive, aiWaiting, aiActive] = await Promise.all([
    mediaQueue.getWaitingCount(),
    mediaQueue.getActiveCount(),
    aiQueue.getWaitingCount(),
    aiQueue.getActiveCount(),
  ]);

  res.status(200).json({
    queues: {
      media: { waiting: mediaWaiting, active: mediaActive },
      ai: { waiting: aiWaiting, active: aiActive },
    },
    system: {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    },
  });
});

/* ==========================================================================
   Job Dispatch Endpoint
   ========================================================================== */

app.post("/api/v1/jobs/dispatch", async (req: Request, res: Response): Promise<any> => {
  const { id, jobType, assetId, payload } = req.body;

  if (!id || !jobType) {
    return res.status(400).json({ error: "Missing required job fields: id, jobType" });
  }

  try {
    if (jobType.startsWith("MEDIA_") || jobType === "PROCESS_VIDEO" || jobType === "THUMBNAIL") {
      await mediaQueue.add(
        jobType,
        {
          jobId: id,
          assetId,
          jobType,
          rawObjectKey: payload?.objectKey || `uploads/${assetId}/raw.bin`,
          options: payload?.options,
        },
        { jobId: id, attempts: 3, backoff: { type: "exponential", delay: 3000 } }
      );
      console.log(`[DISPATCHER] Dispatched to media-queue: ${id}`);
    } else {
      await aiQueue.add(
        jobType,
        {
          jobId: id,
          userId: payload?.userId,
          assetId,
          prompt: payload?.prompt,
        },
        { jobId: id, attempts: 2 }
      );
      console.log(`[DISPATCHER] Dispatched to ai-queue: ${id}`);
    }

    return res.status(202).json({
      status: "enqueued",
      jobId: id,
      queue: jobType.startsWith("MEDIA_") ? "media-queue" : "ai-queue",
    });
  } catch (err: any) {
    console.error("[DISPATCHER] Failed to enqueue job:", err.message);
    return res.status(500).json({ error: "Queue dispatch failure", details: err.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`[DEKA-DISPATCHER] Internal API listening on port ${PORT}`);
});

process.on("SIGTERM", async () => {
  server.close(async () => {
    await mediaQueue.close();
    await aiQueue.close();
    process.exit(0);
  });
});
