"use client";

import React, { useState, useEffect, useMemo } from "react";
import NotificationFilter, {
  NotificationFilterType,
} from "@/components/notifications/NotificationFilter";
import NotificationCard from "@/components/notifications/NotificationCard";
import { ClipLoader } from "react-spinners";

interface NotificationItemData {
  id: string;
  avatar: string;
  content: React.ReactNode;
  timestamp: Date;
  read: boolean;
  link?: string;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const ITEMS_PER_PAGE = 10;

async function fetchNotifications(
  page = 1,
  limit = 25
): Promise<{
  notifications: NotificationItemData[];
  total: number;
  unreadCount: number;
}> {
  console.log(`Fetching notifications: page ${page}, limit ${limit}`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const totalNotifications = 27;
  let unreadCount = 0;

  const mockData: NotificationItemData[] = Array.from({
    length: totalNotifications,
  })
    .map((_, i) => {
      const id = `notif-${i + 1}`;
      const isRead = Math.random() > 0.4;
      if (!isRead) {
        unreadCount++;
      }
      const type = Math.floor(Math.random() * 4);
      let content: React.ReactNode;
      let link: string | undefined;
      let timestamp = new Date(
        Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7
      );

      switch (type) {
        case 0:
          content = (
            <>
              <span className="font-semibold">User {i + 1}</span> sent you a
              friend request.
            </>
          );
          link = `/profiles/user-${i + 1}`;
          break;
        case 1:
          content = (
            <>
              <span className="font-semibold">Another User</span> mentioned you
              in a comment on{" "}
              <span className="font-semibold">Post Title {i % 5}</span>.
            </>
          );
          link = `/posts/post-abc${i % 5}`;
          break;
        case 2:
          content = (
            <>
              <span className="font-semibold">Someone Else</span> and{" "}
              {Math.floor(Math.random() * 5) + 1} others liked your post.
            </>
          );
          link = `/posts/my-post-${i}`;
          break;
        case 3:
          content = (
            <>
              <span className="font-semibold">Admin Person</span> invited you to
              join the group{" "}
              <span className="font-semibold">Awesome Group {i % 3}</span>.
            </>
          );
          link = `/groups/group-${i % 3}`;
          break;
        default:
          content = <>Generic notification content number {i + 1}.</>;
          break;
      }

      return {
        id,
        avatar: DEFAULT_AVATAR,
        content,
        timestamp,
        read: isRead,
        link,
      };
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return { notifications: mockData, total: totalNotifications, unreadCount };
}

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] =
    useState<NotificationFilterType>("all");
  const [allNotifications, setAllNotifications] = useState<
    NotificationItemData[]
  >([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetchNotifications()
      .then(({ notifications, unreadCount: fetchedUnreadCount }) => {
        if (isMounted) {
          setAllNotifications(notifications);
          setUnreadCount(fetchedUnreadCount);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch notifications:", err);
        if (isMounted) {
          setError("Could not load notifications.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return allNotifications;
    }
    return allNotifications.filter((notif) =>
      activeFilter === "read" ? notif.read : !notif.read
    );
  }, [allNotifications, activeFilter]);

  const displayedNotifications = useMemo(() => {
    return filteredNotifications.slice(0, visibleCount);
  }, [filteredNotifications, visibleCount]);

  const handleShowMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, filteredNotifications.length)
    );
  };

  const handleShowLess = () => {
    setVisibleCount(ITEMS_PER_PAGE);
    const listElement = document.getElementById("notification-list-container");
    listElement?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNotificationClick = (id: string, link?: string) => {
    console.log(`Notification ${id} clicked.`);
    const notificationToUpdate = allNotifications.find((n) => n.id === id);
    if (notificationToUpdate && !notificationToUpdate.read) {
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const remainingCount = filteredNotifications.length - visibleCount;
  const canShowMore = remainingCount > 0;
  const canShowLess =
    !canShowMore &&
    visibleCount > ITEMS_PER_PAGE &&
    filteredNotifications.length > ITEMS_PER_PAGE;

  const showMoreText = `Show ${Math.min(remainingCount, ITEMS_PER_PAGE)} more`;

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
        <ClipLoader
          color="#FF69B4"
          loading={true}
          size={35}
          aria-label="Loading Notifications"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 ">
      <div className=" bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-screen my-6 md:my-10 lg:my-12 sm:my-8 mx-10 sm:mx-16 md:mx-20 lg:mx-28 ">
        <div className="px-4 pt-4 md:p-6 pb-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-4 ">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="ml-3 px-2 py-0.5 bg-pink-100 text-primary rounded-full text-xs font-medium ">
                {unreadCount} new
              </span>
            )}
          </div>
          <NotificationFilter
            activeFilter={activeFilter}
            onFilterChange={(newFilter) => {
              setActiveFilter(newFilter);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
          />
        </div>

        <div
          id="notification-list-container"
          className={`border-t border-gray-100 dark:border-gray-700 ${
            !displayedNotifications.length ? "border-none" : ""
          }`}
        >
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))
          ) : (
            <div className="text-center py-16 px-4 text-gray-500 dark:text-gray-400">
              No notifications to display matching this filter.
            </div>
          )}
        </div>

        {(canShowMore || canShowLess) && (
          <div className="border-t border-gray-100 dark:border-gray-700 p-4 text-center">
            <button
              onClick={canShowMore ? handleShowMore : handleShowLess}
              className="text-sm font-medium text-primary hover:underline focus:outline-none"
            >
              {canShowMore ? showMoreText : "Show less"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
