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

function buildErrorMessage(context, error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return `${context}: ${errorMessage}`;
}

export async function apiRequest(path, options = {}) {
  const fullUrl = `${API_BASE_URL}${path}`;
  if (__DEV__) {
    console.log(`[api] ${options.method || 'GET'} ${fullUrl}`);
  }

  let res;
  try {
    res = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
  } catch (error) {
    const message = buildErrorMessage(`Network request failed for ${fullUrl}`, error);
    if (__DEV__) {
      console.error('[api] fetch error', { fullUrl, error });
    }
    throw new Error(message);
  }

  if (!res.ok) {
    let errorText = '';
    try {
      errorText = await res.text();
    } catch (error) {
      if (__DEV__) {
        console.error('[api] failed to read non-OK response body', { fullUrl, status: res.status, error });
      }
    }

    const serverMessage = errorText ? ` - ${errorText}` : '';
    const message = `HTTP ${res.status} ${res.statusText} for ${fullUrl}${serverMessage}`;
    if (__DEV__) {
      console.error('[api] HTTP error response', { fullUrl, status: res.status, statusText: res.statusText, errorText });
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return null;
  }

  try {
    return await res.json();
  } catch (error) {
    const message = buildErrorMessage(`Failed to parse JSON from ${fullUrl}`, error);
    if (__DEV__) {
      console.error('[api] JSON parse error', { fullUrl, error });
    }
    throw new Error(message);
  }
}

export { API_BASE_URL };
