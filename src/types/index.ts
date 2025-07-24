export interface Exchange {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  cloudProvider: "AWS" | "GCP" | "Azure";
  region: string;
  serverCount: number;
}

export interface CloudRegion {
  id: string;
  provider: "AWS" | "GCP" | "Azure";
  name: string;
  code: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  serverCount: number;
}

export interface LatencyData {
  id: string;
  fromId: string;
  toId: string;
  latency: number;
  timestamp: number;
  type: "exchange-to-exchange" | "exchange-to-region" | "region-to-region";
}

export interface HistoricalLatency {
  timestamp: number;
  latency: number;
}

export interface FilterOptions {
  exchanges: string[];
  cloudProviders: ("AWS" | "GCP" | "Azure")[];
  latencyRange: {
    min: number;
    max: number;
  };
  showRealtime: boolean;
  showHistorical: boolean;
  showRegions: boolean;
}

export interface PerformanceMetrics {
  totalExchanges: number;
  totalRegions: number;
  activeConnections: number;
  averageLatency: number;
  systemHealth: "good" | "warning" | "critical";
}

export type TimeRange = "1h" | "24h" | "7d" | "30d";

export interface Connection {
  id: string;
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  latency: number;
  animated: boolean;
}

export interface CursorConfig {
  size?: number;
  color?: string;
  mixBlendMode?: "difference" | "multiply" | "normal" | "overlay" | "screen";
}

export interface DataSource {
  name: string;
  url: string;
  type: "json" | "api" | "csv";
  headers?: Record<string, string>;
}

// Used here
export interface ControlPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  exchanges: Exchange[];
  cloudRegions: CloudRegion[];
  onSearch: (query: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  latencyData?: LatencyData[];
}

export interface CursorPosition {
  x: number;
  y: number;
}

export interface CustomCursorProps {
  size?: number;
  color?: string;
  hideOnLeave?: boolean;
}

export interface ExcelExportProps {
  filters: FilterOptions;
  exchanges: Exchange[];
  cloudRegions: CloudRegion[];
  latencyData: LatencyData[];
  searchQuery: string;
}

export interface MarkerProps {
  position: [number, number, number];
  color: string;
  size: number;
  onClick: () => void;
  children?: React.ReactNode;
}

export interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  animated?: boolean;
}

export interface Globe3DProps {
  exchanges: Exchange[];
  cloudRegions: CloudRegion[];
  connections: Connection[];
  onMarkerClick: (id: string, type: "exchange" | "region") => void;
  showRegions: boolean;
}

export interface HeaderProps {
  onControlPanelToggle: () => void;
  isControlPanelOpen: boolean;
}

export interface LatencyChartProps {
  data: HistoricalLatency[];
  selectedPair: string;
  onTimeRangeChange: (range: TimeRange) => void;
  onClose?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

export interface ModalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export interface PerformanceMetricsProps {
  exchanges: Exchange[];
  cloudRegions: CloudRegion[];
  latencyData: LatencyData[];
}
