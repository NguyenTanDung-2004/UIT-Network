import { NextResponse } from "next/server";
import { supabase } from "../../(lib)/supabaseClient"; // Đường dẫn tới file supabaseClient.ts

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Chuyển file thành arrayBuffer để upload
    const fileBuffer = await file.arrayBuffer();
    const filePath = `${Date.now()}-${file.name}`;

    // Upload lên Supabase Storage
    const { data, error } = await supabase.storage
      .from("files") // Đổi 'files' thành bucket của bạn
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Lấy public URL của file
    const { data: publicUrlData } = supabase.storage
      .from("files")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
