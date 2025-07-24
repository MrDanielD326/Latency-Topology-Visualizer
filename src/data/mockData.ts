import { Exchange, CloudRegion, LatencyData, HistoricalLatency } from "@/types";
import { generateMockLatency } from "@/lib/utils";

export const exchanges: Exchange[] = [
  {
    id: "binance-us",
    name: "Binance US",
    cloudProvider: "AWS",
    region: "us-west-1",
    serverCount: 12,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      city: "San Francisco",
      country: "USA"
    }
  },
  {
    id: "okx-sg",
    name: "OKX Singapore",
    cloudProvider: "AWS",
    region: "ap-southeast-1",
    serverCount: 8,
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: "Singapore",
      country: "Singapore"
    }
  },
  {
    id: "coinbase-us",
    name: "Coinbase Pro",
    cloudProvider: "AWS",
    region: "us-east-1",
    serverCount: 15,
    location: {
      lat: 40.7128,
      lng: -74.006,
      city: "New York",
      country: "USA"
    }
  },
  {
    id: "ftx-bs",
    name: "FTX Bahamas",
    cloudProvider: "AWS",
    region: "us-east-1",
    serverCount: 4,
    location: {
      lat: 25.0443,
      lng: -77.3504,
      city: "Nassau",
      country: "Bahamas"
    }
  },
  {
    id: "deribit-nl",
    name: "Deribit Netherlands",
    cloudProvider: "GCP",
    region: "europe-west4",
    serverCount: 6,
    location: {
      lat: 52.3676,
      lng: 4.9041,
      city: "Amsterdam",
      country: "Netherlands"
    }
  },
  {
    id: "kraken-uk",
    name: "Kraken London",
    cloudProvider: "GCP",
    region: "europe-west2",
    serverCount: 7,
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: "London",
      country: "UK"
    }
  },
  {
    id: "bybit-hk",
    name: "Bybit Hong Kong",
    cloudProvider: "Azure",
    region: "eastasia",
    serverCount: 10,
    location: {
      lat: 22.3193,
      lng: 114.1694,
      city: "Hong Kong",
      country: "Hong Kong"
    }
  },
  {
    id: "bitfinex-ch",
    name: "Bitfinex Switzerland",
    cloudProvider: "Azure",
    region: "switzerlandnorth",
    serverCount: 5,
    location: {
      lat: 47.3769,
      lng: 8.5417,
      city: "Zurich",
      country: "Switzerland"
    }
  }
];

export const cloudRegions: CloudRegion[] = [
  {
    id: "aws-us-west-1",
    provider: "AWS",
    name: "US West (N. California)",
    code: "us-west-1",
    serverCount: 25,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      city: "San Francisco",
      country: "USA"
    }
  },
  {
    id: "aws-us-east-1",
    provider: "AWS",
    name: "US East (N. Virginia)",
    code: "us-east-1",
    serverCount: 35,
    location: {
      lat: 39.0458,
      lng: -77.5081,
      city: "Virginia",
      country: "USA"
    }
  },
  {
    id: "aws-ap-southeast-1",
    provider: "AWS",
    name: "Asia Pacific (Singapore)",
    code: "ap-southeast-1",
    serverCount: 20,
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: "Singapore",
      country: "Singapore"
    }
  },
  {
    id: "gcp-europe-west4",
    provider: "GCP",
    name: "Europe West 4 (Netherlands)",
    code: "europe-west4",
    serverCount: 18,
    location: {
      lat: 52.3676,
      lng: 4.9041,
      city: "Amsterdam",
      country: "Netherlands"
    }
  },
  {
    id: "gcp-europe-west2",
    provider: "GCP",
    name: "Europe West 2 (London)",
    code: "europe-west2",
    serverCount: 22,
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: "London",
      country: "UK"
    }
  },
  {
    id: "azure-eastasia",
    provider: "Azure",
    name: "East Asia (Hong Kong)",
    code: "eastasia",
    serverCount: 16,
    location: {
      lat: 22.3193,
      lng: 114.1694,
      city: "Hong Kong",
      country: "Hong Kong"
    }
  },
  {
    id: "azure-switzerlandnorth",
    provider: "Azure",
    name: "Switzerland North",
    code: "switzerlandnorth",
    serverCount: 12,
    location: {
      lat: 47.3769,
      lng: 8.5417,
      city: "Zurich",
      country: "Switzerland"
    }
  }
];

export function generateLatencyData(): LatencyData[] {
  const latencyData: LatencyData[] = [];

  // Exchange to exchange connections
  for (let i = 0; i < exchanges.length; i++) {
    for (let j = i + 1; j < exchanges.length; j++) {
      latencyData.push({
        id: `${exchanges[i].id}-${exchanges[j].id}`,
        fromId: exchanges[i].id,
        toId: exchanges[j].id,
        latency: generateMockLatency(),
        timestamp: Date.now(),
        type: "exchange-to-exchange",
      });
    }
  }

  // Exchange to region connections
  exchanges.forEach((exchange) => {
    cloudRegions.forEach((region) => {
      if (Math.random() > 0.7) {
        // Only some connections
        latencyData.push({
          id: `${exchange.id}-${region.id}`,
          fromId: exchange.id,
          toId: region.id,
          latency: generateMockLatency(),
          timestamp: Date.now(),
          type: "exchange-to-region"
        });
      }
    });
  });

  return latencyData;
}

export function generateHistoricalData(hours: number = 24): HistoricalLatency[] {
  const data: HistoricalLatency[] = [];
  const now = Date.now();
  const interval = (hours * 60 * 60 * 1000) / 100; // 100 data points

  for (let i = 0; i < 100; i++) {
    data.push({
      timestamp: now - (99 - i) * interval,
      latency: generateMockLatency()
    });
  }

  return data;
}
