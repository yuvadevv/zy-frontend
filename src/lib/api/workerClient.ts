import { SessionManager } from '@/utils/SessionManager';

const rawWorkerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'http://127.0.0.1:8787';
// Force localhost instead of 127.0.0.1 so that HttpOnly cookies set on localhost are sent
const WORKER_URL = rawWorkerUrl.replace('127.0.0.1', 'localhost');

export const workerClient = {
  async fetch(endpoint: string, options: RequestInit = {}, requireAuth = true) {
    const headers = new Headers(options.headers || {});

    // Don't set Content-Type if we are sending FormData (browser needs to set it with boundary)
    const isFormData = options.body instanceof FormData || (options.body && options.body.constructor && options.body.constructor.name === 'FormData');
    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (requireAuth) {
      const token = SessionManager.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const response = await fetch(`${WORKER_URL}${endpoint}`, {
      cache: 'no-store',
      credentials: 'include',
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Worker API error');
    }

    return data;
  },

  async request(endpoint: string, options: RequestInit = {}, requireAuth = true) {
    return this.fetch(endpoint, options, requireAuth);
  },

  async getCustomFileDownloadUrl(fileId: string) {
    const res = await this.fetch(`/api/custom-files/${fileId}/download`);
    const blob = await (res as unknown as Response).blob();
    return URL.createObjectURL(blob);
  },

  async fetchBlob(endpoint: string, options: RequestInit = {}, requireAuth = true) {
    const headers = new Headers(options.headers || {});

    if (requireAuth) {
      const token = SessionManager.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const response = await fetch(`${WORKER_URL}${endpoint}`, {
      cache: 'no-store',
      credentials: 'include',
      ...options,
      headers
    });

    if (response.status === 401) {
      SessionManager.clearSession();
    }

    if (!response.ok) {
      let errorMessage = 'Worker API error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.error || errorMessage;
      } catch (e) {
        // Not JSON
        errorMessage = `HTTP error ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.blob();
  },

  async getPlatformStatus() {
    return this.fetch('/api/platform/status', {}, false);
  },

  async getPublicPricingSettings() {
    return this.fetch('/api/public/settings/pricing', {}, false);
  },

  async getCodeTantraSettings() {
    return this.fetch('/api/public/settings/code-tantra', {}, false);
  },

  async getFaqs() {
    return this.fetch('/api/faqs', {}, false);
  },

  async getContent(type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.fetch(`/api/content${query}`, {}, false);
  },

  async getManualFilters() {
    return this.fetch('/api/manuals/filters', {}, false);
  },

  async getManuals(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/api/manuals?${query}` : '/api/manuals';
    return this.fetch(endpoint, {}, false);
  },

  async getManual(id: string) {
    return this.fetch(`/api/manuals/${id}`, {}, false);
  },

  async getManualFileBlob(id: string) {
    return this.fetchBlob(`/api/manuals/${id}/file`, {}, true);
  },

  // Document Endpoints (Auth Required)
  async uploadDocument(file: File, documentType: 'hall_ticket' | 'custom', pageCount: string, documentId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('pageCount', pageCount);
    if (documentId) {
      formData.append('documentId', documentId);
    }

    return this.fetch('/api/documents', {
      method: 'POST',
      body: formData
    });
  },

  async getDocument(id: string) {
    return this.fetch(`/api/documents/${id}`);
  },

  async deleteDocument(id: string) {
    return this.fetch(`/api/documents/${id}`, {
      method: 'DELETE'
    });
  },

  async createOversizedRequest(payload: any) {
    return this.fetch('/api/custom-files/oversized-requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Orders Endpoints (Auth Required)
  async createOrder(items: unknown[], deliveryDetails: unknown, couponCode?: string | null) {
    return this.fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items, deliveryDetails, couponCode })
    });
  },

  async getOrders() {
    return this.fetch('/api/orders');
  },

  async calculatePricing(payload: any) {
    return this.fetch('/api/orders/calculate-pricing', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getOrder(id: string) {
    return this.fetch(`/api/orders/${id}`);
  },

  // Payments Endpoints (Auth Required)
  async createPayment(orderId: string) {
    return this.fetch('/api/payments/create', {
      method: 'POST',
      body: JSON.stringify({ orderId })
    });
  },

  async verifyPayment(providerOrderId: string, providerPaymentId: string, providerSignature?: string) {
    return this.fetch('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ providerOrderId, providerPaymentId, providerSignature })
    });
  },

  // Refunds
  async getRefundHistory() {
    return this.fetch('/api/refunds');
  },

  // Notifications
  async getNotifications() {
    return this.fetch('/api/notifications');
  },

  async markNotificationRead(id: string) {
    return this.fetch(`/api/notifications/${id}/read`, {
      method: 'POST'
    });
  }
};
