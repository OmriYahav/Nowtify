import { NativeModules } from 'react-native';
import Constants from 'expo-constants';

const DEFAULT_API_PORT = '8080';

function extractHost(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized) && !normalized.startsWith('//')) {
    normalized = `http://${normalized}`;
  }

  try {
    const parsed = new URL(normalized);
    return parsed.hostname || null;
  } catch {
    const match = trimmed.match(/^([^:/?#]+)/);
    return match ? match[1] : null;
  }
}

function getExpoHostCandidate() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    NativeModules?.SourceCode?.scriptURL;

  return extractHost(hostUri);
}

function resolveDevApiBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return { url: envUrl, reason: 'EXPO_PUBLIC_API_URL' };
  }

  const envLanIp = process.env.EXPO_PUBLIC_DEV_LAN_IP;
  if (envLanIp) {
    return { url: `http://${envLanIp}:${DEFAULT_API_PORT}`, reason: 'EXPO_PUBLIC_DEV_LAN_IP' };
  }

  if (__DEV__) {
    const expoHost = getExpoHostCandidate();
    if (expoHost && expoHost !== 'localhost' && expoHost !== '127.0.0.1') {
      return { url: `http://${expoHost}:${DEFAULT_API_PORT}`, reason: 'Expo host' };
    }

    return { url: `http://localhost:${DEFAULT_API_PORT}`, reason: 'localhost fallback' };
  }

  return { url: `http://localhost:${DEFAULT_API_PORT}`, reason: 'production fallback' };
}

const { url: API_BASE_URL, reason: API_URL_REASON } = resolveDevApiBaseUrl();

if (__DEV__) {
  const expoHost = getExpoHostCandidate();
  console.log(
    `[api] Expo host candidate: ${expoHost || 'n/a'} | API base URL: ${API_BASE_URL} (${API_URL_REASON})`
  );
}

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Request failed');
  }

  return res.status === 204 ? null : res.json();
}

export { API_BASE_URL };
