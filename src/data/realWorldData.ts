import { Exchange, CloudRegion } from "@/types";

// Real cryptocurrency exchanges with accurate global locations
export const realExchanges: Exchange[] = [
  // North America
  {
    id: "coinbase-us",
    name: "Coinbase Pro",
    cloudProvider: "AWS",
    region: "us-west-1",
    serverCount: 15,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      city: "San Francisco",
      country: "USA"
    }
  },
  {
    id: "kraken-us",
    name: "Kraken USA",
    cloudProvider: "AWS",
    region: "us-east-1",
    serverCount: 12,
    location: {
      lat: 40.7128,
      lng: -74.006,
      city: "New York",
      country: "USA"
    }
  },
  {
    id: "gemini-us",
    name: "Gemini",
    cloudProvider: "AWS",
    region: "us-east-1",
    serverCount: 10,
    location: {
      lat: 40.7128,
      lng: -74.006,
      city: "New York",
      country: "USA"
    }
  },
  {
    id: "bittrex-us",
    name: "Bittrex",
    cloudProvider: "Azure",
    region: "westus2",
    serverCount: 8,
    location: {
      lat: 47.6062,
      lng: -122.3321,
      city: "Seattle",
      country: "USA"
    }
  },
  {
    id: "coinsquare-ca",
    name: "Coinsquare",
    cloudProvider: "AWS",
    region: "ca-central-1",
    serverCount: 6,
    location: {
      lat: 43.6532,
      lng: -79.3832,
      city: "Toronto",
      country: "Canada"
    }
  },
  // Europe
  {
    id: "binance-malta",
    name: "Binance",
    cloudProvider: "AWS",
    region: "eu-south-1",
    serverCount: 25,
    location: {
      lat: 35.9375,
      lng: 14.3754,
      city: "Valletta",
      country: "Malta"
    }
  },
  {
    id: "kraken-uk",
    name: "Kraken London",
    cloudProvider: "GCP",
    region: "europe-west2",
    serverCount: 14,
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: "London",
      country: "UK"
    }
  },
  {
    id: "bitstamp-uk",
    name: "Bitstamp",
    cloudProvider: "AWS",
    region: "eu-west-2",
    serverCount: 10,
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: "London",
      country: "UK"
    }
  },
  {
    id: "bitfinex-ch",
    name: "Bitfinex",
    cloudProvider: "Azure",
    region: "switzerlandnorth",
    serverCount: 8,
    location: {
      lat: 47.3769,
      lng: 8.5417,
      city: "Zurich",
      country: "Switzerland"
    }
  },
  {
    id: "bitpanda-at",
    name: "Bitpanda",
    cloudProvider: "AWS",
    region: "eu-central-1",
    serverCount: 7,
    location: {
      lat: 48.2082,
      lng: 16.3738,
      city: "Vienna",
      country: "Austria"
    }
  },
  {
    id: "coinbase-de",
    name: "Coinbase Germany",
    cloudProvider: "AWS",
    region: "eu-central-1",
    serverCount: 9,
    location: {
      lat: 52.52,
      lng: 13.405,
      city: "Berlin",
      country: "Germany"
    }
  },
  // Asia-Pacific
  {
    id: "binance-jp",
    name: "Binance Japan",
    cloudProvider: "AWS",
    region: "ap-northeast-1",
    serverCount: 18,
    location: {
      lat: 35.6762,
      lng: 139.6503,
      city: "Tokyo",
      country: "Japan"
    }
  },
  {
    id: "okx-sg",
    name: "OKX Singapore",
    cloudProvider: "AWS",
    region: "ap-southeast-1",
    serverCount: 16,
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: "Singapore",
      country: "Singapore",
    }
  },
  {
    id: "bybit-sg",
    name: "Bybit Singapore",
    cloudProvider: "GCP",
    region: "asia-southeast1",
    serverCount: 14,
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: "Singapore",
      country: "Singapore"
    }
  },
  {
    id: "huobi-sg",
    name: "Huobi Singapore",
    cloudProvider: "Azure",
    region: "southeastasia",
    serverCount: 12,
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: "Singapore",
      country: "Singapore"
    }
  },
  {
    id: "bitflyer-jp",
    name: "bitFlyer",
    cloudProvider: "AWS",
    region: "ap-northeast-1",
    serverCount: 10,
    location: {
      lat: 35.6762,
      lng: 139.6503,
      city: "Tokyo",
      country: "Japan"
    }
  },
  {
    id: "coincheck-jp",
    name: "Coincheck",
    cloudProvider: "GCP",
    region: "asia-northeast1",
    serverCount: 8,
    location: {
      lat: 35.6762,
      lng: 139.6503,
      city: "Tokyo",
      country: "Japan"
    }
  },
  {
    id: "upbit-kr",
    name: "Upbit",
    cloudProvider: "AWS",
    region: "ap-northeast-2",
    serverCount: 13,
    location: {
      lat: 37.5665,
      lng: 126.978,
      city: "Seoul",
      country: "South Korea"
    }
  },
  {
    id: "bithumb-kr",
    name: "Bithumb",
    cloudProvider: "GCP",
    region: "asia-northeast3",
    serverCount: 11,
    location: {
      lat: 37.5665,
      lng: 126.978,
      city: "Seoul",
      country: "South Korea"
    }
  },
  // Middle East & Africa
  {
    id: "binance-ae",
    name: "Binance UAE",
    cloudProvider: "AWS",
    region: "me-south-1",
    serverCount: 9,
    location: {
      lat: 25.2048,
      lng: 55.2708,
      city: "Dubai",
      country: "UAE"
    }
  },
  {
    id: "bitocto-ae",
    name: "BitOcto",
    cloudProvider: "Azure",
    region: "uaenorth",
    serverCount: 5,
    location: {
      lat: 25.2048,
      lng: 55.2708,
      city: "Dubai",
      country: "UAE"
    }
  },
  {
    id: "luno-za",
    name: "Luno",
    cloudProvider: "AWS",
    region: "af-south-1",
    serverCount: 6,
    location: {
      lat: -26.2041,
      lng: 28.0473,
      city: "Johannesburg",
      country: "South Africa"
    }
  },
  // South America
  {
    id: "mercado-br",
    name: "Mercado Bitcoin",
    cloudProvider: "AWS",
    region: "sa-east-1",
    serverCount: 8,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      city: "São Paulo",
      country: "Brazil"
    }
  },
  {
    id: "bitso-mx",
    name: "Bitso",
    cloudProvider: "GCP",
    region: "northamerica-northeast1",
    serverCount: 7,
    location: {
      lat: 19.4326,
      lng: -99.1332,
      city: "Mexico City",
      country: "Mexico"
    }
  },
  // Oceania
  {
    id: "coinjar-au",
    name: "CoinJar",
    cloudProvider: "AWS",
    region: "ap-southeast-2",
    serverCount: 6,
    location: {
      lat: -33.8688,
      lng: 151.2093,
      city: "Sydney",
      country: "Australia"
    }
  },
  {
    id: "independent-au",
    name: "Independent Reserve",
    cloudProvider: "AWS",
    region: "ap-southeast-2",
    serverCount: 5,
    location: {
      lat: -33.8688,
      lng: 151.2093,
      city: "Sydney",
      country: "Australia"
    }
  }
];

