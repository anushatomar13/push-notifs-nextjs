"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import PushNotifs from "./PushNotifications";

export default function NotificationPage() {
  const [ripples, setRipples] = useState<{ id: number; delay: number }[]>([]);
  const [count, setCount] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRipples = [
        { id: count, delay: 0 },
        { id: count + 1, delay: 0.3 },
        { id: count + 2, delay: 0.6 },
      ];

      setRipples((prev) => [...prev, ...newRipples]);
      setCount((prev) => prev + 3);

      setScale(1.3);
      setTimeout(() => setScale(1), 1.5 * 1000);

      setTimeout(() => {
        setRipples((oldRipples) => oldRipples.filter((r) => r.id >= count + 3));
      }, 3000);
    }, 2500);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0214]">
      <div className="relative w-80 min-h-[600px] flex flex-col justify-between rounded-xl bg-gradient-to-b from-[#1b0f2f] to-[#0a0214] p-8 text-center text-white shadow-lg">
        
        <div className="relative flex items-center justify-center mt-30">
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 2.5, delay: ripple.delay, ease: "easeOut" }}
              className="absolute h-24 w-24 rounded-full border border-[#a560ff] bg-[#a560ff]/10"
            />
          ))}
          <motion.div
            animate={{ scale }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 flex items-center justify-center"
          >
            <Bell className="h-16 w-16 text-[#a560ff]" />
          </motion.div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="mt-4 text-lg font-semibold">Hola!</h2>
          <p className="text-sm text-gray-400">Lorem ipsum dolor sit amet.</p>
        </div>

        <PushNotifs />
      </div>
    </div>
  );
}
