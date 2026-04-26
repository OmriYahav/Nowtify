$ErrorActionPreference = 'Stop'

$excludedAliasPatterns = @(
  'Loopback',
  'WSL',
  'vEthernet',
  'Docker',
  'Bluetooth',
  'VPN',
  'Virtual',
  'VMware',
  'Hyper-V',
  'Tailscale',
  'ZeroTier',
  'WireGuard',
  'Hamachi'
)

function Test-ExcludedAdapter {
  param(
    [string]$InterfaceAlias,
    [string]$InterfaceDescription
  )

  $alias = $InterfaceAlias ?? ''
  $description = $InterfaceDescription ?? ''

  foreach ($pattern in $excludedAliasPatterns) {
    if ($alias -match [regex]::Escape($pattern) -or $description -match [regex]::Escape($pattern)) {
      return $true
    }
  }

  return $false
}

function Get-LanIPv4 {
  param(
    [string[]]$PreferredTypes
  )

  $configs = Get-NetIPConfiguration |
    Where-Object {
      $_.NetAdapter.Status -eq 'Up' -and
      $_.IPv4Address -and
      -not (Test-ExcludedAdapter -InterfaceAlias $_.InterfaceAlias -InterfaceDescription $_.NetAdapter.InterfaceDescription)
    }

  foreach ($type in $PreferredTypes) {
    $match = $configs | Where-Object { $_.NetAdapter.NdisPhysicalMedium -eq $type }

    foreach ($cfg in $match) {
      $validIPv4 = $cfg.IPv4Address |
        Select-Object -ExpandProperty IPAddress |
        Where-Object {
          $_ -and
          $_ -notmatch '^127\.' -and
          $_ -notmatch '^169\.254\.'
        } |
        Select-Object -First 1

      if ($validIPv4) {
        return $validIPv4
      }
    }
  }

  return $null
}

$lanIp = Get-LanIPv4 -PreferredTypes @('Native802_11', '802_3')

if ($lanIp) {
  Write-Host "Selected LAN IP: $lanIp"
  $env:REACT_NATIVE_PACKAGER_HOSTNAME = $lanIp
  npx expo start --host lan --clear
}
else {
  Write-Warning 'No valid LAN IPv4 address found. Falling back to tunnel mode.'
  npx expo start --host tunnel --clear
}
