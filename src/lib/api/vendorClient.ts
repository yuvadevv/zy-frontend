import { SessionManager } from '@/utils/SessionManager';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://127.0.0.1:8787';

export const vendorClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const token = SessionManager.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${WORKER_URL}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers
    });

    // For document access which returns raw binary stream
    if (endpoint.includes('/access') && response.ok) {
      return response;
    }

    const data = await response.json().catch(() => ({ error: 'Invalid response format' }));

    if (!response.ok) {
      const message = data.error?.message || data.error || 'Vendor API error';
      const error = new Error(message) as any;
      error.status = response.status;
      error.code = data.code || 'UNKNOWN_ERROR';
      throw error;
    }

    return data;
  },

  async getDashboard() {
    return this.fetch('/api/vendor/dashboard');
  },

  async getOrders(params: any = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    });

    const queryString = query.toString();
    const endpoint = queryString ? `/api/vendor/orders?${queryString}` : '/api/vendor/orders';

    return this.fetch(endpoint);
  },

  async getOrder(id: string) {
    return this.fetch(`/api/vendor/orders/${id}`);
  },

  async updateOrderStatus(id: string, status: string, currentStatus: string) {
    return this.fetch(`/api/vendor/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, currentStatus })
    });
  },


  async bulkUpdateOrders(orderIds: string[], updates: any) {
    return this.fetch('/api/vendor/orders/bulk', {
      method: 'PATCH',
      body: JSON.stringify({ orderIds, updates })
    });
  },

  async getCommonManualBatches(params: { status?: string } = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    return this.fetch(`/api/vendor/orders/batches?${query.toString()}`);
  },

  async exportOrders(params: any = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value as string);
    });
    return this.fetch(`/api/vendor/orders/export?${query.toString()}`);
  },

  async validateImport(rows: any[]) {
    return this.fetch('/api/vendor/orders/import/validate', {
      method: 'POST',
      body: JSON.stringify({ rows })
    });
  },

  async commitImport(updates: any[]) {
    return this.fetch('/api/vendor/orders/import/commit', {
      method: 'POST',
      body: JSON.stringify({ updates })
    });
  },

  async getDocumentAccessUrl(documentId: string) {

    const res = await this.fetch(`/api/vendor/documents/${documentId}/access`);
    const blob = await (res as unknown as Response).blob();
    return URL.createObjectURL(blob);
  }
};
