# Global Data Collection Script for Latency Topology Visualizer
# This script collects real-world network data from various sources

param(
    [string]$Mode = "collect",
    [string]$OutputDir = "src\data\collected",
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"

# Create output directory if it doesn't exist
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "[INFO] Created output directory: $OutputDir" -ForegroundColor Green
}

# Function to measure latency using Test-NetConnection
function Measure-Latency {
    param(
        [string]$Hostname,
        [int]$Port = 443,
        [int]$Count = 3
    )
    
    try {
        Write-Host "  [TEST] Testing $Hostname..." -ForegroundColor Yellow
        
        $latencies = @()
        for ($i = 1; $i -le $Count; $i++) {
            $start = Get-Date
            $result = Test-NetConnection -ComputerName $Hostname -Port $Port -WarningAction SilentlyContinue
            $end = Get-Date
            
            if ($result.TcpTestSucceeded) {
                $latency = ($end - $start).TotalMilliseconds
                $latencies += $latency
                if ($Verbose) {
                    Write-Host "    [PING] Attempt ${i}: $([math]::Round($latency, 2))ms" -ForegroundColor Gray
                }
            }
        }
        
        if ($latencies.Count -gt 0) {
            $avgLatency = ($latencies | Measure-Object -Average).Average
            Write-Host "  [OK] ${Hostname}: $([math]::Round($avgLatency, 2))ms (avg)" -ForegroundColor Green
            return [math]::Round($avgLatency, 2)
        } else {
            Write-Host "  [FAIL] ${Hostname}: Connection failed" -ForegroundColor Red
            return $null
        }
    }
    catch {
        Write-Host "  [ERROR] ${Hostname}: Error - $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to save data to JSON file
function Save-JsonData {
    param(
        [object]$Data,
        [string]$FileName
    )
    
    $filePath = Join-Path $OutputDir $FileName
    try {
        $Data | ConvertTo-Json -Depth 10 | Out-File -FilePath $filePath -Encoding UTF8
        Write-Host "  [SAVED] Data saved to $filePath" -ForegroundColor Green
    }
    catch {
        Write-Host "  [ERROR] Failed to save ${filePath}: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Cryptocurrency Exchange Endpoints
$exchangeEndpoints = @{
    "Coinbase" = "api.exchange.coinbase.com"
    "Binance" = "api.binance.com"
    "Kraken" = "api.kraken.com"
    "OKX" = "www.okx.com"
    "Bybit" = "api.bybit.com"
    "Bitfinex" = "api.bitfinex.com"
    "Gemini" = "api.gemini.com"
    "KuCoin" = "api.kucoin.com"
}

# Cloud Provider Endpoints
$cloudEndpoints = @{
    "AWS" = @{
        "US-East-1" = "ec2.us-east-1.amazonaws.com"
        "US-West-1" = "ec2.us-west-1.amazonaws.com"
        "EU-West-1" = "ec2.eu-west-1.amazonaws.com"
        "AP-Southeast-1" = "ec2.ap-southeast-1.amazonaws.com"
        "AP-Northeast-1" = "ec2.ap-northeast-1.amazonaws.com"
    }
    "Google-Cloud" = @{
        "US-Central1" = "compute.googleapis.com"
        "Europe-West1" = "europe-west1-compute.googleapis.com"
        "Asia-Southeast1" = "asia-southeast1-compute.googleapis.com"
    }
    "Azure" = @{
        "East-US" = "management.azure.com"
        "West-Europe" = "westeurope.management.azure.com"
        "Southeast-Asia" = "southeastasia.management.azure.com"
    }
}

# Major Internet Infrastructure
$internetInfrastructure = @{
    "Cloudflare" = "1.1.1.1"
    "Google-DNS" = "8.8.8.8"
    "Quad9" = "9.9.9.9"
    "OpenDNS" = "208.67.222.222"
    "Akamai" = "www.akamai.com"
}

function Collect-ExchangeData {
    Write-Host "`n[EXCHANGES] Collecting Cryptocurrency Exchange Data..." -ForegroundColor Cyan
    
    $exchangeData = @()
    foreach ($exchange in $exchangeEndpoints.GetEnumerator()) {
        $latency = Measure-Latency -Hostname $exchange.Value -Port 443
        
        $exchangeData += @{
            Name = $exchange.Key
            Hostname = $exchange.Value
            Latency = $latency
            Status = if ($latency -ne $null) { "Online" } else { "Offline" }
            Timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        }
    }
    
    Save-JsonData -Data $exchangeData -FileName "exchange_latency.json"
    return $exchangeData
}

function Collect-CloudData {
    Write-Host "`n[CLOUD] Collecting Cloud Provider Data..." -ForegroundColor Cyan
    
    $cloudData = @()
    foreach ($provider in $cloudEndpoints.GetEnumerator()) {
        Write-Host "  [PROVIDER] Testing $($provider.Key)..." -ForegroundColor Yellow
        
        foreach ($region in $provider.Value.GetEnumerator()) {
            $latency = Measure-Latency -Hostname $region.Value -Port 443
            
            $cloudData += @{
                Provider = $provider.Key
                Region = $region.Key
                Hostname = $region.Value
                Latency = $latency
                Status = if ($latency -ne $null) { "Online" } else { "Offline" }
                Timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
            }
        }
    }
    
    Save-JsonData -Data $cloudData -FileName "cloud_latency.json"
    return $cloudData
}

function Collect-InfrastructureData {
    Write-Host "`n[INFRA] Collecting Internet Infrastructure Data..." -ForegroundColor Cyan
    
    $infraData = @()
    foreach ($service in $internetInfrastructure.GetEnumerator()) {
        $latency = Measure-Latency -Hostname $service.Value -Port 443
        
        $infraData += @{
            Service = $service.Key
            Hostname = $service.Value
            Latency = $latency
            Status = if ($latency -ne $null) { "Online" } else { "Offline" }
            Timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        }
    }
    
    Save-JsonData -Data $infraData -FileName "infrastructure_latency.json"
    return $infraData
}

function Get-NetworkTopology {
    Write-Host "`n[NETWORK] Gathering Network Topology Data..." -ForegroundColor Cyan
    
    try {
        # Get routing table
        Write-Host "  [ROUTES] Collecting routing information..." -ForegroundColor Yellow
        $routes = Get-NetRoute | Where-Object { $_.DestinationPrefix -ne "127.0.0.1/32" } | Select-Object -First 20
        
        # Get network adapters
        Write-Host "  [ADAPTERS] Collecting network adapter info..." -ForegroundColor Yellow
        $adapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object Name, InterfaceDescription, LinkSpeed
        
        # Get DNS settings
        Write-Host "  [DNS] Collecting DNS settings..." -ForegroundColor Yellow
        $dnsSettings = Get-DnsClientServerAddress | Where-Object { $_.ServerAddresses.Count -gt 0 }
        
        $topologyData = @{
            LocalRoutes = $routes
            NetworkAdapters = $adapters
            DNSSettings = $dnsSettings
            Timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        }
        
        Save-JsonData -Data $topologyData -FileName "network_topology.json"
        Write-Host "  [OK] Network topology data collected" -ForegroundColor Green
        
        return $topologyData
    }
    catch {
        Write-Host "  [ERROR] Failed to collect network topology: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Get-GeographicData {
    Write-Host "`n[GEO] Collecting Geographic Data..." -ForegroundColor Cyan
    
    try {
        Write-Host "  [LOCATION] Getting public IP location..." -ForegroundColor Yellow
        $ipInfo = Invoke-RestMethod -Uri "http://ip-api.com/json/" -TimeoutSec 10
        
        $geoData = @{
            PublicIP = $ipInfo.query
            Country = $ipInfo.country
            Region = $ipInfo.regionName
            City = $ipInfo.city
            ISP = $ipInfo.isp
            Latitude = $ipInfo.lat
            Longitude = $ipInfo.lon
            Timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        }
        
        Save-JsonData -Data $geoData -FileName "geographic_data.json"
        Write-Host "  [OK] Geographic data collected" -ForegroundColor Green
        
        return $geoData
    }
    catch {
        Write-Host "  [ERROR] Failed to collect geographic data: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Start-LiveMonitoring {
    Write-Host "`n[MONITOR] Starting Live Monitoring Mode..." -ForegroundColor Cyan
    Write-Host "[INFO] Press Ctrl+C to stop monitoring`n" -ForegroundColor Yellow
    
    $monitoringInterval = 300 # 5 minutes in seconds
    $iteration = 0
    
    while ($true) {
        $iteration++
        $timestamp = Get-Date
        Write-Host "[MONITOR] Check #$iteration - $($timestamp.ToString('HH:mm:ss'))" -ForegroundColor Green
        
        # Quick health checks for key services
        $quickChecks = @{
            "Coinbase" = "api.exchange.coinbase.com"
            "Binance" = "api.binance.com"
            "AWS-US-East" = "ec2.us-east-1.amazonaws.com"
            "Cloudflare" = "1.1.1.1"
        }
        
        $monitoringData = @()
        foreach ($service in $quickChecks.GetEnumerator()) {
            $latency = Measure-Latency -Hostname $service.Value -Port 443 -Count 1
            
            $monitoringData += @{
                Service = $service.Key
                Hostname = $service.Value
                Latency = $latency
                Status = if ($latency -ne $null) { "Online" } else { "Offline" }
                Timestamp = $timestamp.ToString("yyyy-MM-ddTHH:mm:ssZ")
            }
        }
        
        # Save monitoring data with timestamp
        $fileName = "monitoring_$($timestamp.ToString('yyyyMMdd_HHmmss')).json"
        Save-JsonData -Data $monitoringData -FileName $fileName
        
        Write-Host "  [OK] Monitoring data saved" -ForegroundColor Green
        Write-Host "  [WAIT] Next check in $($monitoringInterval/60) minutes`n" -ForegroundColor Gray
        
        Start-Sleep -Seconds $monitoringInterval
    }
}

function Show-Summary {
    param([object]$Results)
    
    Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
    Write-Host "DATA COLLECTION SUMMARY" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    
    if ($Results.Exchanges) {
        $onlineExchanges = ($Results.Exchanges | Where-Object { $_.Status -eq "Online" }).Count
        Write-Host "[EXCHANGES] $onlineExchanges/$($Results.Exchanges.Count) online" -ForegroundColor Green
    }
    
    if ($Results.Cloud) {
        $onlineCloud = ($Results.Cloud | Where-Object { $_.Status -eq "Online" }).Count
        Write-Host "[CLOUD] $onlineCloud/$($Results.Cloud.Count) regions online" -ForegroundColor Green
    }
    
    if ($Results.Infrastructure) {
        $onlineInfra = ($Results.Infrastructure | Where-Object { $_.Status -eq "Online" }).Count
        Write-Host "[INFRA] $onlineInfra/$($Results.Infrastructure.Count) services online" -ForegroundColor Green
    }
    
    if ($Results.Geographic) {
        Write-Host "[LOCATION] $($Results.Geographic.City), $($Results.Geographic.Country)" -ForegroundColor Green
        Write-Host "[ISP] $($Results.Geographic.ISP)" -ForegroundColor Green
    }
    
    Write-Host "`n[OUTPUT] All data saved to: $OutputDir" -ForegroundColor Yellow
    Write-Host ("=" * 60) -ForegroundColor Cyan
}

# Main execution
Write-Host "[START] Global Data Collector for Latency Topology Visualizer" -ForegroundColor Cyan
Write-Host "[CONFIG] Mode: $Mode | Output: $OutputDir`n" -ForegroundColor Yellow

$startTime = Get-Date
$results = @{}

try {
    switch ($Mode.ToLower()) {
        "collect" {
            $results.Exchanges = Collect-ExchangeData
            $results.Cloud = Collect-CloudData
            $results.Infrastructure = Collect-InfrastructureData
            $results.Topology = Get-NetworkTopology
            $results.Geographic = Get-GeographicData
            
            # Create comprehensive summary
            $summary = @{
                CollectionDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
                Duration = "{0:F2} seconds" -f ((Get-Date) - $startTime).TotalSeconds
                DataPoints = @{
                    Exchanges = if ($results.Exchanges) { $results.Exchanges.Count } else { 0 }
                    CloudRegions = if ($results.Cloud) { $results.Cloud.Count } else { 0 }
                    Infrastructure = if ($results.Infrastructure) { $results.Infrastructure.Count } else { 0 }
                }
                Location = if ($results.Geographic) { 
                    "$($results.Geographic.City), $($results.Geographic.Country)" 
                } else { 
                    "Unknown" 
                }
            }
            
            Save-JsonData -Data $summary -FileName "collection_summary.json"
            Show-Summary -Results $results
        }
        
        "monitor" {
            Start-LiveMonitoring
        }
        
        "help" {
            Write-Host @"
Global Data Collector Commands:

  collect   - Run full data collection (default)
  monitor   - Start live monitoring mode  
  help      - Show this help message

Parameters:
  -OutputDir    - Specify output directory (default: src\data\collected)
  -Verbose      - Enable verbose output

Examples:
  .\collect-data-simple.ps1
  .\collect-data-simple.ps1 -Mode collect -Verbose
  .\collect-data-simple.ps1 -Mode monitor
"@ -ForegroundColor Yellow
        }
        
        default {
            Write-Host "[ERROR] Unknown mode: $Mode. Use 'help' for available commands." -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "`n[ERROR] Error during execution: $($_.Exception.Message)" -ForegroundColor Red
    
    # Save error log
    $errorLog = @{
        Error = $_.Exception.Message
        Timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        Mode = $Mode
        PartialResults = $results
    }
    
    Save-JsonData -Data $errorLog -FileName "error_log.json"
}

Write-Host "`n[COMPLETE] Data collection completed!" -ForegroundColor Green
