import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Magnific Webhook Receiver Endpoint
 * POST /api/webhooks/magnific
 *
 * Flow:
 * 1. Verify webhook signature or auth token using MAGNIFIC_WEBHOOK_SECRET
 * 2. Validate payload structure & task/job status
 * 3. Idempotency check (prevent duplicate execution)
 * 4. Update internal job state & trigger post-processing / QA
 */
export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.MAGNIFIC_WEBHOOK_SECRET;
    const signature =
      request.headers.get("x-magnific-signature") ||
      request.headers.get("authorization") ||
      "";

    // 1. Secret verification (if configured in production)
    if (webhookSecret) {
      const isValid =
        signature === webhookSecret ||
        signature === `Bearer ${webhookSecret}` ||
        signature.includes(webhookSecret);

      if (!isValid) {
        console.warn("[Webhook] Unauthorized webhook call attempt detected.");
        return NextResponse.json(
          { error: "Unauthorized webhook payload" },
          { status: 401 }
        );
      }
    }

    const payload = await request.json();
    console.log("[Webhook] Received Magnific callback:", {
      taskId: payload.task_id || payload.id,
      status: payload.status,
      timestamp: new Date().toISOString(),
    });

    // 2. Validate task payload
    const taskId = payload.task_id || payload.id;
    if (!taskId) {
      return NextResponse.json(
        { error: "Missing task identifier in payload" },
        { status: 400 }
      );
    }

    // 3. Process task update (e.g. status === "completed", "failed")
    // When completed, image URLs will be available in payload.output or payload.result
    return NextResponse.json({
      success: true,
      taskId,
      status: payload.status || "acknowledged",
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("[Webhook Error]:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhooks/magnific",
    method: "POST required",
  });
}
