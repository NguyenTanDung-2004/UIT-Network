"use client";

import React, { useState } from "react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageForm {
  name: string;
  intro: string;
  phone: string;
  email: string;
  avtUrl: string;
  backgroundUrl: string;
}

const CreatePage: React.FC = () => {
  const [form, setForm] = useState<PageForm>({
    name: "",
    intro: "",
    phone: "",
    email: "",
    avtUrl: "",
    backgroundUrl: "",
  });
  const [avtFile, setAvtFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "background"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "avatar") {
        setAvtFile(file);
        setForm((prev) => ({ ...prev, avtUrl: URL.createObjectURL(file) }));
      } else {
        setBackgroundFile(file);
        setForm((prev) => ({
          ...prev,
          backgroundUrl: URL.createObjectURL(file),
        }));
      }
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/test-cloudinary", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // The backend API returns { url: ..., public_id: ... }
        // The frontend expects the URL string
        return data.url;
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalForm = { ...form };

      if (avtFile) {
        const avtUrl = await uploadImage(avtFile);
        finalForm = { ...finalForm, avtUrl };
      }

      if (backgroundFile) {
        const backgroundUrl = await uploadImage(backgroundFile);
        finalForm = { ...finalForm, backgroundUrl };
      }

      alert("Page created successfully!. Info: " + JSON.stringify(finalForm));

      setForm({
        name: "",
        intro: "",
        phone: "",
        email: "",
        avtUrl: "",
        backgroundUrl: "",
      });
      setAvtFile(null);
      setBackgroundFile(null);
    } catch (error) {
      // This alert appears if any upload fails
      alert("Failed to create Page. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <div className="flex justify-center items-center w-full h-[calc(100vh-100px)]">
        <ClipLoader
          color="#FF69B4"
          loading={true}
          size={35}
          aria-label="Loading Spinner"
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-y-auto py-8">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-8 md:p-10 max-w-2xl mx-auto border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Create New Page
          </h2>
          <button
            onClick={() => router.push("/create-page")}
            className="px-3 py-1 text-sm font-medium rounded-md transition-colors bg-primaryLight  text-primary  hover:bg-primary/30 flex-shrink-0 dark:bg-primary/30 dark:text-white dark:hover:bg-primary/20"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={form.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="intro"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Introduction
            </label>
            <textarea
              id="intro"
              name="intro"
              value={form.intro}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 "
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
              />
            </div>
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

          {/* Background Upload */}
          <div>
            <label
              htmlFor="background"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Background Image
            </label>
            <input
              type="file"
              id="background"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "background")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
            />
            {form.backgroundUrl && (
              <div className="mt-2 relative h-56 rounded-md overflow-hidden">
                <Image
                  src={form.backgroundUrl}
                  alt="Background preview"
                  fill={true}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 text-sm font-medium rounded-md transition-colors bg-primary text-white hover:bg-pink-200 hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
