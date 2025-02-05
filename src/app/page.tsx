"use client";

import Image from "next/image";
import { useState } from "react";

function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("/api/test-cloudinary", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url);
      } else {
        const errorText = await response.text();
        console.error("Upload failed:", errorText); // Log error text từ response
        alert(`Upload failed: ${errorText}`); // Hiển thị thông báo lỗi cho người dùng
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please check the console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload Image to Cloudinary</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Upload" : "Uploading..."}
      </button>

      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <Image
            src={imageUrl}
            alt="Uploaded"
            width={300} // Đặt chiều rộng mong muốn
            height={200} // Đặt chiều cao mong muốn
            style={{ maxWidth: "300px", height: "auto" }} // Giữ tỷ lệ khung hình
          />
          <p>
            Image URL:
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              {imageUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
