$ErrorActionPreference = 'Stop'

$excludeNamePattern = 'Loopback|Virtual|VMware|Hyper-V|vEthernet|WSL|Docker|VPN|Tailscale|ZeroTier|Bluetooth|Npcap|NAT|Hamachi'
$preferredNamePattern = 'Wi-?Fi|Wireless|WLAN|Ethernet'

function Get-LanIPv4 {
  $configs = Get-NetIPConfiguration | Where-Object {
    $_.NetAdapter.Status -eq 'Up' -and
    $_.IPv4Address -and
    $_.IPv4DefaultGateway -and
    $_.InterfaceAlias -notmatch $excludeNamePattern
  }

  if (-not $configs) {
    return $null
  }

  $preferred = $configs | Where-Object { $_.InterfaceAlias -match $preferredNamePattern }
  $ordered = @($preferred) + @($configs | Where-Object { $_.InterfaceAlias -notmatch $preferredNamePattern })

  foreach ($config in $ordered) {
    foreach ($entry in $config.IPv4Address) {
      $ip = $entry.IPAddress
      if ($ip -and $ip -notmatch '^127\.' -and $ip -notmatch '^169\.254\.') {
        return $ip
      }
    }
  }

  return $null
}

$detectedIp = Get-LanIPv4

if (-not $detectedIp) {
  Write-Warning 'Could not detect an active LAN IPv4 address. Falling back to localhost.'
  $detectedIp = '127.0.0.1'
}

$env:REACT_NATIVE_PACKAGER_HOSTNAME = $detectedIp
Write-Host "[start:lan] Using LAN IP: $detectedIp"
Write-Host '[start:lan] Starting Expo with --host lan --clear ...'

npx expo start --host lan --clear
