import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ROLES = new Set(["renter", "landlord"]);

export async function POST(request: NextRequest) {
  const session = request.cookies.get("verdansc_session")?.value;
  const email = request.cookies.get("verdansc_email")?.value;
  const role = request.cookies.get("verdansc_role")?.value;

  if (!session || !email || !role || !ALLOWED_ROLES.has(role)) {
    return NextResponse.json(
      { ok: false, message: "Please log in to upload evidence images." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const context = String(formData.get("context") ?? "general");
  const entries = formData.getAll("files");
  const files = entries.filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return NextResponse.json(
      { ok: false, message: "Please choose at least one image to upload." },
      { status: 400 },
    );
  }

  const uploads: { name: string; url: string }[] = [];
  try {
    for (const file of files) {
      const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
      const pathname = `verdansc/${role}/${context}/${Date.now()}-${safeName}`;
      const blob = await put(pathname, file, {
        access: "public",
      });
      uploads.push({ name: file.name, url: blob.url });
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Could not upload images. Confirm Blob storage is configured in this environment.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    uploads,
  });
}

