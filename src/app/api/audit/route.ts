import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { runAudit } from "@/lib/audit/runAudit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing file in form-data under key `file`" },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image uploads are supported" },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const auditId = crypto.randomUUID();

  const extensionFromType = file.type.split("/")[1] || "png";
  const safeExtension = extensionFromType.toLowerCase().replace(/[^a-z0-9]/g, "");
  const extension = safeExtension || "png";

  const objectPath = `inputs/${auditId}.${extension}`;

  const supabase = createServiceSupabaseClient();

  const uploadResult = await supabase.storage
    .from("audit-inputs")
    .upload(objectPath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadResult.error) {
    return NextResponse.json(
      { error: "Failed to upload screenshot" },
      { status: 500 },
    );
  }

  const imageBase64 = buffer.toString("base64");

  try {
    const cleanupUploadedFile = async () => {
      await supabase.storage.from("audit-inputs").remove([objectPath]);
    };

    const audit = await runAudit({
      imageBase64,
      mimeType: file.type,
    });

    const { error: insertAuditError } = await supabase
      .from("audits")
      .insert({
        id: auditId,
        user_id: null,
        input_type: "screenshot",
        input_image_path: objectPath,
        status: "done",
        summary: audit.summary,
      });

    if (insertAuditError) {
      await cleanupUploadedFile();
      return NextResponse.json(
        { error: "Failed to save audit summary" },
        { status: 500 },
      );
    }

    if (audit.top_issues.length > 0) {
      const { error: insertItemsError } = await supabase
        .from("audit_items")
        .insert(
          audit.top_issues.map((item) => ({
            audit_id: auditId,
            severity: item.severity,
            category: item.category,
            title: item.title,
            evidence: item.evidence,
            recommendation: item.recommendation,
            effort: item.effort,
            impact: item.impact,
          })),
        );

      if (insertItemsError) {
        await cleanupUploadedFile();
        return NextResponse.json(
          { error: "Failed to save audit items" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ auditId });
  } catch (error) {
    await supabase.storage.from("audit-inputs").remove([objectPath]);
    return NextResponse.json(
      { error: "Failed to run UX audit" },
      { status: 500 },
    );
  }
}

