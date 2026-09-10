import { fallbackReviews, fallbackServices, fallbackWorkers } from '../data/catalog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error((await response.json()).message || 'API request failed');
  }

  return response.json();
}

export async function getServices() {
  try {
    return await request('/services');
  } catch {
    return fallbackServices;
  }
}

export async function getWorkers(search = '') {
  try {
    const result = await request(`/workers${search ? `?search=${encodeURIComponent(search)}` : ''}`);
    return result.items;
  } catch {
    const normalizedSearch = search.toLowerCase();
    return fallbackWorkers.filter((worker) => `${worker.name} ${worker.skill}`.toLowerCase().includes(normalizedSearch));
  }
}

export async function getReviews() {
  try {
    return await request('/reviews');
  } catch {
    return fallbackReviews;
  }
}

export async function subscribeToNewsletter(email) {
  return request('/newsletter/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function registerUser(details) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(details) });
}

export async function loginUser(credentials) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
}

export async function getCurrentUser(token) {
  return request('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
}

export async function createBooking(token, booking) {
  return request('/bookings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(booking),
  });
}

export async function getBookings(token) {
  const result = await request('/bookings', { headers: { Authorization: `Bearer ${token}` } });
  return result.items;
}

export async function updateBookingStatus(token, bookingId, status) {
  return request(`/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}
