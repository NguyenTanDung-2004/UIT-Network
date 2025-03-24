import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    console.log("Received URL:", url);

    // Lấy file path từ URL
    const filePath = url.split("/object/public/files/")[1];
    if (!filePath) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }

    console.log("Extracted file path:", filePath);

    // Gọi Supabase API để xóa file
    const { data, error } = await supabaseAdmin.storage
      .from("files")
      .remove([filePath]);

    console.log("Supabase delete response:", { data, error });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
