"use client";

import React, { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PrivacySettings {
  friendCount: boolean; // true = public, false = private
  followerCount: boolean;
  educationInfo: boolean;
}

const SettingPage: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    friendCount: true,
    followerCount: true,
    educationInfo: true,
  });
  const { toast } = useToast();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
      variant: "default",
    });
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handlePrivacyToggle = (key: keyof PrivacySettings) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Privacy Settings Saved",
      description: "Your privacy settings have been updated successfully.",
      variant: "default",
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-screen my-6 md:my-10 lg:my-12 sm:my-8 mx-10 sm:mx-16 md:mx-20 lg:mx-28 border border-gray-100 dark:border-gray-700">
        <div className="px-4 pt-4 md:p-6 pb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Settings
          </h2>
          <div className="space-y-8">
            {/* Change Password Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Change Password
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                Update your password to keep your account secure.
              </p>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium rounded-md transition-colors bg-primary text-white hover:bg-pink-200 hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </section>

            {/* Profile Privacy Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Profile Privacy
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                Control who can see your profile information. Toggle to set each
                field as Public (visible to everyone) or Private (visible only
                to you).
              </p>
              <form onSubmit={handlePrivacySubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Friend Count
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Show the number of friends on your profile.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.friendCount}
                        onChange={() => handlePrivacyToggle("friendCount")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Follower Count
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Show the number of followers on your profile.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.followerCount}
                        onChange={() => handlePrivacyToggle("followerCount")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Education Info
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Show your education details on your profile.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.educationInfo}
                        onChange={() => handlePrivacyToggle("educationInfo")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium rounded-md transition-colors bg-primary text-white hover:bg-pink-200 hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80"
                  >
                    Save Privacy Settings
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
