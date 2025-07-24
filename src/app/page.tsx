"use client";

import { useState, useEffect, useMemo } from "react";
import Globe3D from "../components/Globe3D";
import PerformanceMetrics from "../components/PerformanceMetrics";
import ControlPanel from "../components/ControlPanel";
import LatencyChart from "../components/LatencyChart";
import Modal from "../components/Modal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { exchanges, cloudRegions, generateLatencyData, generateHistoricalData } from "@/data/mockData";
import { FilterOptions, LatencyData } from "@/types";

export default function Home() {
  const [filters, setFilters] = useState<FilterOptions>({
    exchanges: exchanges.map((exchange) => exchange.id),
    cloudProviders: ["AWS", "GCP", "Azure"],
    latencyRange: { min: 0, max: 1000 },
    showRealtime: true,
    showHistorical: true,
    showRegions: true
  });

  const [latencyData, setLatencyData] = useState<LatencyData[]>(generateLatencyData);
  const [historicalData, setHistoricalData] = useState(generateHistoricalData);
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    // Filter exchanges based on selected filters
    const filteredExchanges = exchanges.filter((exchange) => {
      const matchesSearch =
        searchQuery === "" ||
        exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exchange.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exchange.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exchange.cloudProvider.toLowerCase().includes(searchQuery.toLowerCase());

      const isExchangeSelected = filters.exchanges.includes(exchange.id);
      const isProviderSelected = filters.cloudProviders.includes(exchange.cloudProvider);

      return matchesSearch && isExchangeSelected && isProviderSelected;
    });

    // Filter cloud regions based on selected filters
    const filteredCloudRegions = cloudRegions.filter((region) => {
      const matchesSearch =
        searchQuery === "" ||
        region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        region.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        region.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        region.provider.toLowerCase().includes(searchQuery.toLowerCase());

      const isProviderSelected = filters.cloudProviders.includes(region.provider);

      return matchesSearch && isProviderSelected;
    });

    // Filter latency data based on filters
    const filteredLatencyData = latencyData.filter((data) => {
      // Check if latency is within range
      const isLatencyInRange = data.latency >= filters.latencyRange.min && data.latency <= filters.latencyRange.max;

      // Check if both endpoints are in our filtered lists
      const fromExchange = filteredExchanges.find((ex) => ex.id === data.fromId);
      const fromRegion = filteredCloudRegions.find((cr) => cr.id === data.fromId);
      const toExchange = filteredExchanges.find((ex) => ex.id === data.toId);
      const toRegion = filteredCloudRegions.find((cr) => cr.id === data.toId);
      const hasValidFromEndpoint = fromExchange || fromRegion;
      const hasValidToEndpoint = toExchange || toRegion;

      return isLatencyInRange && hasValidFromEndpoint && hasValidToEndpoint;
    });

    return {
      exchanges: filteredExchanges,
      cloudRegions: filteredCloudRegions,
      latencyData: filteredLatencyData
    };
  }, [filters, latencyData, searchQuery]);

  // Handle search functionality
  const handleSearch = (query: string) => { setSearchQuery(query) };

  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyData(generateLatencyData());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkerClick = (id: string) => {
    try {
      // On marker click, setSelectedPair and open modal to show its historical data
      setModalError(null);
      setSelectedPair(id);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error opening modal:", error);
      setModalError("Failed to open latency chart");
    }
  };

  const handleModalClose = () => {
    try {
      setIsModalOpen(false);
      setSelectedPair(null);
      setModalError(null);
    } catch (error) {
      console.error("Error closing modal:", error);
    }
  };

  const toggleControlPanel = () => {
    setIsControlPanelOpen(!isControlPanelOpen);
  };

  return (
    <>
      <Header onControlPanelToggle={toggleControlPanel} isControlPanelOpen={isControlPanelOpen} />

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden gap-2">
        {/* Control Panel Overlay */}
        {isControlPanelOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={toggleControlPanel} />
            <div className="relative w-80 h-full bg-gray-900 p-4 overflow-y-auto">
              <ControlPanel
                filters={filters}
                onFiltersChange={setFilters}
                exchanges={exchanges}
                cloudRegions={cloudRegions}
                onSearch={handleSearch}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-3 space-y-3 overflow-auto flex flex-col md:flex-row">
          <div className="md:w-3/10">
            <PerformanceMetrics
              exchanges={filteredData.exchanges}
              cloudRegions={filteredData.cloudRegions}
              latencyData={filteredData.latencyData}
            />
          </div>

          <div className="md:w-7/10 h-[550px] rounded-lg overflow-hidden">
            <Globe3D
              exchanges={filteredData.exchanges}
              cloudRegions={filters.showRegions ? filteredData.cloudRegions : []}
              connections={
                filteredData.latencyData
                  .map((data) => {
                    const fromExchange = filteredData.exchanges.find((ex) => ex.id === data.fromId);
                    const fromRegion = filteredData.cloudRegions.find((cr) => cr.id === data.fromId);
                    const toExchange = filteredData.exchanges.find((ex) => ex.id === data.toId);
                    const toRegion = filteredData.cloudRegions.find((cr) => cr.id === data.toId);
                    const from = fromExchange?.location || fromRegion?.location;
                    const to = toExchange?.location || toRegion?.location;

                    if (!from || !to) return null;
                    return {
                      id: data.id,
                      from,
                      to,
                      latency: data.latency,
                      animated: filters.showRealtime
                    };
                  })
                  .filter((connection) => connection !== null) as Array<{
                    id: string;
                    from: {
                      lat: number;
                      lng: number;
                      city: string;
                      country: string;
                    };
                    to: {
                      lat: number;
                      lng: number;
                      city: string;
                      country: string;
                    };
                    latency: number;
                    animated: boolean;
                  }>
              }
              onMarkerClick={handleMarkerClick}
              showRegions={filters.showRegions}
            />
          </div>
        </main>
      </div>

      {/* Modal for LatencyChart */}
      <Modal
        isOpen={isModalOpen && filters.showHistorical && selectedPair !== null}
        onClose={handleModalClose}
        title="Historical Latency Data"
        size="lg"
        closeOnBackdropClick={true}
        closeOnEscape={true}
      >
        {modalError ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-red-400 mb-2">⚠️</div>
              <p className="text-gray-300 mb-4">{modalError}</p>
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>
          </div>
        ) : selectedPair ? (
          <LatencyChart
            data={historicalData}
            selectedPair={selectedPair}
            onTimeRangeChange={(range) => {
              try {
                const hours =
                  range === "1h"
                    ? 1
                    : range === "24h"
                      ? 24
                      : range === "7d"
                        ? 168
                        : 720;
                setHistoricalData(generateHistoricalData(hours));
              } catch (error) {
                console.error("Error updating historical data:", error);
                setModalError("Failed to update chart data");
              }
            }}
            onClose={handleModalClose}
          />
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-300">Loading chart data...</p>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </>
  );
}
