"use client";

import { useState, useMemo } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Clock, TrendingUp, TrendingDown, Minus, Activity, Zap } from "lucide-react";
import { LatencyChartProps, TimeRange } from "@/types";
import { formatLatency } from "@/lib/utils";
import { format } from "date-fns";

export default function LatencyChart({ data, selectedPair, onTimeRangeChange }: LatencyChartProps) {
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>("24h");

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "1h", label: "1 Hour" },
    { value: "24h", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" }
  ];

  const chartData = useMemo(() => {
    // Filter and format data
    return data
      .filter((item) => item.latency > 0) // Only show valid latency data
      .map((item) => ({
        timestamp: item.timestamp,
        latency: item.latency,
        formattedTime: format(
          new Date(item.timestamp),
          activeTimeRange === "1h"
            ? "HH:mm"
            : activeTimeRange === "24h"
              ? "HH:mm"
              : activeTimeRange === "7d"
                ? "MMM dd"
                : "MMM dd"
        ),
      }))
      .sort((a, b) => a.timestamp - b.timestamp); // Ensure data is sorted by time
  }, [data, activeTimeRange]);

  const stats = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 0, avg: 0, trend: 0 };

    const latencies = data.map((d) => d.latency);
    const min = Math.min(...latencies);
    const max = Math.max(...latencies);
    const avg = latencies.reduce((sum, val) => sum + val, 0) / latencies.length;

    // Calculate trend (simple linear regression slope)
    const n = latencies.length;
    const sumX = latencies.reduce((sum, _, i) => sum + i, 0);
    const sumY = latencies.reduce((sum, val) => sum + val, 0);
    const sumXY = latencies.reduce((sum, val, i) => sum + i * val, 0);
    const sumXX = latencies.reduce((sum, _, i) => sum + i * i, 0);
    const trend = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    return { min, max, avg, trend };
  }, [data]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setActiveTimeRange(range);
    onTimeRangeChange(range);
  };

  const getTrendIcon = () => {
    if (stats.trend > 1) return <TrendingUp className="w-4 h-4 text-red-400" />;
    if (stats.trend < -1) return <TrendingDown className="w-4 h-4 text-green-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (stats.trend > 1) return "text-red-400";
    if (stats.trend < -1) return "text-green-400";
    return "text-gray-400";
  };

  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{
      payload: { timestamp: number; latency: number };
      value: number;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const latencyValue = payload[0].value;
      const getLatencyColor = (latency: number) => {
        if (latency < 50) return "text-green-400";
        if (latency < 100) return "text-yellow-400";
        return "text-red-400";
      };

      return (
        <div className="bg-black/95 backdrop-blur-md border border-gray-800 rounded-lg p-3 shadow-2xl">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-3 h-3 text-gray-400" />
            <p className="text-gray-300 text-xs font-medium">
              {format(new Date(data.timestamp), "MMM dd, HH:mm")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-400" />
            <p className={`font-bold text-sm ${getLatencyColor(latencyValue)}`}>
              {formatLatency(latencyValue)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-black/95 backdrop-blur-md border border-gray-800/60 rounded-lg p-3 shadow-2xl relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pr-8">
        <div className="flex items-center space-x-2">
          <div>
            <h3 className="text-sm font-bold text-white">Latency Analysis</h3>
            <p className="text-gray-500 text-xs">Performance data</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-gray-900/60 rounded px-2 py-1 border border-gray-800/50">
          {getTrendIcon()}
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <span className={`font-semibold text-xs ${getTrendColor()}`}>
              {Math.abs(stats.trend).toFixed(1)}
            </span>
            <span> ms/hr </span>
          </div>
        </div>
      </div>

      {/* Selected Pair */}
      {selectedPair && (
        <div className="mb-3 p-2 bg-gray-900/40 rounded border border-gray-800/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                <Activity className="w-2 h-2 text-gray-400" />
                <p className="text-gray-400 text-xs font-medium">Connection</p>
              </div>
              <p className="text-white font-semibold text-xs">{selectedPair}</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">LIVE</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-900/60 rounded p-2 border border-gray-800/50 text-center transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center mb-0.5">
            <TrendingDown className="w-3 h-3 text-green-400" />
          </div>
          <div className="text-sm font-bold text-green-400 mb-0.5">
            {formatLatency(stats.min)}
          </div>
          <div className="text-xs text-gray-400 font-medium">Min</div>
        </div>
        <div className="bg-gray-900/60 rounded p-2 border border-gray-800/50 text-center transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center mb-0.5">
            <Minus className="w-3 h-3 text-gray-300" />
          </div>
          <div className="text-sm font-bold text-gray-300 mb-0.5">
            {formatLatency(stats.avg)}
          </div>
          <div className="text-xs text-gray-400 font-medium">Avg</div>
        </div>
        <div className="bg-gray-900/60 rounded p-2 border border-gray-800/50 text-center transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center mb-0.5">
            <TrendingUp className="w-3 h-3 text-red-400" />
          </div>
          <div className="text-sm font-bold text-red-400 mb-0.5">
            {formatLatency(stats.max)}
          </div>
          <div className="text-xs text-gray-400 font-medium">Max</div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-1 mb-3">
        <Clock className="w-2 h-2 text-gray-500" />
        <span className="text-xs font-medium text-gray-400 mr-1">Range:</span>
        <div className="flex space-x-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleTimeRangeChange(range.value)}
              className={`px-2 py-1 text-xs font-medium rounded transition-all duration-300 ${activeTimeRange === range.value
                ? "bg-gray-800 text-white shadow-sm border border-gray-700"
                : "bg-gray-900/60 text-gray-400 hover:bg-gray-800/80 border border-gray-800/50 backdrop-blur-sm"
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 bg-black/60 rounded p-2 border border-gray-800/40 backdrop-blur-sm">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6b7280" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#4b5563" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#374151" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="50%" stopColor="#6b7280" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid
              strokeDasharray="1 2"
              stroke="#374151"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="formattedTime"
              stroke="#6b7280"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280" }}
              tickFormatter={(value) => `${value}ms`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="url(#strokeGradient)"
              strokeWidth={1.5}
              fill="url(#latencyGradient)"
              filter="url(#glow)"
              dot={{ fill: "#6b7280", strokeWidth: 1, r: 2 }}
              activeDot={{
                r: 4,
                fill: "#9ca3af",
                stroke: "#4b5563",
                strokeWidth: 1
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center mt-2 space-x-3 text-xs bg-gray-900/40 rounded p-2 border border-gray-800/40">
        <div className="flex items-center space-x-1 group">
          <div className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-110 transition-transform"></div>
          <span className="text-gray-300 font-medium">Good (&lt; 50ms)</span>
        </div>
        <div className="flex items-center space-x-1 group">
          <div className="w-2 h-2 bg-yellow-400 rounded-full group-hover:scale-110 transition-transform"></div>
          <span className="text-gray-300 font-medium">OK (50-100ms)</span>
        </div>
        <div className="flex items-center space-x-1 group">
          <div className="w-2 h-2 bg-red-400 rounded-full group-hover:scale-110 transition-transform"></div>
          <span className="text-gray-300 font-medium">Poor (&gt; 100ms)</span>
        </div>
      </div>
    </div>
  );
}
