"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

export default function PushNotifs({ setNotifications }: { setNotifications: (notifs: any) => void }) {
  const [showNotif, setShowNotif] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const requestPermission = () => {
    Notification.requestPermission().then((perm) => {
      setPermission(perm);
    });
  };

  const sendNotification = () => {
    if (permission === "default") {
      requestPermission();
      return;
    }

    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);

    const newNotification = {
      id: Date.now(),
      message: "🔔 New Notification",
      timestamp: new Date().toLocaleTimeString(),
    };

    const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    const updatedNotifications = [newNotification, ...storedNotifications].slice(0, 10);

    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);

    if (permission === "granted") {
      new Notification(newNotification.message, {
        body: "This is a browser push notification!",
        icon: "/bell-icon.png",
      });

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={sendNotification}
        className="w-full rounded-md border border-[#a560ff] px-4 py-2 text-sm font-semibold text-[#a560ff] transition-all duration-300 hover:scale-110 hover:bg-[#a560ff] hover:text-white hover:border-3 hover:border-[#d8b4ff]"
      >
        Send Notification
      </button>

      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-5 right-5 z-50 bg-[#1b0f2f] border border-[#a560ff] shadow-lg p-4 rounded-lg text-white flex items-center gap-3"
          >
            <Bell className="text-[#a560ff]" />
            <div>
              <p className="font-semibold">New Notification</p>
              <p className="text-sm text-gray-300">This assignment is submitted by Anusha Tomar!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
