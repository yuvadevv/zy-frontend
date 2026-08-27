import { createClient } from '../supabase/client';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8500';

export const adminClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Admin API error');
    }

    return data;
  },

  async getDashboard() {
    return this.fetch('/api/admin/dashboard');
  },

  async getOrders(params: {
    status?: string, search?: string, page?: number, limit?: number | 'all',
    branch?: string, year?: string, semester?: string, manual_id?: string,
    payment_status?: string, min_price?: string, max_price?: string, sort?: string
  } = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.append(key, String(value));
      }
    });

    const queryString = query.toString();
    const endpoint = queryString ? `/api/admin/orders?${queryString}` : '/api/admin/orders';

    return this.fetch(endpoint);
  },

  async getOrder(id: string) {
    return this.fetch(`/api/admin/orders/${id}`);
  },

  async updateOrderStatus(id: string, status: string, currentStatus: string) {
    return this.fetch(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, currentStatus })
    });
  },

  async bulkUpdateOrders(orderIds: string[], updates: { status?: string, estimatedDelivery?: number | null }) {
    return this.fetch(`/api/admin/orders/bulk`, {
      method: 'PATCH',
      body: JSON.stringify({ orderIds, updates })
    });
  },


  async getCommonManualBatches(status?: string) {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return this.fetch(`/api/admin/orders/batches${query}`);
  },

  async exportOrders(params: any = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    const endpoint = queryString ? `/api/admin/orders/export?${queryString}` : '/api/admin/orders/export';
    return this.fetch(endpoint);
  },

  async validateImport(rows: any[]) {
    return this.fetch(`/api/admin/orders/import/validate`, {
      method: 'POST',
      body: JSON.stringify({ rows })
    });
  },

  async commitImport(updates: any[]) {
    return this.fetch(`/api/admin/orders/import/commit`, {
      method: 'POST',
      body: JSON.stringify({ updates })
    });
  },

  async getDocumentAccessUrl(documentId: string) {
    // This requires the admin to fetch it with their JWT. We can return the full endpoint
    // and let the frontend attach auth, or download it via fetch and blob.
    const res = await this.fetch(`/api/admin/documents/${documentId}/access`);
    const blob = await (res as unknown as Response).blob();
    return URL.createObjectURL(blob);
  },

  async getRoles() {
    return this.fetch('/api/admin/roles');
  },

  async getPermissions() {
    return this.fetch('/api/admin/permissions');
  },

  async getTeam() {
    return this.fetch('/api/admin/team');
  },

  async addTeamMember(data: { id: string, email: string, name?: string, role_id: string }) {
    return this.fetch('/api/admin/team', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getUsers(params: { status?: string, search?: string, page?: number, limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = queryString ? `/api/admin/users?${queryString}` : '/api/admin/users';

    return this.fetch(endpoint);
  },

  async updateUserStatus(id: string, status: string) {
    return this.fetch(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async getBranches() {
    return this.fetch('/api/admin/academic/branches');
  },

  async createBranch(data: { code: string, name: string }) {
    return this.fetch('/api/admin/academic/branches', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateBranch(id: string, data: { name?: string, code?: string }) {
    return this.fetch(`/api/admin/academic/branches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async getAcademicEntity(entity: string) {
    return this.fetch(`/api/admin/academic/${entity}`);
  },

  async createAcademicEntity(entity: string, data: any) {
    return this.fetch(`/api/admin/academic/${entity}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateAcademicEntity(entity: string, id: string, data: any) {
    return this.fetch(`/api/admin/academic/${entity}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async deleteAcademicEntity(entity: string, id: string) {
    return this.fetch(`/api/admin/academic/${entity}/${id}`, {
      method: 'DELETE'
    });
  },

  async getSubjects(params: { branch_id?: string, semester?: string } = {}) {
    const query = new URLSearchParams();
    if (params.branch_id) query.append('branch_id', params.branch_id);
    if (params.semester) query.append('semester', params.semester);

    const queryString = query.toString();
    const endpoint = queryString ? `/api/admin/academic/subjects?${queryString}` : '/api/admin/academic/subjects';
    return this.fetch(endpoint);
  },

  async createSubject(data: { branch_id: string, semester: string, code: string, name: string }) {
    return this.fetch('/api/admin/academic/subjects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getManuals(params: { page?: number, limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = queryString ? `/api/admin/manuals?${queryString}` : '/api/admin/manuals';
    return this.fetch(endpoint);
  },

  async createManual(data: FormData) {
    // Requires bypassing default JSON headers in this.fetch
    // We will use native fetch directly with the token
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const res = await fetch(`${WORKER_URL}/api/admin/manuals`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: data
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Request failed');
    return result;
  },

  async uploadManualPreview(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch(`${WORKER_URL}/api/admin/manuals/${id}/preview-upload`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error?.message || result.error || 'Preview upload failed');
    return result;
  },

  async updateManual(id: string, data: { title?: string, description?: string, pages?: number, base_price?: number, availability_status?: string }) {
    return this.fetch(`/api/admin/manuals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async deleteManual(id: string) {
    return this.fetch(`/api/admin/manuals/${id}`, {
      method: 'DELETE'
    });
  },

  async getSettings() {
    return this.fetch('/api/admin/settings');
  },

  async updateSettings(updates: Array<{ key: string, value: any }>) {
    return this.fetch('/api/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify({ updates })
    });
  },
  async assignOrderVendor(id: string, vendor_id: string) {
    return this.fetch(`/api/admin/orders/${id}/vendor`, {
      method: 'PATCH',
      body: JSON.stringify({ vendor_id })
    });
  },

  async getPayments(params: { search?: string, status?: string, page?: number, limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    const q = query.toString();
    return this.fetch(q ? `/api/admin/payments?${q}` : '/api/admin/payments');
  },

  async getVendors(params: { search?: string, status?: string, page?: number, limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    const q = query.toString();
    return this.fetch(q ? `/api/admin/vendors?${q}` : '/api/admin/vendors');
  },

  async getAuditLogs(params: { actor?: string, action?: string, page?: number, limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.actor) query.append('actor', params.actor);
    if (params.action) query.append('action', params.action);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    const q = query.toString();
    return this.fetch(q ? `/api/admin/audit?${q}` : '/api/admin/audit');
  },

  async getAnalytics() {
    return this.fetch('/api/admin/analytics');
  },

  async getContent() {
    return this.fetch('/api/admin/content');
  },

  async createContent(data: any) {
    return this.fetch('/api/admin/content', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateContent(id: string, data: any) {
    return this.fetch(`/api/admin/content/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async deleteContent(id: string) {
    return this.fetch(`/api/admin/content/${id}`, {
      method: 'DELETE'
    });
  },

  async uploadContentMedia(formData: FormData) {

    // Use native fetch to bypass default JSON headers
    const { createClient } = require('../supabase/client');
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8500';
    const res = await fetch(`${WORKER_URL}/api/admin/content/upload`, {
      method: 'POST',
      headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
      body: formData
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Upload failed');
    return result;
  },

  async getExportCsv(type: string, params: any = {}) {
    // Generate CSV link directly or fetch and return blob URL
    const query = new URLSearchParams(params);
    const q = query.toString();
    const res = await this.fetch(`/api/admin/exports/${type}${q ? '?' + q : ''}`);
    // Assuming backend returns CSV text
    return res;
  },

  async getPaymentGatewayStatus() {
    return this.fetch('/api/admin/payment-gateway/status');
  },

  async updatePaymentGateway(data: { provider: string, environment: string, enabled: boolean }) {
    return this.fetch('/api/admin/payment-gateway', {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async testPaymentGateway() {
    return this.fetch('/api/admin/payment-gateway/test', {
      method: 'POST'
    });
  }
};
