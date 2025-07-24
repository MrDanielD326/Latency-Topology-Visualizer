"use client";

import { useMemo, useState, useEffect } from "react";
import { Activity, Server, Zap, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { PerformanceMetrics as IPerformanceMetrics, PerformanceMetricsProps } from "@/types";
import { formatLatency } from "@/lib/utils";
import { motion } from "framer-motion";

export default function PerformanceMetrics({ exchanges, cloudRegions, latencyData }: PerformanceMetricsProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
    setAnimationTrigger((prev) => prev + 1);
  }, [latencyData, isInitialLoad]);

  const metrics: IPerformanceMetrics = useMemo(() => {
    const totalExchanges = exchanges.length;
    const totalRegions = cloudRegions.length;
    const activeConnections = latencyData.length;
    const averageLatency = latencyData.length > 0 ? latencyData.reduce((sum, data) => sum + data.latency, 0) / latencyData.length : 0;

    let systemHealth: IPerformanceMetrics["systemHealth"] = "good";
    if (averageLatency > 150) systemHealth = "critical";
    else if (averageLatency > 100) systemHealth = "warning";

    return {
      totalExchanges,
      totalRegions,
      activeConnections,
      averageLatency,
      systemHealth
    };
  }, [exchanges, cloudRegions, latencyData]);

  const getHealthColor = (health: IPerformanceMetrics["systemHealth"]) => {
    switch (health) {
      case "good": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "critical": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getHealthIcon = (health: IPerformanceMetrics["systemHealth"]) => {
    switch (health) {
      case "good": return <CheckCircle className="w-5 h-5" />;
      case "warning":
      case "critical": return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const metricCards = [
    {
      title: "Active Connections",
      value: metrics.activeConnections,
      icon: <Activity className="w-5 h-5" />,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Avg Latency",
      value: formatLatency(metrics.averageLatency),
      icon: <TrendingUp className="w-5 h-5" />,
      color: getHealthColor(metrics.systemHealth),
      bgColor:
        metrics.systemHealth === "good"
          ? "bg-green-500/10"
          : metrics.systemHealth === "warning"
            ? "bg-yellow-500/10"
            : "bg-red-500/10"
    },
    {
      title: "Total Exchanges",
      value: metrics.totalExchanges,
      icon: <Server className="w-5 h-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Cloud Regions",
      value: metrics.totalRegions,
      icon: <Zap className="w-5 h-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <motion.div
      className="component-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="component-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="component-title">
          <Activity className="w-5 h-5 text-white" />
          <h3> Performance Metrics </h3>
        </div>
        <motion.div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 ${getHealthColor(
            metrics.systemHealth
          )} interactive-card`}
          whileHover={{ scale: 1.05 }}
          animate={
            metrics.systemHealth === "critical" ? { scale: [1, 1.05, 1], transition: { duration: 1, repeat: Infinity } } : {}
          }
        >
          <motion.div
            animate={
              metrics.systemHealth === "critical" ? { rotate: [0, 10, -10, 0] } : {}
            }
            transition={{
              duration: 0.5,
              repeat: metrics.systemHealth === "critical" ? Infinity : 0
            }}
          >
            {getHealthIcon(metrics.systemHealth)}
          </motion.div>
          <span className="text-sm font-medium capitalize">
            {metrics.systemHealth}
          </span>
        </motion.div>
      </motion.div>

      <div className="pb-4 mb-4 border-b border-white/10 mt-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="text-slate-400 font-mono text-xs">
            Last update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {metricCards.map((card, index) => (
          <>
            {card.title === "Active Connections" && (
              <motion.div
                className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden"
                initial={isInitialLoad ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={isInitialLoad ? { delay: 0.5 } : { duration: 0 }}
              >
                <motion.div
                  className="h-full bg-green-400"
                  initial={
                    isInitialLoad ? { width: 0 } : { width: `${((card.value as number) / 50) * 100}%` }
                  }
                  animate={{
                    width: `${((card.value as number) / 50) * 100}%`
                  }}
                  transition={
                    isInitialLoad ? { duration: 1, ease: "easeOut" } : { duration: 0 }
                  }
                />
              </motion.div>
            )}
            <motion.div
              key={`${card.title}-${animationTrigger}`}
              initial={
                isInitialLoad ? { opacity: 0, y: 20, scale: 0.9 } : { opacity: 1, y: 0, scale: 1 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={
                isInitialLoad ? { delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 } : { duration: 0 }
              }
              className={`bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10 interactive-card cursor-pointer ${selectedCard === card.title ? "bg-white/15 border-white/30" : ""
                }`}
              onClick={() =>
                setSelectedCard(selectedCard === card.title ? null : card.title)
              }
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <motion.div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                  {card.icon}
                </motion.div>
                <div className="text-sm text-slate-400 font-medium">
                  {card.title}
                </div>
                <div className="text-right">
                  <motion.div
                    className="text-xl font-bold text-white"
                    key={`${card.title}-value-${card.value}`}
                    initial={
                      isInitialLoad ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }
                    }
                    animate={{ scale: 1, opacity: 1 }}
                    transition={
                      isInitialLoad ? { duration: 0.3 } : { duration: 0 }
                    }
                  >
                    {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        ))}
      </div>
    </motion.div>
  );
}
