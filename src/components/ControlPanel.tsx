"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, X, Layers, CloudIcon, Building2, Zap, Download } from "lucide-react";
import { ControlPanelProps } from "@/types";
import { cn } from "@/lib/utils";
import { useExcelExport } from "./ExcelExport";
import config from "@/lib/config.json";

// Color theme for filters
const FILTER_COLORS = {
  visualization: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  providers: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  exchanges: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  latency: "text-orange-400 border-orange-500/20 bg-orange-500/5"
};

export default function ControlPanel({ filters, onFiltersChange, exchanges, cloudRegions, onSearch, onClose, latencyData = [] }: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<"visualization" | "providers" | "exchanges" | "latency" | null>("visualization");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  useEffect(() => {
    const timer = setTimeout(() => onSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Generate search suggestions
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const suggestions: Array<{
      type: string;
      value: string;
      label: string;
      color: string;
    }> = [];

    // Add exchange suggestions
    exchanges.forEach((exchange) => {
      if (exchange.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: "exchange",
          value: exchange.name,
          label: `${exchange.name} (Exchange)`,
          color: "text-purple-400"
        });
      }
      if (exchange.location.city.toLowerCase().includes(query)) {
        suggestions.push({
          type: "city",
          value: exchange.location.city,
          label: `${exchange.location.city} (City)`,
          color: "text-green-400"
        });
      }
      if (exchange.location.country.toLowerCase().includes(query)) {
        suggestions.push({
          type: "country",
          value: exchange.location.country,
          label: `${exchange.location.country} (Country)`,
          color: "text-green-400"
        });
      }
    });

    // Add cloud provider suggestions
    const providers = ["AWS", "GCP", "Azure"];
    providers.forEach((provider) => {
      if (provider.toLowerCase().includes(query)) {
        suggestions.push({
          type: "provider",
          value: provider,
          label: `${provider} (Cloud Provider)`,
          color: "text-blue-400"
        });
      }
    });

    // Add cloud region suggestions
    cloudRegions.forEach((region) => {
      if (region.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: "region",
          value: region.name,
          label: `${region.name} (Region)`,
          color: "text-cyan-400"
        });
      }
    });

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) =>
      index === self.findIndex((s) => s.value === suggestion.value && s.type === suggestion.type)
    );

    return uniqueSuggestions.slice(0, 8); // Limit to 8 suggestions
  };

  const suggestions = getSearchSuggestions();

  const handleSuggestionClick = (suggestion: {
    type: string;
    value: string;
  }) => {
    setSearchQuery(suggestion.value);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => prev < suggestions.length - 1 ? prev + 1 : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => prev > 0 ? prev - 1 : suggestions.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const toggleExchange = (exchangeId: string) => {
    const updated = filters.exchanges.includes(exchangeId)
      ? filters.exchanges.filter((id) => id !== exchangeId)
      : [...filters.exchanges, exchangeId];
    onFiltersChange({ ...filters, exchanges: updated });
  };

  const toggleCloudProvider = (provider: "AWS" | "GCP" | "Azure") => {
    const updated = filters.cloudProviders.includes(provider)
      ? filters.cloudProviders.filter((p) => p !== provider)
      : [...filters.cloudProviders, provider];
    onFiltersChange({ ...filters, cloudProviders: updated });
  };

  const updateLatencyRange = (min: number, max: number) =>
    onFiltersChange({ ...filters, latencyRange: { min, max } });

  // Use Excel export hook
  const { handleExport } = useExcelExport({ filters, exchanges, cloudRegions, latencyData, searchQuery });

  const PROVIDER_COLORS = config.colors;

  return (
    <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white md:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h3 className="text-white text-sm font-semibold">Control Panel</h3>
          <p className="text-xs text-gray-500">Configure visualization</p>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (<ChevronUp className="w-4 h-4 text-gray-400" />) : (<ChevronDown className="w-4 h-4 text-gray-400" />)}
        </button>
      </div>

      <div className="px-6 py-4 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(e.target.value.trim().length > 0);
              setSelectedSuggestionIndex(-1);
            }}
            onFocus={() => {
              if (searchQuery.trim().length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 bg-black border border-gray-800 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />

          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-gray-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.value}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 border-b border-gray-800/50 last:border-b-0",
                    index === selectedSuggestionIndex ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      suggestion.type === "exchange"
                        ? "bg-purple-500"
                        : suggestion.type === "provider"
                          ? "bg-blue-500"
                          : suggestion.type === "region"
                            ? "bg-cyan-500"
                            : "bg-green-500"
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{suggestion.value}</div>
                    <div className={cn("text-xs", suggestion.color)}>
                      {suggestion.type === "exchange"
                        ? "Exchange"
                        : suggestion.type === "provider"
                          ? "Cloud Provider"
                          : suggestion.type === "region"
                            ? "Region"
                            : suggestion.type === "city"
                              ? "City"
                              : "Country"}
                    </div>
                  </div>
                  {index === selectedSuggestionIndex && (<div className="text-emerald-400 text-xs"> ↵ </div>)}
                </button>
              ))}
            </div>
          )}

          {/* No results message */}
          {showSuggestions &&
            searchQuery.trim().length > 0 &&
            suggestions.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-gray-800 rounded-lg shadow-xl z-50">
                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                  No matches found for &quot;{searchQuery}&quot;
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="px-6 py-4 border-b border-gray-800 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() =>
              onFiltersChange({
                exchanges: exchanges.map((e) => e.id),
                cloudProviders: ["AWS", "GCP", "Azure"],
                latencyRange: { min: 0, max: 1000 },
                showRealtime: true,
                showHistorical: true,
                showRegions: true
              })
            }
            className="py-2 text-sm font-medium bg-white text-black rounded hover:bg-gray-200"
          >
            Select All
          </button>
          <button
            onClick={() =>
              onFiltersChange({
                exchanges: [],
                cloudProviders: [],
                latencyRange: { min: 0, max: 1000 },
                showRealtime: false,
                showHistorical: false,
                showRegions: false
              })
            }
            className="py-2 text-sm font-medium border border-gray-700 text-gray-400 rounded hover:text-white hover:bg-gray-800"
          >
            Clear All
          </button>
        </div>

        {/* Download Button */}
        <button
          onClick={handleExport}
          className="w-full mt-3 py-2 px-4 text-sm font-medium bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        <div className="text-xs text-gray-400 space-y-1 pt-2 border-t border-gray-800">
          <div className="flex justify-between">
            <span>Active:</span>
            <span className="text-emerald-400 font-medium">
              {filters.exchanges.length +
                filters.cloudProviders.length +
                (filters.showRealtime ? 1 : 0) +
                (filters.showHistorical ? 1 : 0) +
                (filters.showRegions ? 1 : 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span> Exchanges: </span>
            <span className="text-purple-400">
              {filters.exchanges.length}/{exchanges.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span> Providers: </span>
            <span className="text-blue-400">
              {filters.cloudProviders.length}/3
            </span>
          </div>
        </div>
      </div>

      <div className={cn("transition-all duration-500 overflow-hidden", isExpanded ? "max-h-[1000px]" : "max-h-0")}>
        <Section
          icon={<Layers className="w-4 h-4" />}
          label="Visualization"
          count={null}
          isOpen={activeSection === "visualization"}
          onClick={() =>
            setActiveSection(
              activeSection === "visualization" ? null : "visualization"
            )
          }
          colorTheme="visualization"
        >
          {[
            { label: "Real-time", value: filters.showRealtime, key: "showRealtime" },
            { label: "Historical", value: filters.showHistorical, key: "showHistorical" },
            { label: "Regions", value: filters.showRegions, key: "showRegions" }
          ].map(({ label, value, key }) => (
            <label
              key={key}
              className="flex items-center justify-between text-sm text-gray-300 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <span> {label} </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onFiltersChange({ ...filters, [key]: e.target.checked })}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "w-4 h-4 rounded border transition-all",
                    value ? "bg-emerald-500 border-emerald-500" : "border-gray-600 hover:border-emerald-500"
                  )}
                >
                  {value && (
                    <svg className="w-3 h-3 text-black absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </label>
          ))}
        </Section>

        <Section
          icon={<CloudIcon className="w-4 h-4" />}
          label="Cloud Providers"
          count={`${filters.cloudProviders.length}/3`}
          isOpen={activeSection === "providers"}
          onClick={() => setActiveSection(activeSection === "providers" ? null : "providers")}
          colorTheme="providers"
        >
          {["AWS", "GCP", "Azure"].map((p) => (
            <label
              key={p}
              className="flex items-center justify-between text-sm text-gray-300 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", PROVIDER_COLORS[p as keyof typeof PROVIDER_COLORS])} />
                <span> {p} </span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.cloudProviders.includes(p as "AWS" | "GCP" | "Azure")}
                  onChange={() => toggleCloudProvider(p as "AWS" | "GCP" | "Azure")}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "w-4 h-4 rounded border transition-all",
                    filters.cloudProviders.includes(p as "AWS" | "GCP" | "Azure") ? "bg-blue-500 border-blue-500" : "border-gray-600 hover:border-blue-500"
                  )}
                >
                  {filters.cloudProviders.includes(p as "AWS" | "GCP" | "Azure") && (
                    <svg className="w-3 h-3 text-black absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20" >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </label>
          ))}
        </Section>

        <Section
          icon={<Building2 className="w-4 h-4" />}
          label="Exchanges"
          count={`${filters.exchanges.length}/${exchanges.length}`}
          isOpen={activeSection === "exchanges"}
          onClick={() => setActiveSection(activeSection === "exchanges" ? null : "exchanges")}
          colorTheme="exchanges"
        >
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {exchanges
              .filter((e) => searchQuery === "" ||
                e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.cloudProvider.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((e) => (
                <label
                  key={e.id}
                  className="flex items-center justify-between text-sm text-gray-300 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        PROVIDER_COLORS[e.cloudProvider as keyof typeof PROVIDER_COLORS] || "bg-gray-500"
                      )}
                    />
                    <span> {e.name} </span>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.exchanges.includes(e.id)}
                      onChange={() => toggleExchange(e.id)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-4 h-4 rounded border transition-all",
                        filters.exchanges.includes(e.id) ? "bg-purple-500 border-purple-500" : "border-gray-600 hover:border-purple-500"
                      )}
                    >
                      {filters.exchanges.includes(e.id) && (
                        <svg className="w-3 h-3 text-black absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </label>
              ))}
          </div>
        </Section>

        <Section
          icon={<Zap className="w-4 h-4" />}
          label="Latency"
          count={`${filters.latencyRange.min}-${filters.latencyRange.max}ms`}
          isOpen={activeSection === "latency"}
          onClick={() => setActiveSection(activeSection === "latency" ? null : "latency")}
          colorTheme="latency"
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={filters.latencyRange.min}
              onChange={(e) => updateLatencyRange(Number(e.target.value), filters.latencyRange.max)}
              placeholder="Min"
              className="w-full px-3 py-2 rounded bg-black border border-gray-800 text-white text-sm focus:border-orange-500 focus:outline-none transition-colors"
            />
            <input
              type="number"
              value={filters.latencyRange.max}
              onChange={(e) => updateLatencyRange(filters.latencyRange.min, Number(e.target.value))}
              placeholder="Max"
              className="w-full px-3 py-2 rounded bg-black border border-gray-800 text-white text-sm focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon, label, count, children, isOpen, onClick, colorTheme }: {
  icon: React.ReactNode;
  label: string;
  count: string | null;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  colorTheme?: keyof typeof FILTER_COLORS;
}) {
  const colorClass = colorTheme ? FILTER_COLORS[colorTheme] : "text-white";
  return (
    <div
      className={cn(
        "px-6 py-4 border-t transition-all duration-200",
        isOpen && colorTheme
          ? `border-${colorTheme === "visualization"
            ? "emerald"
            : colorTheme === "providers"
              ? "blue"
              : colorTheme === "exchanges"
                ? "purple"
                : "orange"
          }-800/30`
          : "border-gray-800"
      )}
    >
      <button
        onClick={onClick}
        className={cn(
          "flex items-center justify-between w-full text-sm transition-colors hover:text-gray-300",
          isOpen && colorTheme ? colorClass.split(" ")[0] : "text-white"
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn(isOpen && colorTheme ? colorClass.split(" ")[0] : "")}>
            {icon}
          </span>
          <span> {label} </span>
          {count && <span className="text-xs text-gray-400 ml-2"> {count} </span>}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "rotate-180",
            isOpen && colorTheme ? colorClass.split(" ")[0] : "text-gray-400"
          )}
        />
      </button>
      <div
        className={cn(
          "mt-3 space-y-2 text-sm text-gray-300 transition-all duration-300 rounded-lg",
          isOpen ? "max-h-[300px] p-3" : "max-h-0 overflow-hidden p-0",
          isOpen && colorTheme ? colorClass.split(" ").slice(1).join(" ") : ""
        )}
      >
        {children}
      </div>
    </div>
  );
}
