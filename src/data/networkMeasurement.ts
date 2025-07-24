import { LatencyData, HistoricalLatency } from "@/types";
import { realExchanges, realCloudRegions } from "./realWorldData";

// Real network endpoints for testing
export const networkEndpoints = {
  exchanges: {
    "coinbase-us": "api.exchange.coinbase.com",
    "binance-malta": "api.binance.com",
    "kraken-uk": "api.kraken.com",
    "okx-sg": "www.okx.com",
    "bybit-sg": "api.bybit.com",
    "bitfinex-ch": "api.bitfinex.com",
    "upbit-kr": "api.upbit.com",
    "binance-jp": "api.binance.co.jp"
  },
  cloudProviders: {
    aws: {
      "us-east-1": "ec2.us-east-1.amazonaws.com",
      "us-west-1": "ec2.us-west-1.amazonaws.com",
      "eu-west-1": "ec2.eu-west-1.amazonaws.com",
      "ap-southeast-1": "ec2.ap-southeast-1.amazonaws.com",
      "ap-northeast-1": "ec2.ap-northeast-1.amazonaws.com"
    },
    gcp: {
      "us-central1": "compute.googleapis.com",
      "europe-west1": "europe-west1-compute.googleapis.com",
      "asia-southeast1": "asia-southeast1-compute.googleapis.com"
    },
    azure: {
      eastus: "management.azure.com",
      westeurope: "westeurope.management.azure.com",
      southeastasia: "southeastasia.management.azure.com"
    },
  },
  internetExchanges: {
    "de-cix-frankfurt": "www.de-cix.net",
    "ams-ix-amsterdam": "www.ams-ix.net",
    "linx-london": "www.linx.net",
    "equinix-ashburn": "www.equinix.com"
  },
};

// Geographic distance calculation for realistic latency estimation
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Realistic latency calculation based on distance and connection type
function calculateRealisticLatency(distance: number, connectionType: "fiber" | "satellite" | "terrestrial" = "fiber"): number {
  // Speed of light in fiber optic cable is ~200,000 km/s
  // Add network overhead, routing delays, and processing time
  const lightSpeed = connectionType === "fiber" ? 200000 : 300000; // km/s
  const baseLatency = (distance / lightSpeed) * 1000; // Convert to milliseconds

  // Add realistic network overhead
  const networkOverhead = Math.random() * 20 + 5; // 5-25ms
  const routingDelay = Math.random() * 10 + 2; // 2-12ms
  const processingDelay = Math.random() * 5 + 1; // 1-6ms

  return Math.round(baseLatency + networkOverhead + routingDelay + processingDelay);
}

// Generate realistic latency data based on actual geographic distances
export function generateRealisticLatencyData(): LatencyData[] {
  const latencyData: LatencyData[] = [];
  const timestamp = Date.now();
  let id = 0;

  // Exchange to exchange connections
  for (let i = 0; i < realExchanges.length; i++) {
    for (let j = i + 1; j < realExchanges.length; j++) {
      const exchange1 = realExchanges[i];
      const exchange2 = realExchanges[j];

      const distance = calculateDistance(
        exchange1.location.lat,
        exchange1.location.lng,
        exchange2.location.lat,
        exchange2.location.lng
      );

      const latency = calculateRealisticLatency(distance);

      latencyData.push({
        id: `exchange-${id++}`,
        fromId: exchange1.id,
        toId: exchange2.id,
        latency,
        timestamp,
        type: "exchange-to-exchange"
      });
    }
  }

  // Exchange to cloud region connections
  realExchanges.forEach((exchange) => {
    realCloudRegions.forEach((region) => {
      // Only create connections for relevant cloud providers
      if (exchange.cloudProvider === region.provider || Math.random() > 0.8) {
        const distance = calculateDistance(
          exchange.location.lat,
          exchange.location.lng,
          region.location.lat,
          region.location.lng
        );

        const latency = calculateRealisticLatency(distance);

        latencyData.push({
          id: `exchange-region-${id++}`,
          fromId: exchange.id,
          toId: region.id,
          latency,
          timestamp,
          type: "exchange-to-region"
        });
      }
    });
  });

  // Region to region connections (major routes)
  for (let i = 0; i < realCloudRegions.length; i++) {
    for (let j = i + 1; j < realCloudRegions.length; j++) {
      // Only connect regions from the same provider or major inter-provider routes
      const region1 = realCloudRegions[i];
      const region2 = realCloudRegions[j];

      if (region1.provider === region2.provider || Math.random() > 0.9) {
        const distance = calculateDistance(
          region1.location.lat,
          region1.location.lng,
          region2.location.lat,
          region2.location.lng
        );

        const latency = calculateRealisticLatency(distance);

        latencyData.push({
          id: `region-${id++}`,
          fromId: region1.id,
          toId: region2.id,
          latency,
          timestamp,
          type: "region-to-region"
        });
      }
    }
  }

  return latencyData;
}

