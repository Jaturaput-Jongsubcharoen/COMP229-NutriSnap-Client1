import { backendRequest } from '../../../services/api/backendClient.js';
export async function login(credentials) {
  return (
    await backendRequest('/login', { method: 'POST', body: credentials })
  ).json();
}
export async function register(details) {
  await backendRequest('/register', { method: 'POST', body: details });
}
export async function getUser() {
  return (await backendRequest('/getUser', { authenticated: true })).json();
}
