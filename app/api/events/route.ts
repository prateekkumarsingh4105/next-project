import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { message: "A valid image file is required" },
        { status: 400 }
      );
    }

    // Safely parse JSON arrays from FormData once
    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags") as string)
      : [];
    const agenda = formData.get("agenda")
      ? JSON.parse(formData.get("agenda") as string)
      : [];

    // Convert file to Base64 URI string for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Direct HTTP POST to Cloudinary (Bypasses SDK signature issues)
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", fileBase64);
    cloudinaryFormData.append("upload_preset", "nextjs course");
    cloudinaryFormData.append("folder", "DevEvent");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "vu2sunx2";

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    const uploadData = await cloudinaryRes.json();

    if (!cloudinaryRes.ok) {
      console.error("Cloudinary Error Output:", uploadData);
      throw new Error(uploadData?.error?.message || "Cloudinary Upload Failed");
    }

    const imageUrl = uploadData.secure_url;

    // Extract all text fields from formData into rawData
    const rawData = Object.fromEntries(formData.entries());

    // Remove raw unparsed fields to avoid conflicts
    delete rawData.image;
    delete rawData.tags;
    delete rawData.agenda;

    // Save to Database
    const createdEvent = await Event.create({
      ...rawData,
      image: imageUrl,
      tags,
      agenda,
    });

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("POST /api/events error:", e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e?.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Event fetching failed", error: e?.message || e },
      { status: 500 }
    );
  }
}