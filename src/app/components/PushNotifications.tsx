"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

export default function PushNotifs({ setNotifications }: { setNotifications: (notifs: any) => void }) {
  const [showNotif, setShowNotif] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [quote, setQuote] = useState("🔔 Fetching new quote...");

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const fetchQuote = async () => {
    try {
      const res = await fetch("/api/groq");
      const data = await res.json();
      setQuote(data.quote || "Stay positive and keep going!");
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote("Keep pushing forward! 💪");
    }
  };

  const requestPermission = () => {
    Notification.requestPermission().then((perm) => {
      setPermission(perm);
    });
  };

  const sendNotification = async () => {
    if (permission === "denied") {
      alert("Notifications are blocked in your browser settings.");
      return;
    }
  
    if (permission === "default") {
      requestPermission();
      return;
    }
  
    await fetchQuote(); 
  
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  
    const newNotification = {
      id: Date.now(),
      message: quote,
      timestamp: new Date().toLocaleTimeString(),
    };
  
    const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    const updatedNotifications = [newNotification, ...storedNotifications].slice(0, 10);
  
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
  
    if (permission === "granted") {
      new Notification("✨ New Quote!", {
        body: quote,
        icon: "/bell-icon.png",
      });
  
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  };
  
  return (
    <div className="relative w-full flex justify-center">
      <button
        onClick={sendNotification}
        className="w-full max-w-xs rounded-md border border-[#a560ff] px-4 py-2 text-sm font-semibold text-[#a560ff] transition-all duration-300 hover:scale-110 hover:bg-[#a560ff] hover:text-white"
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
            className="fixed top-5 right-5 md:right-10 bg-[#1b0f2f] border border-[#a560ff] shadow-lg p-4 rounded-lg text-white flex items-center gap-3 max-w-xs"
          >
            <Bell className="text-[#a560ff]" />
            <div>
              <p className="font-semibold">New Notification</p>
              <p className="text-sm text-gray-300">{quote}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