// Comprehensive cloud regions data with real locations
export const realCloudRegions: CloudRegion[] = [
  // AWS Regions
  {
    id: "aws-us-east-1",
    provider: "AWS",
    name: "US East (N. Virginia)",
    code: "us-east-1",
    serverCount: 50,
    location: {
      lat: 39.0458,
      lng: -77.5081,
      city: "Virginia",
      country: "USA"
    }
  },
  {
    id: "aws-us-east-2",
    provider: "AWS",
    name: "US East (Ohio)",
    code: "us-east-2",
    serverCount: 35,
    location: {
      lat: 40.4173,
      lng: -82.9071,
      city: "Columbus",
      country: "USA"
    }
  },
  {
    id: "aws-us-west-1",
    provider: "AWS",
    name: "US West (N. California)",
    code: "us-west-1",
    serverCount: 40,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      city: "San Francisco",
      country: "USA"
    }
  },
  {
    id: "aws-us-west-2",
    provider: "AWS",
    name: "US West (Oregon)",
    code: "us-west-2",
    serverCount: 45,
    location: {
      lat: 45.5152,
      lng: -122.6784,
      city: "Portland",
      country: "USA"
    }
  },
  {
    id: "aws-ca-central-1",
    provider: "AWS",
    name: "Canada (Central)",
    code: "ca-central-1",
    serverCount: 25,
    location: {
      lat: 43.6532,
      lng: -79.3832,
      city: "Toronto",
      country: "Canada"
    }
  },
  {
    id: "aws-eu-west-1",
    provider: "AWS",
    name: "Europe (Ireland)",
    code: "eu-west-1",
    serverCount: 38,
    location: {
      lat: 53.3498,
      lng: -6.2603,
      city: "Dublin",
      country: "Ireland"
    }
  },
  {
    id: "aws-eu-west-2",
    provider: "AWS",
    name: "Europe (London)",
    code: "eu-west-2",
    serverCount: 32,
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: "London",
      country: "UK"
    }
  },
  {
    id: "aws-eu-west-3",
    provider: "AWS",
    name: "Europe (Paris)",
    code: "eu-west-3",
    serverCount: 28,
    location: {
      lat: 48.8566,
      lng: 2.3522,
      city: "Paris",
      country: "France"
    }
  },
  {
    id: "aws-eu-central-1",
    provider: "AWS",
    name: "Europe (Frankfurt)",
    code: "eu-central-1",
    serverCount: 42,
    location: {
      lat: 50.1109,
      lng: 8.6821,
      city: "Frankfurt",
      country: "Germany"
    }
  },
  {
    id: "aws-eu-north-1",
    provider: "AWS",
    name: "Europe (Stockholm)",
    code: "eu-north-1",
    serverCount: 20,
    location: {
      lat: 59.3293,
      lng: 18.0686,
      city: "Stockholm",
      country: "Sweden"
    }
  },
  {
    id: "aws-eu-south-1",
    provider: "AWS",
    name: "Europe (Milan)",
    code: "eu-south-1",
    serverCount: 18,
    location: {
      lat: 45.4642,
      lng: 9.19,
      city: "Milan",
      country: "Italy"
    }
  },
  {
    id: "aws-ap-northeast-1",
    provider: "AWS",
    name: "Asia Pacific (Tokyo)",
    code: "ap-northeast-1",
    serverCount: 36,
    location: {
      lat: 35.6762,
      lng: 139.6503,
      city: "Tokyo",
      country: "Japan"
    }
  },
  {
    id: "aws-ap-northeast-2",
    provider: "AWS",
    name: "Asia Pacific (Seoul)",
    code: "ap-northeast-2",
    serverCount: 30,
    location: {
      lat: 37.5665,
      lng: 126.978,
      city: "Seoul",
      country: "South Korea"
    }
  },
  {
    id: "aws-ap-northeast-3",
    provider: "AWS",
    name: "Asia Pacific (Osaka)",
    code: "ap-northeast-3",
    serverCount: 22,
    location: {
      lat: 34.6937,
      lng: 135.5023,
      city: "Osaka",
      country: "Japan"
    }
  },
  {
    id: "aws-ap-southeast-1",
    provider: "AWS",
    name: "Asia Pacific (Singapore)",
    code: "ap-southeast-1",
    serverCount: 34,
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: "Singapore",
      country: "Singapore"
    }
  },
  {
    id: "aws-ap-southeast-2",
    provider: "AWS",
    name: "Asia Pacific (Sydney)",
    code: "ap-southeast-2",
    serverCount: 28,
    location: {
      lat: -33.8688,
      lng: 151.2093,
      city: "Sydney",
      country: "Australia"
    }
  },
  {
    id: "aws-ap-south-1",
    provider: "AWS",
    name: "Asia Pacific (Mumbai)",
    code: "ap-south-1",
    serverCount: 26,
    location: {
      lat: 19.076,
      lng: 72.8777,
      city: "Mumbai",
      country: "India"
    }
  },
  {
    id: "aws-me-south-1",
    provider: "AWS",
    name: "Middle East (Bahrain)",
    code: "me-south-1",
    serverCount: 15,
    location: {
      lat: 26.0667,
      lng: 50.5577,
      city: "Manama",
      country: "Bahrain"
    }
  },
  {
    id: "aws-af-south-1",
    provider: "AWS",
    name: "Africa (Cape Town)",
    code: "af-south-1",
    serverCount: 12,
    location: {
      lat: -33.9249,
      lng: 18.4241,
      city: "Cape Town",
      country: "South Africa"
    }
  },
  {
    id: "aws-sa-east-1",
    provider: "AWS",
    name: "South America (São Paulo)",
    code: "sa-east-1",
    serverCount: 20,
    location: {
      lat: -23.5505,
      lng: -46.6333,
      city: "São Paulo",
      country: "Brazil"
    }
  },
  // Google Cloud Platform Regions
  {
    id: "gcp-us-central1",
    provider: "GCP",
    name: "US Central (Iowa)",
    code: "us-central1",
    serverCount: 40,
    location: {
      lat: 41.5868,
      lng: -93.625,
      city: "Iowa City",
      country: "USA"
    }
  },
  {
    id: "gcp-us-east1",
    provider: "GCP",
    name: "US East (South Carolina)",
    code: "us-east1",
    serverCount: 38,
    location: {
      lat: 33.8361,
      lng: -81.1637,
      city: "Columbia",
      country: "USA"
    }
  },
  {
    id: "gcp-us-west1",
    provider: "GCP",
    name: "US West (Oregon)",
    code: "us-west1",
    serverCount: 35,
    location: {
      lat: 45.5152,
      lng: -122.6784,
      city: "Portland",
      country: "USA"
    }
  },
  {
    id: "gcp-europe-west1",
    provider: "GCP",
    name: "Europe West (Belgium)",
    code: "europe-west1",
    serverCount: 32,
    location: {
      lat: 50.8503,
      lng: 4.3517,
      city: "Brussels",
      country: "Belgium"
    }
  },
  {
    id: "gcp-europe-west2",
    provider: "GCP",
    name: "Europe West (London)",
    code: "europe-west2",
    serverCount: 30,
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: "London",
      country: "UK"
    }
  },
  {
    id: "gcp-europe-west4",
    provider: "GCP",
    name: "Europe West (Netherlands)",
    code: "europe-west4",
    serverCount: 28,
    location: {
      lat: 52.3676,
      lng: 4.9041,
      city: "Amsterdam",
      country: "Netherlands"
    }
  },
  {
    id: "gcp-asia-southeast1",
    provider: "GCP",
    name: "Asia Southeast (Singapore)",
    code: "asia-southeast1",
    serverCount: 26,
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: "Singapore",
      country: "Singapore"
    }
  },
  {
    id: "gcp-asia-northeast1",
    provider: "GCP",
    name: "Asia Northeast (Tokyo)",
    code: "asia-northeast1",
    serverCount: 24,
    location: {
      lat: 35.6762,
      lng: 139.6503,
      city: "Tokyo",
      country: "Japan"
    }
  },
  // Microsoft Azure Regions
  {
    id: "azure-eastus",
    provider: "Azure",
    name: "East US (Virginia)",
    code: "eastus",
    serverCount: 45,
    location: {
      lat: 39.0458,
      lng: -77.5081,
      city: "Virginia",
      country: "USA"
    }
  },
  {
    id: "azure-westus2",
    provider: "Azure",
    name: "West US 2 (Washington)",
    code: "westus2",
    serverCount: 40,
    location: {
      lat: 47.6062,
      lng: -122.3321,
      city: "Seattle",
      country: "USA"
    }
  },
  {
    id: "azure-northeurope",
    provider: "Azure",
    name: "North Europe (Ireland)",
    code: "northeurope",
    serverCount: 35,
    location: {
      lat: 53.3498,
      lng: -6.2603,
      city: "Dublin",
      country: "Ireland"
    }
  },
  {
    id: "azure-westeurope",
    provider: "Azure",
    name: "West Europe (Netherlands)",
    code: "westeurope",
    serverCount: 33,
    location: {
      lat: 52.3676,
      lng: 4.9041,
      city: "Amsterdam",
      country: "Netherlands"
    }
  },
  {
    id: "azure-southeastasia",
    provider: "Azure",
    name: "Southeast Asia (Singapore)",
    code: "southeastasia",
    serverCount: 30,
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: "Singapore",
      country: "Singapore"
    }
  },
  {
    id: "azure-eastasia",
    provider: "Azure",
    name: "East Asia (Hong Kong)",
    code: "eastasia",
    serverCount: 28,
    location: {
      lat: 22.3193,
      lng: 114.1694,
      city: "Hong Kong",
      country: "Hong Kong"
    }
  },
  {
    id: "azure-japaneast",
    provider: "Azure",
    name: "Japan East (Tokyo)",
    code: "japaneast",
    serverCount: 25,
    location: {
      lat: 35.6762,
      lng: 139.6503,
      city: "Tokyo",
      country: "Japan"
    }
  },
  {
    id: "azure-australiaeast",
    provider: "Azure",
    name: "Australia East (Sydney)",
    code: "australiaeast",
    serverCount: 22,
    location: {
      lat: -33.8688,
      lng: 151.2093,
      city: "Sydney",
      country: "Australia"
    }
  },
  {
    id: "azure-switzerlandnorth",
    provider: "Azure",
    name: "Switzerland North (Zurich)",
    code: "switzerlandnorth",
    serverCount: 20,
    location: {
      lat: 47.3769,
      lng: 8.5417,
      city: "Zurich",
      country: "Switzerland"
    }
  },
  {
    id: "azure-uaenorth",
    provider: "Azure",
    name: "UAE North (Dubai)",
    code: "uaenorth",
    serverCount: 18,
    location: {
      lat: 25.2048,
      lng: 55.2708,
      city: "Dubai",
      country: "UAE"
    }
  }
];

