import React from "react";
import { PageAboutData } from "@/types/pages/PageData";
import { Github, Linkedin, Instagram, Facebook, Globe } from "lucide-react";
import InfoItemCard from "@/components/profile/about/InfoItemCard";

interface ContactInfoContentProps {
  contactData: PageAboutData["contact"];
}

const SocialIconMap: { [key: string]: React.ElementType } = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  website: Globe,
};

const ContactInfoContent: React.FC<ContactInfoContentProps> = ({
  contactData,
}) => {
  return (
    <div className="space-y-8 min-h-[400px]">
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Contact Information
        </h4>
        <div className="space-y-3">
          {contactData.phone && (
            <InfoItemCard icon="fas fa-phone-alt" value={contactData.phone} />
          )}
          {contactData.email && (
            <InfoItemCard icon="far fa-envelope" value={contactData.email} />
          )}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Websites and Social Links
        </h4>
        <div className="space-y-3">
          {contactData.socialLinks.map((link) => {
            const Icon = SocialIconMap[link.platform.toLowerCase()] || Globe;
            return (
              <div
                key={link.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {link.url}
                </a>
              </div>
            );
          })}

          {contactData.websites.map((site) => (
            <div
              key={site.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {site.url}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoContent;
