const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';

export async function callBackendApi(endpoint, token, method = 'GET', body = null) {
  if (!token) throw new Error("Missing token");

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error: ${res.status}`);
  }
  return res.json();
}
