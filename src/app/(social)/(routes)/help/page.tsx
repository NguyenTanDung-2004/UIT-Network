"use client";

import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";

const HelpPage: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feedback Sent",
      description: "Thank you for your feedback! We'll review it soon.",
      variant: "default",
    });
    setFeedback("");
  };

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-screen my-6 md:my-10 lg:my-12 sm:my-8 mx-10 sm:mx-16 md:mx-20 lg:mx-28 border border-gray-100 dark:border-gray-700">
        <div className="px-4 pt-4 md:p-6 pb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Help & Support
          </h2>
          <div className="space-y-8">
            {/* About Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                About Us
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Welcome to our social platform, designed exclusively for UIT
                students to connect, collaborate, and build meaningful
                friendships. Whether you're looking for study buddies, project
                partners, or friends to share your university journey, our
                platform helps you find and connect with like-minded peers.
                Created by two passionate UIT students, we aim to foster a
                vibrant community where every student feels supported and
                connected.
              </p>
            </section>

            {/* Contact Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Contact Us
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-2">
                Have questions or need assistance? We're here to help! Reach out
                to us through the following channels:
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Phone:
                  </span>
                  <a
                    href="tel:+84926200400"
                    className="hover:text-primary dark:hover:text-primary"
                  >
                    (+84) 926 200 410
                  </a>
                </li>
                <li>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Email:
                  </span>
                  <a
                    href="mailto:support@uitconnect.com"
                    className="hover:text-primary dark:hover:text-primary"
                  >
                    support@uitconnect.com
                  </a>
                </li>
                <li>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Facebook:
                  </span>
                  <a
                    href="https://facebook.com/uitconnect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary dark:hover:text-primary"
                  >
                    facebook.com/uitconnect
                  </a>
                </li>
                <li>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Instagram:
                  </span>
                  <a
                    href="https://instagram.com/uitconnect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary dark:hover:text-primary"
                  >
                    @uitconnect
                  </a>
                </li>
              </ul>
            </section>

            {/* Credits Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Our Team
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                This platform was proudly created by two dedicated students from
                the University of Information Technology (UIT). Our mission is
                to empower students to build strong connections and make their
                university experience unforgettable.
              </p>
            </section>

            {/* Feedback Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Send Feedback
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                We value your input! Share your thoughts, suggestions, or issues
                to help us improve your experience.
              </p>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium rounded-md transition-colors bg-primary text-white hover:bg-pink-200 hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80"
                  >
                    Send
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

export default HelpPage;
