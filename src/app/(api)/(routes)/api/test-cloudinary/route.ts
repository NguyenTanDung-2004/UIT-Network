import { NextResponse } from "next/server";
import { cloudinary } from "../../(lib)/cloudinary-service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { status: "error", error: "No file uploaded" },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${fileBase64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      upload_preset: "study-buddy",
      resource_type: "auto",
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Error creating service detail:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to create service detail" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { status: "error", error: "No URL provided" },
        { status: 400 }
      );
    }

    const { publicId, resourceType } = extractPublicIdAndResourceType(imageUrl);

    if (!publicId) {
      return NextResponse.json(
        {
          status: "error",
          error: "Invalid URL or public ID could not be extracted",
        },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType, // Truyền resource_type
    });

    if (result.result !== "ok") {
      return NextResponse.json(
        { status: "error", error: "Failed to delete the media" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Media deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting media:", error);
      return NextResponse.json(
        {
          status: "error",
          error: "Failed to delete media",
          details: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
    }
  }
}

function extractPublicIdAndResourceType(url: string): {
  publicId: string | null;
  resourceType: "image" | "video";
} {
  try {
    console.log("xóa media: video");
    const urlParts = new URL(url); // Sử dụng URL constructor để phân tích cú pháp URL
    const pathSegments = urlParts.pathname.split("/");
    const filenameWithExtension = pathSegments[pathSegments.length - 1];
    const filenameParts = filenameWithExtension.split(".");
    const publicId = filenameParts[0];
    const extension = filenameParts[filenameParts.length - 1].toLowerCase();

    let resourceType: "image" | "video" = "image"; // Mặc định là image
    if (["mp4", "webm", "mov", "avi"].includes(extension)) {
      resourceType = "video";
    }

    return { publicId, resourceType };
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return { publicId: null, resourceType: "image" };
  }
}
