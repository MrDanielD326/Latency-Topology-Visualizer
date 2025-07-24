# 📊 Global Data Collection Guide

This document provides a comprehensive guide to collecting real-world network data for the **Latency Topology Visualizer**.

---

## 🚀 Quick Start Guide

### Using npm scripts (Recommended)

| Command | Description |
|---------|-------------|
| `npm run collect-data` | 📊 Execute TypeScript data collection |
| `npm run monitor-network` | 📡 Start continuous network monitoring |
| `npm run collect-data-verbose` | 📄 Run data collection with detailed output |

### Direct Script Execution

You can also run the TypeScript data collector directly:

```bash
# Install tsx if not already installed
npm install -g tsx

# Run the data collector
npx tsx src/scripts/dataCollector.ts collect

# Start monitoring mode
npx tsx src/scripts/dataCollector.ts monitor
```

## 🌍 What Data Gets Collected

### 1. **🏦 Cryptocurrency Exchanges**
- **Latency**: Real-time latency measurements from over 25 exchanges
- **Status**: Online/offline detection for all exchanges
- **Geographic Coverage**: North America, Europe, Asia, Middle East, Africa, South America

### 2. **☁️ Cloud Provider Regions**
- **Providers**: AWS, Google Cloud, Microsoft Azure
- **Regions**: Over 40 global regions for comprehensive coverage
- **Endpoints**: Accurate measurements using real cloud service endpoints

### 3. **🌐 Internet Infrastructure**
- **CDNs**: Cloudflare, Akamai, Amazon CloudFront
- **DNS Providers**: Google DNS, Quad9, OpenDNS
- **IXPs**: Major Internet Exchange Points worldwide

### 4. **📡 Network Topology**
- **Routing**: Your local network routing table
- **Adapters**: Active network interface information
- **DNS Config**: Your current DNS settings
- **Geolocation**: ISP and approximate geographic location

## 📊 Data Output

All collected data is saved to `src/data/collected/` as JSON files:

- `exchanges.json`
- `cloud_health.json`
- `infrastructure.json`
- `network_topology.json`
- `geographic_data.json`
- `collection_summary.json`

### Example Output

```json
{
  "name": "Coinbase",
  "endpoint": "https://api.exchange.coinbase.com/products",
  "latency": 45,
  "status": "online",
  "lastChecked": "2025-07-24T20:42:02.000Z"
}
```

## 🔄 Live Monitoring Mode

Start continuous monitoring of network performance:

```bash
npm run monitor-network
```

- **Frequency**: Updates every 5 minutes (configurable)
- **Endpoints**: Monitors key exchanges and cloud providers
- **Timestamped Data**: Each measurement is timestamped
- **Automatic Saving**: Results are saved to timestamped JSON files

## 🔧 Customization

### Adding Custom Endpoints

To add custom endpoints, edit `src/scripts/dataCollector.ts`:

```typescript
const customExchangeAPIs = {
  myExchange: {
    endpoint: "https://api.myexchange.com/v1/products",
    healthCheck: "https://api.myexchange.com/v1/health"
  }
};
```

### Changing Monitoring Frequency

Modify the monitoring interval in `src/scripts/dataCollector.ts`:

```typescript
const monitoringInterval = 5 * 60 * 1000; // 5 minutes
```

## 🌐 Geographic Coverage

### 🇺🇸 North America
- **USA**: San Francisco, New York, Seattle, Virginia, Oregon
- **Canada**: Toronto
- **Mexico**: Mexico City

### 🇪🇺 Europe
- **UK**: London
- **Germany**: Frankfurt, Berlin
- **Netherlands**: Amsterdam
- **Switzerland**: Zurich
- **France**: Paris
- **Austria**: Vienna
- **Malta**: Valletta

### 🇯🇵 Asia-Pacific
- **Japan**: Tokyo, Osaka
- **South Korea**: Seoul
- **Singapore**: Singapore
- **Hong Kong**: Hong Kong
- **Australia**: Sydney
- **India**: Mumbai

### 🌍 Middle East & Africa
- **UAE**: Dubai
- **Bahrain**: Manama
- **South Africa**: Cape Town, Johannesburg

### 🇧🇷 South America
- **Brazil**: São Paulo

## 📈 Performance & Troubleshooting

### Performance Tips
- **Vary Collection Times**: Network conditions change throughout the day
- **Multiple Collections**: Run several times for more accurate averages
- **Continuous Monitoring**: Use `monitor-network` for trend analysis

### Troubleshooting
- **Network Connectivity**: Ensure firewalls or VPNs are not blocking connections
- **Dependencies**: Make sure you have `tsx` installed (`npm install -g tsx`)
- **Error Logs**: Check `src/data/collected/error_report.json` for failures

## 🎨 Visualization Integration

The collected data integrates directly with your 3D globe visualization:

- **Real Coordinates**: All locations use accurate latitude/longitude
- **Connection Lines**: Draw connections between actual endpoints
- **Color Coding**: Latency data is used for connection quality visualization

## 📝 Example Usage

```typescript
import { collectGlobalData } from '@/scripts/dataCollector';
import { realExchanges } from '@/data/realWorldData';

// Load collected data
const exchanges = await fetch('/data/collected/exchanges.json')
  .then(res => res.json());

// Use in your visualizations
const latencyData = exchanges.map(exchange => ({
  id: exchange.name,
  latency: exchange.latency,
  status: exchange.status
}));
```

## 💡 Next Steps

1. **Run your first collection**: `npm run collect-data`
2. **Start monitoring**: `npm run monitor-network`
3. **Integrate with your app**: Use the collected data in your visualizations
4. **Customize endpoints**: Add your own services to monitor
5. **Analyze patterns**: Look for geographic and temporal trends

---

*Happy data collecting! 🌍✨*
