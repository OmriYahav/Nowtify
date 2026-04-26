const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

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
