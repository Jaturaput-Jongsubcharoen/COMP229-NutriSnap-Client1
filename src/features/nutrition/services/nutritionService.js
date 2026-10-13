import { backendRequest } from '../../../services/api/backendClient.js';
export async function getEntries() {
  const data = await (
    await backendRequest('/apiMongo', { authenticated: true })
  ).json();
  if (!Array.isArray(data.items))
    throw new Error('The server returned an unexpected history response.');
  return data.items;
}
export async function saveEntry(entry) {
  return (
    await backendRequest('/nutrients', {
      method: 'POST',
      body: entry,
      authenticated: true,
    })
  ).json();
}
export async function deleteEntry(id) {
  await backendRequest(`/apiMongo/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    authenticated: true,
  });
}
