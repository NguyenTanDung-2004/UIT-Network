"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "next/navigation";
import { getMockGroupInfo, mockUpdateGroupInfo, Group } from "@/lib/mockData";

interface GroupIdParams {
  id: string;
}

const UpdateGroupInfoPage: React.FC = () => {
  const params = useParams();
  const groupId = params.id as string;

  const [form, setForm] = useState<Partial<Group>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avtFile, setAvtFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  useEffect(() => {
    if (groupId) {
      setLoading(true);
      const timer = setTimeout(() => {
        const groupInfo = getMockGroupInfo(groupId);
        if (groupInfo) {
          setForm({
            name: groupInfo.name,
            intro: groupInfo.intro,
            phone: groupInfo.phone,
            email: groupInfo.email,
            avtUrl: groupInfo.avtUrl,
            backgroundUrl: groupInfo.backgroundUrl,
          });
        } else {
          console.error(`Group with ID ${groupId} not found.`);
          alert(`Group with ID ${groupId} not found.`);
        }
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [groupId]);

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
    console.log("Mock: Uploading file", file.name);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `https://mock-upload-url/${Date.now()}-${file.name}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let updatedData: Partial<Group> = { ...form };

      if (avtFile) {
        const avtUrl = await uploadImage(avtFile); //
        updatedData.avtUrl = avtUrl;
      }

      if (backgroundFile) {
        const backgroundUrl = await uploadImage(backgroundFile);
        updatedData.backgroundUrl = backgroundUrl;
      }

      const success = mockUpdateGroupInfo(groupId, updatedData);

      if (success) {
        console.log("Mock: Group updated:", updatedData);
        alert("Group information updated successfully!");
        setAvtFile(null);
        setBackgroundFile(null);
      } else {
        alert("Failed to update group information.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update group information.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ClipLoader color="#FF70D9" loading={true} size={35} />
      </div>
    );
  }

  return (
    // The main container and title are handled by the layout
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Group Name
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

      {/* Intro */}
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
          value={form.intro || ""}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Phone */}
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
            value={form.phone || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
          />
        </div>

        {/* Email */}
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
            value={form.email || ""}
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
          Group Avatar
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

export default UpdateGroupInfoPage;
