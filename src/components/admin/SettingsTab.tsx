import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  Settings,
  Database,
  Github,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Code2,
  DollarSign,
  Copy,
  Check,
  FileSpreadsheet,
  ExternalLink,
  Send
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    exportAllDataAsJSON, 
    importDataFromJSON, 
    resetToDefaults,
    testGoogleSheetWebhook,
    isFirebaseConnected,
    firebaseStatusMessage
  } = useBuilder();

  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedAction, setCopiedAction] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showAppsScriptCode, setShowAppsScriptCode] = useState(false);
  const [testWebhookStatus, setTestWebhookStatus] = useState<{ loading: boolean; success?: boolean; message?: string } | null>(null);

  const googleAppsScriptCode = `// Google Apps Script for Blue Wien Website Builder
// Open your Google Sheet > Extensions > Apps Script > Paste this code > Click Deploy > New Deployment > Web App
// Set "Who has access" to "Anyone"

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Automatically write clean headers on first row if blank
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Reference ID",
        "Full Name",
        "Phone Number",
        "Email Address",
        "City",
        "Loan Facility / Product",
        "Requested Amount (INR)",
        "Tenure (Months)",
        "Employment Type",
        "Monthly Income (INR)",
        "Customer Notes",
        "Lead Status"
      ]);
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#1e3a8a").setFontColor("#ffffff");
    }
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.id || '',
      data.fullName || '',
      data.phone || '',
      data.email || '',
      data.city || '',
      data.productName || '',
      data.requestedAmount || 0,
      data.tenureMonths || 0,
      data.employmentType || '',
      data.monthlyIncome || 0,
      data.notes || '',
      data.status || 'New'
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "id": data.id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Blue Wien Website Builder - Google Sheet Webhook is Live!");
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleTestGoogleSheet = async () => {
    if (!settings.googleSheetWebhookUrl) {
      setTestWebhookStatus({
        loading: false,
        success: false,
        message: 'Please paste your Google Apps Script Web App URL first.'
      });
      return;
    }

    setTestWebhookStatus({ loading: true });
    const res = await testGoogleSheetWebhook(settings.googleSheetWebhookUrl);
    setTestWebhookStatus({
      loading: false,
      success: res.success,
      message: res.message
    });
  };

  const handleExport = () => {
    const dataStr = exportAllDataAsJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bluewien-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataFromJSON(importJsonText);
    if (ok) {
      setImportStatus('success');
      setImportJsonText('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('error');
    }
  };

  const githubActionsWorkflow = `# .github/workflows/deploy.yml
