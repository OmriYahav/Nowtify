$ErrorActionPreference = 'Stop'

$adapters = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object {
    $_.IPAddress -notlike '127.*' -and
    $_.IPAddress -notlike '169.254.*' -and
    $_.InterfaceAlias -notmatch 'WSL|Docker|Bluetooth|Loopback|Virtual|Hyper-V'
  }

$wifi = $adapters |
  Where-Object {
    $_.InterfaceAlias -match 'Wi-Fi|Wireless'
  } |
  Select-Object -First 1

$ethernet = $adapters |
  Where-Object {
    $_.InterfaceAlias -match 'Ethernet'
  } |
  Select-Object -First 1

if ($wifi) {
  $ip = $wifi.IPAddress
}
elseif ($ethernet) {
  $ip = $ethernet.IPAddress
}
else {
  $ip = $null
}

if (-not $ip) {
  Write-Host 'No valid LAN IP found. Starting Expo tunnel...'
  npx expo start --host tunnel --clear
  exit
}

Write-Host "Starting Expo with LAN IP: $ip"

$env:REACT_NATIVE_PACKAGER_HOSTNAME = $ip

npx expo start --host lan --clear
