$ErrorActionPreference = 'Stop'

function Get-PreferredLanAddress {
  $ignoreAliasPattern = 'WSL|Docker|Bluetooth|Loopback|Virtual|Hyper-V|VPN|TAP|TUN|vEthernet|VMware|Npcap'

  $allIPv4 = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object {
    $_.IPAddress -and
    $_.PrefixOrigin -ne 'WellKnown' -and
    $_.IPAddress -notlike '127.*' -and
    $_.IPAddress -notlike '169.254.*' -and
    $_.InterfaceAlias -notmatch $ignoreAliasPattern
  }

  if (-not $allIPv4) {
    return $null
  }

  $configs = Get-NetIPConfiguration -ErrorAction SilentlyContinue

  $candidates = foreach ($entry in $allIPv4) {
    $cfg = $configs | Where-Object { $_.InterfaceIndex -eq $entry.InterfaceIndex } | Select-Object -First 1
    if (-not $cfg) {
      continue
    }

    if (-not $cfg.NetAdapter) {
      continue
    }

    if ($cfg.NetAdapter.Status -ne 'Up') {
      continue
    }

    if ($cfg.NetAdapter.InterfaceDescription -match $ignoreAliasPattern) {
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

  # Prefer: Wi-Fi first, then Ethernet, then anything else that survived filtering.
  # Within each group: prefer interfaces with a default gateway and lower interface metric.
  return $candidates |
    Sort-Object @{ Expression = { if ($_.IsWifi) { 0 } elseif ($_.IsEthernet) { 1 } else { 2 } } },
                @{ Expression = { if ($_.HasDefaultGateway) { 0 } else { 1 } } },
                @{ Expression = { $_.InterfaceMetric } } |
    Select-Object -First 1
}

$selected = Get-PreferredLanAddress

if (-not $selected) {
  Write-Host '[start-lan] No valid LAN/Wi-Fi IPv4 found. Falling back to Expo tunnel mode.' -ForegroundColor Yellow
  npx expo start --host tunnel --clear
  exit $LASTEXITCODE
}

Write-Host ("[start-lan] Selected adapter: {0}" -f $selected.InterfaceAlias) -ForegroundColor Cyan
Write-Host ("[start-lan] Selected IPv4:   {0}" -f $selected.IPAddress) -ForegroundColor Cyan

# Set only for this PowerShell process and child processes (do NOT persist with setx).
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $selected.IPAddress

npx expo start --host lan --clear
exit $LASTEXITCODE
