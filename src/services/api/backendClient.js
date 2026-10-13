export async function backendRequest(
  path,
  { method = 'GET', body, authenticated = false } = {}
) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (authenticated) {
    const token = localStorage.getItem('token');
    if (!token)
      throw new Error('Please log in to access your saved nutrition.');
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${import.meta.env?.VITE_BE_URL ?? ''}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Request failed (${response.status}). Please try again.`
    );
  }
  return response;
}
