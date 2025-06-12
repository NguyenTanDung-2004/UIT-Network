"use client";

import React, { useState, useEffect, useMemo } from "react";
import NotificationFilter, {
  NotificationFilterType,
} from "@/components/notifications/NotificationFilter";
import NotificationCard from "@/components/notifications/NotificationCard";
import { ClipLoader } from "react-spinners";
import { useUser } from "@/contexts/UserContext";
import { getNotifications } from "@/services/notiService";
import { NotificationItemData } from "@/services/notiService";

const ITEMS_PER_PAGE = 10;

const NotificationsPage = () => {
  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

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

    const fetchAllNotifications = async () => {
      try {
        if (userContextLoading) {
          return;
        }

        if (userContextError) {
          throw new Error(userContextError);
        }

        if (!user || !user.id) {
          throw new Error("User not authenticated or ID not found.");
        }

        const fetchedNotifications = await getNotifications(user.id);

        if (isMounted) {
          const initialUnreadCount = fetchedNotifications.filter(
            (n) => !n.read
          ).length;
          setAllNotifications(fetchedNotifications);
          setUnreadCount(initialUnreadCount);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Failed to fetch notifications:", err);
        if (isMounted) {
          setError(err.message || "Could not load notifications.");
          setLoading(false);
        }
      }
    };

    fetchAllNotifications();

    return () => {
      isMounted = false;
    };
  }, [user, userContextLoading, userContextError]);

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
    const notificationToUpdate = allNotifications.find((n) => n.id === id);
    if (notificationToUpdate && !notificationToUpdate.read) {
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    if (link) {
      window.location.href = link;
    }
  };

  const remainingCount = filteredNotifications.length - visibleCount;
  const canShowMore = remainingCount > 0;
  const canShowLess =
    !canShowMore &&
    visibleCount > ITEMS_PER_PAGE &&
    filteredNotifications.length > ITEMS_PER_PAGE;

  const showMoreText = `Show ${Math.min(remainingCount, ITEMS_PER_PAGE)} more`;

  if (loading || userContextLoading) {
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

  if (error || userContextError || !user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 text-center text-red-600">
        {error ||
          userContextError ||
          "Failed to load notifications. Please log in."}
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
