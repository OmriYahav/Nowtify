import { NativeModules } from 'react-native';
import Constants from 'expo-constants';

const DEFAULT_API_PORT = '8080';

export class ApiError extends Error {
  constructor(message, { status, url, body } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

function extractHost(value) {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

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
  if (envUrl) return { url: envUrl, reason: 'EXPO_PUBLIC_API_URL' };

  const envLanIp = process.env.EXPO_PUBLIC_DEV_LAN_IP;
  if (envLanIp) return { url: `http://${envLanIp}:${DEFAULT_API_PORT}`, reason: 'EXPO_PUBLIC_DEV_LAN_IP' };

  const expoHost = getExpoHostCandidate();
  if (expoHost && expoHost !== 'localhost' && expoHost !== '127.0.0.1') {
    return { url: `http://${expoHost}:${DEFAULT_API_PORT}`, reason: 'Expo host' };
  }

  return { url: `http://localhost:${DEFAULT_API_PORT}`, reason: 'localhost fallback' };
}

const { url: API_BASE_URL, reason: API_URL_REASON } = resolveDevApiBaseUrl();

if (__DEV__) {
  console.log(`[api] base URL: ${API_BASE_URL} (${API_URL_REASON})`);
}

function parseBodyText(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest(path, options = {}) {
  const fullUrl = `${API_BASE_URL}${path}`;
  if (__DEV__) console.log(`[api] ${options.method || 'GET'} ${fullUrl}`);

  let response;
  try {
    response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
  } catch (error) {
    throw new ApiError(`Network request failed for ${fullUrl}`, { url: fullUrl, body: String(error) });
  }

  const text = await response.text();
  const parsedBody = parseBodyText(text);

  if (!response.ok) {
    const detail = typeof parsedBody === 'string'
      ? parsedBody
      : parsedBody?.message || parsedBody?.error || response.statusText;
    throw new ApiError(`HTTP ${response.status}: ${detail}`, {
      status: response.status,
      url: fullUrl,
      body: parsedBody
    });
  }

  if (response.status === 204 || text === '') return null;
  return parsedBody;
}

export { API_BASE_URL };