// Major internet exchange points (IXPs) worldwide
export const internetExchangePoints = [
  {
    id: "de-cix-frankfurt",
    name: "DE-CIX Frankfurt",
    throughput: "10+ Tbps",
    members: 900,
    location: {
      lat: 50.1109,
      lng: 8.6821,
      city: "Frankfurt",
      country: "Germany"
    }
  },
  {
    id: "ams-ix-amsterdam",
    name: "AMS-IX Amsterdam",
    throughput: "8+ Tbps",
    members: 870,
    location: {
      lat: 52.3676,
      lng: 4.9041,
      city: "Amsterdam",
      country: "Netherlands"
    }
  },
  {
    id: "linx-london",
    name: "LINX London",
    throughput: "6+ Tbps",
    members: 750,
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: "London",
      country: "UK"
    }
  },
  {
    id: "equinix-ashburn",
    name: "Equinix Ashburn",
    throughput: "5+ Tbps",
    members: 600,
    location: {
      lat: 39.0458,
      lng: -77.5081,
      city: "Ashburn",
      country: "USA"
    }
  },
  {
    id: "jpnap-tokyo",
    name: "JPNAP Tokyo",
    throughput: "4+ Tbps",
    members: 500,
    location: {
      lat: 35.6762,
      lng: 139.6503,
      city: "Tokyo",
      country: "Japan"
    }
  }
];
