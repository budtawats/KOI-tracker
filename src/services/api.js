// Frontend API Client for KOI Japan Shop on Vercel

const API_BASE = '/api';

export const api = {
  // Check API & Database health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { status: 'offline', error: e.message };
    }
  },

  // Orders API
  async getOrders(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = `${API_BASE}/orders${query ? `?${query}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.orders || [];
    } catch (e) {
      console.warn('API getOrders failed, using local cache:', e.message);
      return null;
    }
  },

  async saveOrder(order, isNew = false) {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(`${API_BASE}/orders`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.order;
    } catch (e) {
      console.warn('API saveOrder failed, local fallback:', e.message);
      return order;
    }
  },

  async deleteOrder(orderId) {
    try {
      const res = await fetch(`${API_BASE}/orders?id=${encodeURIComponent(orderId)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return true;
    } catch (e) {
      console.warn('API deleteOrder failed, local fallback:', e.message);
      return false;
    }
  },

  // Trips API
  async getTrips() {
    try {
      const res = await fetch(`${API_BASE}/trips`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.trips || [];
    } catch (e) {
      console.warn('API getTrips failed, using local cache:', e.message);
      return null;
    }
  },

  async saveTrip(trip, isNew = false) {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(`${API_BASE}/trips`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trip)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.trip;
    } catch (e) {
      console.warn('API saveTrip failed, local fallback:', e.message);
      return trip;
    }
  },

  async deleteTrip(tripId) {
    try {
      const res = await fetch(`${API_BASE}/trips?id=${encodeURIComponent(tripId)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return true;
    } catch (e) {
      console.warn('API deleteTrip failed, local fallback:', e.message);
      return false;
    }
  },

  // Settings API
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.settings || null;
    } catch (e) {
      console.warn('API getSettings failed, using local cache:', e.message);
      return null;
    }
  },

  async saveSettings(settings) {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.settings;
    } catch (e) {
      console.warn('API saveSettings failed, local fallback:', e.message);
      return settings;
    }
  },

  // Realtime Cross-Device Cloud Sync
  async fetchFullSync() {
    try {
      const res = await fetch(`${API_BASE}/sync`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async syncAll(payload) {
    try {
      const res = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};
