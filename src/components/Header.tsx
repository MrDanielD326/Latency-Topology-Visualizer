"use client";

import { Zap, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HeaderProps } from "@/types";

export default function Header({ onControlPanelToggle, isControlPanelOpen }: HeaderProps) {
  const [dataRate, setDataRate] = useState(0);

  useEffect(() => {
    const dataInterval = setInterval(() => {
      setDataRate(Math.floor(Math.random() * 100) + 50);
    }, 2000);

    return () => {
      clearInterval(dataInterval);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/80 border-b border-white/5 px-4 py-3"
      style={{ margin: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image src="/brandLogo.png" alt="Brand Logo" width={40} height={40} className="object-contain" />
          <h1 className="text-lg font-semibold text-white tracking-tight">
            Latency Topology Visualizer
          </h1>
        </div>

        <motion.div
          className="flex items-center space-x-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Real-time Status */}
          <div className="hidden lg:flex items-center space-x-3">
            <motion.div
              className="flex items-center space-x-2 px-2 py-1 rounded-md bg-black/60 border border-white/8"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full status-online bg-green-400`}
              ></div>
              <span className="text-xs text-green-400 font-medium">Live</span>
            </motion.div>

            <motion.div
              className="flex items-center space-x-2 px-2 py-1 rounded-md bg-black/60 border border-white/8"
              whileHover={{ scale: 1.05 }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400 font-mono">
                {dataRate} Hz
              </span>
            </motion.div>
          </div>

          {/* Control Panel Button */}
          <motion.button
            onClick={onControlPanelToggle}
            className="p-2 rounded-md hover:bg-white/10 transition-colors interactive-button ripple border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <Settings className={`w-4 h-4 ${isControlPanelOpen ? "text-blue-400" : "text-white"}`} />
            </div>
          </motion.button>

          {/* Mobile Status */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full status-online"></div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
