#!/usr/bin/env node

/**
 * Global Data Collector for Latency Topology Visualizer
 * Fetches real-world data from various sources including:
 * - Network topology data
 * - Real-time latency measurements
 * - Geographic and infrastructure data
 * - Exchange and cloud provider information
 */

import { DataSource } from "@/types";
import fs from "fs";
import path from "path";

// Define types for the data structures
interface ExchangeData {
  name: string;
  endpoint: string;
  latency: number | null;
  status: "online" | "offline";
  lastChecked: string;
  data: string;
}

interface CloudData {
  provider: string;
  regionUrl: string;
  latency: number | null;
  status: "online" | "offline";
  lastChecked: string;
}

interface InfrastructureData {
  [key: string]: unknown;
}

interface CollectionResult {
  exchanges?: ExchangeData[];
  cloud?: CloudData[];
  infrastructure?: InfrastructureData;
  topology?: unknown;
  [key: string]: unknown;
}

// Public data sources for global infrastructure data
const dataSources: DataSource[] = [
  {
    name: "Internet Exchange Points",
    url: "https://github.com/telegeography/www.internetexchangemap.com/raw/master/web/data/ixps.json",
    type: "json",
  },
  {
    name: "Submarine Cables",
    url: "https://github.com/telegeography/www.submarinecablemap.com/raw/master/web/data/cables.json",
    type: "json",
  },
  {
    name: "Global Cities",
    url: "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv",
    type: "csv",
  },
  {
    name: "Country Coordinates",
    url: "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    type: "json",
  },
];

// Cryptocurrency exchanges with their APIs
const exchangeAPIs = {
  coinbase: {
    endpoint: "https://api.exchange.coinbase.com/products",
    healthCheck: "https://api.exchange.coinbase.com/time"
  },
  binance: {
    endpoint: "https://api.binance.com/api/v3/exchangeInfo",
    healthCheck: "https://api.binance.com/api/v3/ping"
  },
  kraken: {
    endpoint: "https://api.kraken.com/0/public/SystemStatus",
    healthCheck: "https://api.kraken.com/0/public/Time"
  },
  okx: {
    endpoint: "https://www.okx.com/api/v5/system/status",
    healthCheck: "https://www.okx.com/api/v5/system/time"
  }
};

// Cloud provider health endpoints
const cloudHealthChecks = {
  aws: {
    regions: [
      "https://ec2.us-east-1.amazonaws.com/ping",
      "https://ec2.us-west-1.amazonaws.com/ping",
      "https://ec2.eu-west-1.amazonaws.com/ping",
      "https://ec2.ap-southeast-1.amazonaws.com/ping"
    ]
  },
  gcp: {
    regions: [
      "https://compute.googleapis.com/compute/v1/projects/google.com:compute-samples/global/httpHealthChecks",
      "https://europe-west1-compute.googleapis.com",
      "https://asia-southeast1-compute.googleapis.com"
    ]
  },
  azure: {
    regions: [
      "https://management.azure.com/subscriptions",
      "https://westeurope.management.azure.com",
      "https://southeastasia.management.azure.com"
    ]
  }
};

/**
 * Fetch data from a URL with proper error handling
 */
