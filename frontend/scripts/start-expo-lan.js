const { spawn } = require('child_process');
const { setupExpoLan } = require('./setupExpoLan');

const { ip, expoUrl } = setupExpoLan();

const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: ip,
  EXPO_PUBLIC_DEV_LAN_IP: ip
};

console.log(`[expo-lan] Starting Expo with --host lan on ${ip}`);

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(command, ['expo', 'start', '--host', 'lan'], {
  stdio: 'inherit',
  env
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('[expo-lan] Failed to start Expo:', error.message);
  console.error(`[expo-lan] Last detected Expo URL: ${expoUrl}`);
  process.exit(1);
});
