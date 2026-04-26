## Starting Expo on LAN

On Windows in this project, **do not start Expo with `npx expo start` directly** if you want automatic LAN IP detection.

`npx expo start` bypasses the custom startup script and can default to `127.0.0.1`, which breaks Expo Go access from other devices.

Use one of these instead:

- `npm start`
- `npm run start:lan`
- `./start-expo.ps1`
- double-click `start-expo.bat`

All of these call `scripts/start-lan.ps1`, which:

- auto-detects the active LAN/Wi-Fi IPv4 address
- prioritizes adapters with a default gateway, then Wi-Fi/Ethernet preference
- filters out WSL/Hyper-V/VPN/virtual adapters to avoid wrong host selection
- sets `REACT_NATIVE_PACKAGER_HOSTNAME` for the current process/session only
- sets `EXPO_PACKAGER_PROXY_URL` to force Expo's advertised `exp://` host to that LAN IP
- starts Expo with LAN mode (`npx expo start --host lan --clear`)
- falls back to tunnel mode if no valid LAN address is found

Why this is needed:

- On some Windows setups with multiple adapters, Expo can still advertise `127.0.0.1` even in LAN mode.
- Forcing `EXPO_PACKAGER_PROXY_URL` (supported by Expo CLI) ensures the manifest host URI and QR URL use your detected LAN IP.

### Verify it worked

After startup, Expo should show a URL like:

- `exp://<current-ip>:8081`

and **not**:

- `exp://127.0.0.1:8081`