async function fetchData(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  try {
    console.log(`Fetching data from: ${url}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Latency-Topology-Visualizer/1.0",
        Accept: "application/json, text/plain, */*",
        ...headers
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return await response.json();
    } else if (contentType?.includes("text/csv")) {
      return await response.text();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }
}

/**
 * Measure latency to a specific endpoint
 */
async function measureLatency(url: string): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const startTime = performance.now();
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal
    });
    const endTime = performance.now();

    clearTimeout(timeoutId);

    if (response.ok) {
      return Math.round(endTime - startTime);
    }
    return null;
  } catch (error) {
    console.error(`Latency measurement failed for ${url}:`, error);
    return null;
  }
}

/**
 * Collect real-time exchange data
 */
async function collectExchangeData() {
  console.log("\n🏦 Collecting cryptocurrency exchange data...");
  const exchangeData: ExchangeData[] = [];

  for (const [name, config] of Object.entries(exchangeAPIs)) {
    console.log(`  📊 Testing ${name}...`);

    // Measure latency
    const latency = await measureLatency(config.healthCheck);

    // Try to get exchange info
    const data = await fetchData(config.endpoint);

    exchangeData.push({
      name,
      endpoint: config.endpoint,
      latency,
      status: data ? "online" : "offline",
      lastChecked: new Date().toISOString(),
      data: data ? "Available" : "Unavailable"
    });
  }

  return exchangeData;
}

/**
 * Collect cloud provider health data
 */
async function collectCloudData() {
  console.log("\n☁️ Collecting cloud provider data...");
  const cloudData: CloudData[] = [];

  for (const [provider, config] of Object.entries(cloudHealthChecks)) {
    console.log(`  🌐 Testing ${provider}...`);

    for (const regionUrl of config.regions) {
      const latency = await measureLatency(regionUrl);

      cloudData.push({
        provider,
        regionUrl,
        latency,
        status: latency ? "online" : "offline",
        lastChecked: new Date().toISOString()
      });
    }
  }

  return cloudData;
}

/**
 * Collect global infrastructure data
 */
async function collectInfrastructureData() {
  console.log("\n🌍 Collecting global infrastructure data...");
  const infrastructureData: InfrastructureData = {};

  for (const source of dataSources) {
    console.log(`  📡 Fetching ${source.name}...`);
    const data = await fetchData(source.url, source.headers);

    if (data) {
      infrastructureData[source.name.toLowerCase().replace(/\s+/g, "_")] = data;
      console.log(`✅ Successfully collected ${source.name}`);
    } else {
      console.log(`❌ Failed to collect ${source.name}`);
    }

    // Rate limiting - wait 1 second between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return infrastructureData;
}

/**
 * Generate network topology map
 */
async function generateNetworkTopology() {
  console.log("\n🗺️ Generating network topology map...");

  // This would combine all collected data to create a comprehensive network map
  const topology = {
    nodes: [],
    links: [],
    metadata: {
      generatedAt: new Date().toISOString(),
      dataPoints: 0,
      coverage: {
        exchanges: 0,
        cloudRegions: 0,
        ixps: 0,
        submarineCables: 0
      },
    },
  };

  // In a real implementation, this would process all the collected data
  // and create nodes and links for the network visualization

  return topology;
}

/**
 * Save collected data to files
 */
async function saveData(data: unknown, filename: string) {
  const outputDir = path.join(process.cwd(), "src", "data", "collected");

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filepath = path.join(outputDir, filename);

  try {
    if (filename.endsWith(".json")) {
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    } else {
      fs.writeFileSync(filepath, String(data));
    }
    console.log(`💾 Saved data to ${filepath}`);
  } catch (error) {
    console.error(`❌ Failed to save ${filepath}:`, error);
  }
}

/**
 * Main data collection function
 */
async function collectGlobalData() {
  console.log("🚀 Starting global data collection...");
  console.log("=".repeat(50));

  const startTime = Date.now();
  const results: CollectionResult = {};

  try {
    // Collect exchange data
    results.exchanges = await collectExchangeData();
    await saveData(results.exchanges, "exchanges.json");

    // Collect cloud data
    results.cloud = await collectCloudData();
    await saveData(results.cloud, "cloud_health.json");

    // Collect infrastructure data
    results.infrastructure = await collectInfrastructureData();
    await saveData(results.infrastructure, "infrastructure.json");

    // Generate topology
    results.topology = await generateNetworkTopology();
    await saveData(results.topology, "network_topology.json");

    // Create summary report
    const summary = {
      collectionDate: new Date().toISOString(),
      duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      dataPoints: {
        exchanges: results.exchanges?.length || 0,
        cloudEndpoints: results.cloud?.length || 0,
        infrastructureSources: Object.keys(results.infrastructure || {}).length
      },
      status: "completed",
      nextCollection: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours later
    };

    await saveData(summary, "collection_summary.json");

    console.log("\n" + "=".repeat(50));
    console.log("✅ Data collection completed successfully!");
    console.log(`📊 Collected data from ${summary.dataPoints.exchanges} exchanges`);
    console.log(`☁️ Tested ${summary.dataPoints.cloudEndpoints} cloud endpoints`);
    console.log(`🌐 Gathered ${summary.dataPoints.infrastructureSources} infrastructure datasets`);
    console.log(`⏱️ Total time: ${summary.duration}`);
    console.log("=".repeat(50));
  } catch (error) {
    console.error("\n❌ Data collection failed:", error);

    // Save error report
    const errorReport = {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      partialResults: results
    };

    await saveData(errorReport, "error_report.json");
  }
}

/**
 * Live monitoring mode
 */
async function startLiveMonitoring() {
  console.log("🔄 Starting live monitoring mode...");

  const monitoringInterval = 5 * 60 * 1000; // 5 minutes

  const monitor = async () => {
    console.log(`\n📡 Live monitoring check - ${new Date().toLocaleTimeString()}`);

    // Quick health checks
    const healthData = {
      timestamp: new Date().toISOString(),
      exchanges: {} as Record<string, { latency: number | null; status: string }>,
      cloud: {},
    };

    // Check a few key endpoints
    const keyExchanges = ["coinbase", "binance"];
    for (const exchange of keyExchanges) {
      const config = exchangeAPIs[exchange as keyof typeof exchangeAPIs];
      if (config) {
        const latency = await measureLatency(config.healthCheck);
        healthData.exchanges[exchange] = {
          latency,
          status: latency ? "online" : "offline"
        };
      }
    }

    // Save live monitoring data
    await saveData(healthData, `live_${Date.now()}.json`);

    console.log("  ✅ Live monitoring check completed");
  };

  // Run initial check
  await monitor();

  // Set up interval
  setInterval(monitor, monitoringInterval);

  console.log(`🔄 Live monitoring active (checking every ${monitoringInterval / 1000 / 60} minutes)`);
  console.log("Press Ctrl+C to stop monitoring");
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || "collect";

  switch (command) {
    case "collect": collectGlobalData(); break;
    case "monitor": startLiveMonitoring(); break;
    case "help":
      console.log(
        "Global Data Collector - Available Commands:\n\n" +
        "  collect     Run full data collection (default)\n" +
        "  monitor     Start live monitoring mode\n" +
        "  help        Show this help message\n\n" +
        "Examples:\n" +
        "  npm run collect-data\n" +
        "  npm run collect-data collect\n" +
        "  npm run collect-data monitor\n"
      );
      break;

    default: console.log(`Unknown command: ${command}. Use 'help' for available commands.`);
  }
}

export { collectGlobalData, startLiveMonitoring, fetchData, measureLatency };
