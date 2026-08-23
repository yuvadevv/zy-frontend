"use client";

import React, { useState, useEffect } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { Settings, Shield, AlertTriangle, CheckCircle, Wifi, Play, Lock } from 'lucide-react';

export default function PaymentSettingsPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Form states
  const [provider, setProvider] = useState('razorpay');
  const [environment, setEnvironment] = useState('test');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const res = await adminClient.getPaymentGatewayStatus();
      setStatus(res);
      setProvider(res.provider || 'razorpay');
      setEnvironment(res.environment || 'test');
      setEnabled(!!res.enabled);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminClient.updatePaymentGateway({ provider, environment, enabled });
      await loadStatus();
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await adminClient.testPaymentGateway();
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, code: 'NETWORK_ERROR' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payment Gateway Settings</h1>
        <p className="text-muted-foreground text-gray-500">
          Configure the platform's primary payment provider.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Settings className="h-5 w-5" /> Configuration
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Provider</label>
                <select 
                  className="w-full p-2 rounded-md border bg-white"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                >
                  <option value="razorpay">Razorpay</option>
                  <option value="mock" disabled>Mock (Dev Only)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Environment</label>
                <select 
                  className="w-full p-2 rounded-md border bg-white"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                >
                  <option value="test">Test Mode</option>
                  <option value="live">Live Mode</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="enabled"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="enabled" className="text-sm font-medium">Enable Gateway</label>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Shield className="h-5 w-5" /> Credential Status
            </h2>
            <div className="rounded-md border p-4 bg-gray-50">
              <p className="text-sm text-gray-500 mb-4">
                For security, actual secrets are never stored in the database or displayed here. 
                They must be injected via environment variables (<code>RAZORPAY_KEY_ID</code>, <code>RAZORPAY_KEY_SECRET</code>, <code>RAZORPAY_WEBHOOK_SECRET</code>).
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-sm flex items-center gap-2"><Lock className="h-4 w-4 text-gray-400"/> Key ID</span>
                  {status?.keyIdConfigured ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-200">Configured</span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium border border-red-200">Missing</span>
                  )}
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-sm flex items-center gap-2"><Lock className="h-4 w-4 text-gray-400"/> Key Secret</span>
                  {status?.keySecretConfigured ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-200">Configured</span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium border border-red-200">Missing</span>
                  )}
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-sm flex items-center gap-2"><Lock className="h-4 w-4 text-gray-400"/> Webhook Secret</span>
                  {status?.webhookConfigured ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-200">Configured</span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium border border-red-200">Missing</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Wifi className="h-5 w-5" /> Connection Test
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Verify if the backend worker can successfully authenticate with the configured payment gateway provider.
              </p>
              
              <button 
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50" 
                onClick={handleTest} 
                disabled={testing}
              >
                <Play className="h-4 w-4 mr-2" />
                {testing ? 'Testing...' : 'Test Connection'}
              </button>

              {testResult && (
                <div className={`p-3 rounded-md text-sm border flex items-start gap-2 ${testResult.success ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  {testResult.success ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
                  <div>
                    <span className="font-bold">{testResult.code}</span>
                    {testResult.message && <p className="mt-1 opacity-90">{testResult.message}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
            <h2 className="text-blue-800 text-lg font-semibold mb-4">Setup Guide</h2>
            <div className="text-sm text-blue-900 space-y-3">
              <p>To connect Razorpay:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Log in to Razorpay Dashboard.</li>
                <li>Go to Settings &gt; API Keys.</li>
                <li>Generate a new Test or Live key pair.</li>
                <li>Add these as <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> to your Cloudflare Worker environment variables (or `.dev.vars` locally).</li>
                <li>Go to Webhooks and add a new endpoint pointing to:
                  <div className="bg-white border border-blue-200 p-2 rounded mt-1 font-mono text-xs overflow-hidden text-ellipsis">
                    /api/payments/webhook
                  </div>
                </li>
                <li>Set the webhook events to <code>payment.captured</code> and <code>order.paid</code>.</li>
                <li>Copy the Webhook Secret and set it as <code>RAZORPAY_WEBHOOK_SECRET</code> in the Worker env.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
