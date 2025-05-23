"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "next/navigation";
import { getMockPageInfo, mockUpdatePageInfo, Page } from "@/lib/mockData"; // Adjust path

interface PageIdParams {
  id: string;
}

const UpdatePageInfoPage: React.FC = () => {
  const params = useParams();
  const pageId = params.id;

  const [form, setForm] = useState<Partial<Page>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avtFile, setAvtFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    if (pageId) {
      setLoading(true);
      const timer = setTimeout(() => {
        const idStr = Array.isArray(pageId) ? pageId[0] : pageId;
        const pageInfo = getMockPageInfo(idStr);
        if (pageInfo) {
          setForm({
            name: pageInfo.name,
            bio: pageInfo.bio,
            avtUrl: pageInfo.avtUrl,
            coverUrl: pageInfo.coverUrl,
          });
        } else {
          console.error(`Page with ID ${idStr} not found.`);
          alert(`Page with ID ${idStr} not found.`);
        }
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pageId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "avatar") {
        setAvtFile(file);
        setForm((prev) => ({ ...prev, avtUrl: URL.createObjectURL(file) }));
      } else {
        setCoverFile(file);
        setForm((prev) => ({
          ...prev,
          coverUrl: URL.createObjectURL(file),
        }));
      }
    }
  };

  // Replace with your actual image upload function
  const uploadImage = async (file: File): Promise<string> => {
    console.log("Mock: Uploading file", file.name);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `https://mock-upload-url/${Date.now()}-${file.name}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let updatedData: Partial<Page> = { ...form };

      if (avtFile) {
        const avtUrl = await uploadImage(avtFile);
        updatedData.avtUrl = avtUrl;
      }

      if (coverFile) {
        const coverUrl = await uploadImage(coverFile);
        updatedData.coverUrl = coverUrl;
      }

      const idStr = Array.isArray(pageId) ? pageId[0] : pageId ?? "";
      const success = mockUpdatePageInfo(idStr, updatedData); // Use your actual update API call

      if (success) {
        console.log("Mock: Page updated:", updatedData);
        alert("Page information updated successfully!");
        setAvtFile(null);
        setCoverFile(null);
      } else {
        alert("Failed to update page information.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update page information.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ClipLoader color="#FF69B4" loading={true} size={35} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Page Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name || ""}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
        />
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={form.bio || ""}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
        />
      </div>

      {/* Avatar Upload */}
      <div>
        <label
          htmlFor="avatar"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Page Avatar
        </label>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "avatar")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
        />
        {form.avtUrl && (
          <div className="mt-2 relative h-48 rounded-md overflow-hidden">
            <Image
              src={form.avtUrl}
              alt="Avatar preview"
              fill={true}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Cover Upload */}
      <div>
        <label
          htmlFor="cover"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Cover Image
        </label>
        <input
          type="file"
          id="cover"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "cover")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
        />
        {form.coverUrl && (
          <div className="mt-2 relative h-56 rounded-md overflow-hidden">
            <Image
              src={form.coverUrl}
              alt="Cover preview"
              fill={true}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 text-sm font-medium rounded-md transition-colors bg-primary text-white hover:bg-pink-200 hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Update"}
        </button>
      </div>
    </form>
  );
};

export default UpdatePageInfoPage;
