$ErrorActionPreference = 'Stop'

function Get-PreferredLanAddress {
  $ignoreAdapterPattern = 'WSL|Docker|Bluetooth|Loopback|Virtual|Hyper-V|VPN|TAP|TUN|vEthernet|VMware|Npcap|ZeroTier|Tailscale'

  $allIPv4 = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object {
    $_.IPAddress -and
    $_.PrefixOrigin -ne 'WellKnown' -and
    $_.IPAddress -notlike '127.*' -and
    $_.IPAddress -notlike '169.254.*' -and
    $_.InterfaceAlias -notmatch $ignoreAdapterPattern
  }

  if (-not $allIPv4) {
    return $null
  }

  $configs = Get-NetIPConfiguration -ErrorAction SilentlyContinue

  $candidates = foreach ($entry in $allIPv4) {
    $cfg = $configs | Where-Object { $_.InterfaceIndex -eq $entry.InterfaceIndex } | Select-Object -First 1
    if (-not $cfg -or -not $cfg.NetAdapter) {
      continue
    }

    if ($cfg.NetAdapter.Status -ne 'Up') {
      continue
    }

    if ($cfg.NetAdapter.InterfaceDescription -match $ignoreAdapterPattern) {
      continue
    }

    [PSCustomObject]@{
      InterfaceAlias       = $entry.InterfaceAlias
      InterfaceDescription = $cfg.NetAdapter.InterfaceDescription
      InterfaceIndex       = $entry.InterfaceIndex
      IPAddress            = $entry.IPAddress
      HasDefaultGateway    = [bool]$cfg.IPv4DefaultGateway
      InterfaceMetric      = if ($null -ne $cfg.NetIPv4Interface) { [int]$cfg.NetIPv4Interface.InterfaceMetric } else { 9999 }
      IsWifi               = ($entry.InterfaceAlias -match 'Wi-?Fi|Wireless|WLAN' -or $cfg.NetAdapter.InterfaceDescription -match 'Wi-?Fi|Wireless|WLAN|802\.11')
      IsEthernet           = ($entry.InterfaceAlias -match 'Ethernet' -or $cfg.NetAdapter.InterfaceDescription -match 'Ethernet|Intel\(R\) Ethernet|Realtek.*PCIe')
    }
  }

  if (-not $candidates) {
    return $null
  }

  return $candidates |
    Sort-Object @{ Expression = { if ($_.HasDefaultGateway) { 0 } else { 1 } } },
                @{ Expression = { if ($_.IsWifi) { 0 } elseif ($_.IsEthernet) { 1 } else { 2 } } },
                @{ Expression = { $_.InterfaceMetric } } |
    Select-Object -First 1
}

$selected = Get-PreferredLanAddress
$metroPort = if ($env:RCT_METRO_PORT) { $env:RCT_METRO_PORT } else { '8081' }

if (-not $selected) {
  Write-Host '[start-lan] No valid LAN/Wi-Fi IPv4 found. Falling back to Expo tunnel mode.' -ForegroundColor Yellow
  npx expo start --host tunnel --clear
  exit $LASTEXITCODE
}

$lanIp = $selected.IPAddress
$proxyUrl = "http://$lanIp`:$metroPort"

Write-Host ("[start-lan] Selected adapter: {0}" -f $selected.InterfaceAlias) -ForegroundColor Cyan
Write-Host ("[start-lan] Adapter details:  {0}" -f $selected.InterfaceDescription) -ForegroundColor DarkCyan
Write-Host ("[start-lan] Selected IPv4:   {0}" -f $lanIp) -ForegroundColor Cyan
Write-Host ("[start-lan] Forced host URI: exp://{0}:{1}" -f $lanIp, $metroPort) -ForegroundColor Green

# Process-local only (current shell + child process). Do not persist with setx.
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $lanIp
$env:EXPO_PACKAGER_PROXY_URL = $proxyUrl

# Expo should already bind Metro on all interfaces in LAN mode; this script forces the advertised URL.
npx expo start --host lan --clear
exit $LASTEXITCODE