// Generate historical data with realistic patterns
export function generateRealisticHistoricalData(fromId: string, toId: string, hours: number = 24): HistoricalLatency[] {
  const data: HistoricalLatency[] = [];
  const now = Date.now();
  const interval = (hours * 60 * 60 * 1000) / 100; // 100 data points

  // Find the entities to calculate base latency
  const fromEntity = realExchanges.find((e) => e.id === fromId) || realCloudRegions.find((r) => r.id === fromId);
  const toEntity = realExchanges.find((e) => e.id === toId) || realCloudRegions.find((r) => r.id === toId);

  if (!fromEntity || !toEntity) {
    // Return mock data if entities not found
    for (let i = 0; i < 100; i++) {
      data.push({
        timestamp: now - (99 - i) * interval,
        latency: Math.random() * 100 + 20,
      });
    }
    return data;
  }

  const distance = calculateDistance(
    fromEntity.location.lat,
    fromEntity.location.lng,
    toEntity.location.lat,
    toEntity.location.lng
  );

  const baseLatency = calculateRealisticLatency(distance);

  for (let i = 0; i < 100; i++) {
    const time = now - (99 - i) * interval;
    const hourOfDay = new Date(time).getHours();

    // Add daily patterns (higher latency during peak hours)
    let dailyMultiplier = 1;
    if (hourOfDay >= 9 && hourOfDay <= 17) {
      dailyMultiplier = 1.2; // 20% higher during business hours
    } else if (hourOfDay >= 19 && hourOfDay <= 23) {
      dailyMultiplier = 1.15; // 15% higher during evening
    }

    // Add random variation
    const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
    const finalLatency = baseLatency * dailyMultiplier * (1 + variation);

    data.push({
      timestamp: time,
      latency: Math.max(1, Math.round(finalLatency))
    });
  }

  return data;
}

// Network quality indicators based on latency
export function getNetworkQuality(latency: number): { quality: "excellent" | "good" | "fair" | "poor" | "critical"; color: string; description: string } {
  if (latency < 20) {
    return {
      quality: "excellent",
      color: "#10B981",
      description: "Excellent connection"
    };
  } else if (latency < 50) {
    return {
      quality: "good",
      color: "#3B82F6",
      description: "Good connection"
    };
  } else if (latency < 100) {
    return {
      quality: "fair",
      color: "#F59E0B",
      description: "Fair connection"
    };
  } else if (latency < 200) {
    return {
      quality: "poor",
      color: "#EF4444",
      description: "Poor connection"
    };
  } else {
    return {
      quality: "critical",
      color: "#DC2626",
      description: "Critical latency"
    };
  }
}

// Real-time network monitoring simulation
export class NetworkMonitor {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  startMonitoring(
    fromId: string,
    toId: string,
    callback: (latency: number) => void,
    intervalMs: number = 5000
  ) {
    const key = `${fromId}-${toId}`;

    // Clear existing interval if any
    if (this.intervals.has(key)) {
      clearInterval(this.intervals.get(key)!);
    }

    // Find entities and calculate base latency
    const fromEntity = realExchanges.find((e) => e.id === fromId) || realCloudRegions.find((r) => r.id === fromId);
    const toEntity = realExchanges.find((e) => e.id === toId) || realCloudRegions.find((r) => r.id === toId);

    if (!fromEntity || !toEntity) return;

    const distance = calculateDistance(
      fromEntity.location.lat,
      fromEntity.location.lng,
      toEntity.location.lat,
      toEntity.location.lng
    );

    const baseLatency = calculateRealisticLatency(distance);

    const interval = setInterval(() => {
      // Add real-time variation
      const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
      const currentLatency = Math.max(1, Math.round(baseLatency * (1 + variation)));
      callback(currentLatency);
    }, intervalMs);

    this.intervals.set(key, interval);
  }

  stopMonitoring(fromId: string, toId: string) {
    const key = `${fromId}-${toId}`;
    if (this.intervals.has(key)) {
      clearInterval(this.intervals.get(key)!);
      this.intervals.delete(key);
    }
  }

  stopAllMonitoring() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }
}

// Geographic regions for data analysis
export const geographicRegions = {
  "North America": {
    countries: ["USA", "Canada", "Mexico"],
    center: { lat: 45.0, lng: -100.0 }
  },
  Europe: {
    countries: ["UK", "Germany", "France", "Netherlands", "Switzerland", "Austria", "Malta"],
    center: { lat: 50.0, lng: 10.0 }
  },
  "Asia-Pacific": {
    countries: ["Japan", "South Korea", "Singapore", "Hong Kong", "Australia"],
    center: { lat: 20.0, lng: 120.0 }
  },
  "Middle East & Africa": {
    countries: ["UAE", "Bahrain", "South Africa"],
    center: { lat: 15.0, lng: 30.0 }
  },
  "South America": {
    countries: ["Brazil", "Mexico"],
    center: { lat: -10.0, lng: -60.0 }
  }
};