name: Deploy Blue Wien Website Builder to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Production Distribution
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <span>Website Settings &amp; Deployment Engine</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure currencies, deployment targets, GitHub Pages CI/CD automation, and cloud Firestore synchronization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Portal Parameters */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Portal Operation Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Currency Symbol</label>
              <select
                value={settings.currencySymbol}
                onChange={e => updateSettings({ currencySymbol: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="$">$ (USD / AUD / CAD)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - British Pound)</option>
                <option value="₹">₹ (INR - Indian Rupee)</option>
                <option value="AED">AED (Emirati Dirham)</option>
                <option value="CHF">CHF (Swiss Franc)</option>
                <option value="S$">S$ (Singapore Dollar)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Portal Status Mode</label>
              <select
                value={settings.siteStatus}
                onChange={e => updateSettings({ siteStatus: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="live">Live (Operational to Public)</option>
                <option value="maintenance">Maintenance / Private Staging</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 cursor-pointer">
              <span>Enable Customer EMI Loan Calculator Widget</span>
              <input
                type="checkbox"
                checked={settings.enableCustomerLoanCalculator}
                onChange={e => updateSettings({ enableCustomerLoanCalculator: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 cursor-pointer">
              <span>Enable Instant Loan Application Modal</span>
              <input
                type="checkbox"
                checked={settings.enableInstantApplyModal}
                onChange={e => updateSettings({ enableInstantApplyModal: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Database & Firebase Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span>Firebase Cloud Architecture</span>
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isFirebaseConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950/80 text-amber-300 border border-amber-800'
            }`}>
              {isFirebaseConnected ? 'Live Firestore Sync' : 'Standby / Local Storage'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {firebaseStatusMessage}
          </p>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span>Blueprint Schema</span>
              <span className="font-mono text-blue-400">/firebase-blueprint.json</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Security Rules</span>
              <span className="font-mono text-emerald-400">/firestore.rules</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Admin Gatekeeper</span>
              <span className="font-mono text-slate-300">readyloans.in@gmail.com</span>
            </div>
          </div>

          <div className="p-3 bg-blue-950/30 rounded-lg border border-blue-900/40 text-[11px] text-blue-300">
            All updates and changes are immediately saved locally and ready to synchronize to Firebase Firestore whenever your Firebase credentials are added to <code className="text-white">.env</code>.
          </div>
        </div>
      </div>

      {/* Google Sheets & Google Forms Integration Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Google Sheets &amp; Google Forms Integration</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  Real-time Auto-Sync
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically append every customer loan application directly into your private Google Sheet without any manual copying.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-3 bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800 cursor-pointer text-xs font-semibold text-slate-300 self-start sm:self-auto">
            <span>Enable Google Sheet Sync</span>
            <input
              type="checkbox"
              checked={settings.enableGoogleSheetSync || false}
              onChange={e => updateSettings({ enableGoogleSheetSync: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded"
            />
          </label>
        </div>

        {/* Configuration inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Google Apps Script Webhook URL (POST Endpoint)
              </label>
              <input
                type="url"
                value={settings.googleSheetWebhookUrl || ''}
                onChange={e => updateSettings({ googleSheetWebhookUrl: e.target.value })}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Generated from your Google Sheet &gt; Extensions &gt; Apps Script &gt; Deploy as Web App.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Direct Google Sheet View Link (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={settings.googleSheetDirectUrl || ''}
                  onChange={e => updateSettings({ googleSheetDirectUrl: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 font-mono"
                />
                {settings.googleSheetDirectUrl && (
                  <a
                    href={settings.googleSheetDirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Sheet</span>
                  </a>
                )}
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTestGoogleSheet}
                disabled={testWebhookStatus?.loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testWebhookStatus?.loading ? 'Sending Test Lead...' : 'Send Test Lead to Google Sheet'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAppsScriptCode(!showAppsScriptCode)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer border border-slate-700 transition-colors"
              >
                {showAppsScriptCode ? 'Hide Setup Code' : 'View 1-Min Setup Script'}
              </button>
            </div>

            {testWebhookStatus && (
              <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                testWebhookStatus.success 
                  ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' 
                  : 'bg-rose-950/60 border border-rose-800 text-rose-300'
              }`}>
                {testWebhookStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />}
                <span>{testWebhookStatus.message}</span>
              </div>
            )}
          </div>

          {/* Google Forms Option */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>Google Form Attachment</span>
              </h4>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <span>Show on Website</span>
                <input
                  type="checkbox"
                  checked={settings.enableGoogleFormEmbed || false}
                  onChange={e => updateSettings({ enableGoogleFormEmbed: e.target.checked })}
                  className="w-3.5 h-3.5 accent-blue-600 rounded"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Google Form Embed or Share URL
              </label>
              <input
                type="url"
                value={settings.googleFormEmbedUrl || ''}
                onChange={e => updateSettings({ googleFormEmbedUrl: e.target.value })}
                placeholder="https://docs.google.com/forms/d/e/.../viewform"
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                You can paste the Google Form URL. When enabled, visitors see a button or embed to fill your detailed Google Form.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Button Label for Google Form
              </label>
              <input
                type="text"
                value={settings.googleFormButtonText || 'Open Detailed Google Form'}
                onChange={e => updateSettings({ googleFormButtonText: e.target.value })}
                placeholder="e.g. Open Official Google Form"
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Expandable Apps Script Code Box */}
        {showAppsScriptCode && (
          <div className="p-4 bg-slate-950 rounded-xl border border-emerald-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-emerald-300">
                  Google Apps Script (১ মিনিটে সেটাপ করার কোড)
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Google Sheet খুলুন &gt; Extensions &gt; Apps Script-এ যান &gt; নিচের কোডটি পেস্ট করে <strong>Deploy &gt; New deployment &gt; Web app</strong> করুন (Who has access: <strong>Anyone</strong>)।
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyScript}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied Script!' : 'Copy Apps Script'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-48 border border-slate-800">
              {googleAppsScriptCode}
            </pre>
          </div>
        )}
      </div>

      {/* GitHub Pages Deployment Ready Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold text-white">GitHub Pages Deployment Preparation</h3>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(githubActionsWorkflow);
              setCopiedAction(true);
              setTimeout(() => setCopiedAction(false), 2000);
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            {copiedAction ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAction ? 'Copied Workflow!' : 'Copy GitHub Action'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          This project is structured for single-page application (SPA) deployment on GitHub Pages. To deploy to your repository:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">Step 1: Push Code</span>
            <p className="text-slate-400 text-[11px]">Push your Vite React project files to your GitHub repository (e.g. main branch).</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">Step 2: Enable Pages</span>
            <p className="text-slate-400 text-[11px]">In GitHub Repo &gt; Settings &gt; Pages, set Source to <strong>GitHub Actions</strong>.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-white block">Step 3: Auto Deployment</span>
            <p className="text-slate-400 text-[11px]">The GitHub Actions workflow builds the dist folder and hosts your portal live.</p>
          </div>
        </div>
      </div>

      {/* Backup, Restore & Reset */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Data Backup, Migration &amp; Restore
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export & Reset */}
          <div className="space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Export your entire website state (products, branding, visual section orders, pages, theme colors, inquiries) to a single JSON archive.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Full Website JSON</span>
              </button>

              <button
                type="button"
                onClick={resetToDefaults}
                className="px-4 py-2 bg-slate-800 hover:bg-rose-950 text-rose-300 hover:text-rose-200 border border-slate-700 hover:border-rose-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Initial Seed</span>
              </button>
            </div>
          </div>

          {/* Import JSON */}
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Paste JSON backup data to restore or migrate configuration:
            </p>
            <textarea
              rows={3}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder="Paste JSON archive here..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleImport}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import &amp; Restore</span>
              </button>
              {importStatus === 'success' && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Successfully Restored!
                </span>
              )}
              {importStatus === 'error' && (
                <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Invalid JSON Format
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
