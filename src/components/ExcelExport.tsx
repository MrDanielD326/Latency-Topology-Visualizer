"use client";

import * as XLSX from "xlsx";
import { FilterOptions, Exchange, CloudRegion, LatencyData, ExcelExportProps } from "@/types";

export class ExcelExporter {
  private filters: FilterOptions;
  private exchanges: Exchange[];
  private cloudRegions: CloudRegion[];
  private latencyData: LatencyData[];
  private searchQuery: string;

  constructor(props: ExcelExportProps) {
    this.filters = props.filters;
    this.exchanges = props.exchanges;
    this.cloudRegions = props.cloudRegions;
    this.latencyData = props.latencyData;
    this.searchQuery = props.searchQuery;
  }

  // Filter data based on current filters
  private getFilteredData() {
    // Only include exchanges if they match ALL criteria
    const filteredExchanges = this.exchanges.filter((exchange) => {
      // If specific exchanges are selected, only include those
      const matchesExchangeFilter = this.filters.exchanges.length === 0 || this.filters.exchanges.includes(exchange.id);

      // If specific providers are selected, only include those
      const matchesProviderFilter = this.filters.cloudProviders.length === 0 || this.filters.cloudProviders.includes(exchange.cloudProvider);

      // Search query filter
      const matchesSearch = this.searchQuery === "" ||
        exchange.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        exchange.location.city.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        exchange.location.country.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        exchange.cloudProvider.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesExchangeFilter && matchesProviderFilter && matchesSearch;
    });

    // Only include regions if showRegions is enabled AND they match criteria
    const filteredRegions = this.filters.showRegions
      ? this.cloudRegions.filter((region) => {
        // If specific providers are selected, only include those
        const matchesProviderFilter = this.filters.cloudProviders.length === 0 || this.filters.cloudProviders.includes(region.provider);

        // Search query filter
        const matchesSearch = this.searchQuery === "" ||
          region.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          region.location.city.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          region.location.country.toLowerCase().includes(this.searchQuery.toLowerCase());

        return matchesProviderFilter && matchesSearch;
      })
      : [];

    // Filter latency data based on multiple criteria
    const filteredLatencyData = this.latencyData.filter((data) => {
      // Latency range filter
      const matchesLatencyRange = data.latency >= this.filters.latencyRange.min && data.latency <= this.filters.latencyRange.max;

      // Get IDs of filtered exchanges and regions
      const exchangeIds = filteredExchanges.map((e) => e.id);
      const regionIds = filteredRegions.map((r) => r.id);
      const allValidIds = [...exchangeIds, ...regionIds];

      // Only include connections where BOTH endpoints are in our filtered data
      const matchesNodeFilter = allValidIds.includes(data.fromId) && allValidIds.includes(data.toId);

      // Real-time vs Historical filter
      const now = Date.now();
      const fiveMinutesAgo = now - 5 * 60 * 1000; // 5 minutes in milliseconds
      const isRealtime = data.timestamp > fiveMinutesAgo;

      const matchesTimeFilter = (this.filters.showRealtime && isRealtime) || (this.filters.showHistorical && !isRealtime);

      return matchesLatencyRange && matchesNodeFilter && matchesTimeFilter;
    });

    return {
      exchanges: filteredExchanges,
      regions: filteredRegions,
      latencyData: filteredLatencyData
    };
  }

  // Export filtered data as Excel file
  exportToExcel() {
    const filteredData = this.getFilteredData();

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Exchanges worksheet
    if (filteredData.exchanges.length > 0) {
      const exchangesData = filteredData.exchanges.map((exchange) => ({
        "Exchange ID": exchange.id,
        Name: exchange.name,
        City: exchange.location.city,
        Country: exchange.location.country,
        Latitude: exchange.location.lat,
        Longitude: exchange.location.lng,
        "Cloud Provider": exchange.cloudProvider,
        Region: exchange.region,
        "Server Count": exchange.serverCount
      }));

      const exchangesWorksheet = XLSX.utils.json_to_sheet(exchangesData);
      XLSX.utils.book_append_sheet(workbook, exchangesWorksheet, "Exchanges");
    }

    // Cloud Regions worksheet
    if (filteredData.regions.length > 0) {
      const regionsData = filteredData.regions.map((region) => ({
        "Region ID": region.id,
        Provider: region.provider,
        Name: region.name,
        Code: region.code,
        City: region.location.city,
        Country: region.location.country,
        Latitude: region.location.lat,
        Longitude: region.location.lng,
        "Server Count": region.serverCount
      }));

      const regionsWorksheet = XLSX.utils.json_to_sheet(regionsData);
      XLSX.utils.book_append_sheet(workbook, regionsWorksheet, "Cloud Regions");
    }

    // Latency Data worksheet
    if (filteredData.latencyData.length > 0) {
      const latencyDataFormatted = filteredData.latencyData.map((data) => {
        const fromExchange = this.exchanges.find((e) => e.id === data.fromId);
        const toExchange = this.exchanges.find((e) => e.id === data.toId);
        const fromRegion = this.cloudRegions.find((r) => r.id === data.fromId);
        const toRegion = this.cloudRegions.find((r) => r.id === data.toId);

        return {
          "Connection ID": data.id,
          From: fromExchange?.name || fromRegion?.name || data.fromId,
          To: toExchange?.name || toRegion?.name || data.toId,
          "Latency (ms)": data.latency,
          "Connection Type": data.type,
          Timestamp: new Date(data.timestamp).toISOString(),
          Date: new Date(data.timestamp).toLocaleDateString(),
          Time: new Date(data.timestamp).toLocaleTimeString()
        };
      });

      const latencyWorksheet = XLSX.utils.json_to_sheet(latencyDataFormatted);
      XLSX.utils.book_append_sheet(workbook, latencyWorksheet, "Latency Data");
    }

    // Filter Summary worksheet
    const filterSummary = [
      {
        Filter: "Selected Exchanges",
        Value: this.filters.exchanges.length > 0 ? this.filters.exchanges.join(", ") : "All"
      },
      {
        Filter: "Selected Cloud Providers",
        Value: this.filters.cloudProviders.length > 0 ? this.filters.cloudProviders.join(", ") : "All"
      },
      {
        Filter: "Latency Range (ms)",
        Value: `${this.filters.latencyRange.min} - ${this.filters.latencyRange.max}`
      },
      {
        Filter: "Show Real-time",
        Value: this.filters.showRealtime ? "Yes" : "No"
      },
      {
        Filter: "Show Historical",
        Value: this.filters.showHistorical ? "Yes" : "No"
      },
      {
        Filter: "Show Regions",
        Value: this.filters.showRegions ? "Yes" : "No"
      },
      {
        Filter: "Search Query",
        Value: this.searchQuery || "None"
      },
      {
        Filter: "Export Date",
        Value: new Date().toISOString()
      }
    ];

    const summaryWorksheet = XLSX.utils.json_to_sheet(filterSummary);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Filter Summary");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const filename = `latency-topology-data-${timestamp}.xlsx`;

    // Write and download file
    XLSX.writeFile(workbook, filename);
  }
}

// Hook for using Excel export functionality
export const useExcelExport = (props: ExcelExportProps) => {
  const handleExport = () => {
    const exporter = new ExcelExporter(props);
    exporter.exportToExcel();
  };

  return { handleExport };
};
