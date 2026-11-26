import { fallbackReviews, fallbackServices, fallbackWorkers } from '../data/catalog';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('SkillConnect is having trouble connecting. Please try again in a moment.');
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status}). Please try again.`);
  }
  if (!payload && response.status !== 204) throw new Error('The server returned an unreadable response. Please try again.');
  return payload;
}

export async function getServices() {
  try { const result = await request('/services'); return Array.isArray(result) ? result : result.items || fallbackServices; }
  catch { return fallbackServices; }
}

export async function getWorkers(search = '') {
  try {
    const result = await request(`/workers${search ? `?search=${encodeURIComponent(search)}` : ''}`);
    return result.items || result.workers || [];
  } catch {
    const normalizedSearch = search.toLowerCase();
    return fallbackWorkers.filter((worker) => `${worker.name} ${worker.skill}`.toLowerCase().includes(normalizedSearch));
  }
}

export async function getReviews() {
  try { const result = await request('/reviews'); return Array.isArray(result) ? result : result.items || fallbackReviews; }
  catch { return fallbackReviews; }
}

export async function subscribeToNewsletter(email) {
  return request('/newsletter/subscriptions', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function registerUser(details) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(details) });
}

export async function loginUser(credentials) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
}

export async function requestPasswordReset(email) {
  return request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function resetPassword(token, password) {
  return request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
}

export async function getCurrentUser(token) {
  return request('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
}

export async function updateProfile(token, profile) {
  return request('/auth/profile', { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(profile) });
}

export async function createBooking(token, booking) {
  return request('/bookings', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(booking) });
}

export async function getBookings(token) {
  const result = await request('/bookings', { headers: { Authorization: `Bearer ${token}` } });
  return result.items || [];
}

export async function updateBookingStatus(token, bookingId, status) {
  return request(`/bookings/${bookingId}/status`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
}

export async function getAdminOverview(token) {
  return request('/admin/overview', { headers: { Authorization: `Bearer ${token}` } });
}

export async function getAdminBookings(token, { page = 1, limit = 10, status = '', search = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  return request(`/admin/bookings?${params}`, { headers: { Authorization: `Bearer ${token}` } });
}

export async function getAdminUsers(token, { page = 1, limit = 10, role = '', search = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (role) params.set('role', role);
  if (search) params.set('search', search);
  return request(`/admin/users?${params}`, { headers: { Authorization: `Bearer ${token}` } });
}

export async function getAdminWorkers(token) {
  return request('/admin/workers', { headers: { Authorization: `Bearer ${token}` } });
}

export async function assignAdminWorker(token, workerId, userId) {
  return request(`/admin/workers/${encodeURIComponent(workerId)}/assign`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ userId }),
  });
}
