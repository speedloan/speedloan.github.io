import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  Inbox,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Phone,
  Mail,
  User,
  Trash2,
  Calendar,
  ChevronRight,
  MessageSquare,
  FileSpreadsheet,
  ExternalLink
} from 'lucide-react';
import { CustomerEnquiry, EnquiryStatus } from '../../types/index.ts';

const statuses: EnquiryStatus[] = ['New', 'Contacted', 'In Review', 'Approved', 'Rejected'];

export const EnquiriesTab: React.FC = () => {
  const { enquiries, updateEnquiryStatus, deleteEnquiry, settings } = useBuilder();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(enquiries[0] || null);
  const [adminNotes, setAdminNotes] = useState(selectedEnquiry?.adminNotes || '');

  const filtered = enquiries.filter(e => {
    const matchSearch = e.fullName.toLowerCase().includes(search.toLowerCase()) ||
                        e.email.toLowerCase().includes(search.toLowerCase()) ||
                        (e.productName && e.productName.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSelect = (enq: CustomerEnquiry) => {
    setSelectedEnquiry(enq);
    setAdminNotes(enq.adminNotes || '');
  };

  const handleSaveNotes = () => {
    if (!selectedEnquiry) return;
    updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, adminNotes);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Full Name', 'Email', 'Phone', 'Product', 'Requested Amount', 'Tenure (Months)', 'Employment', 'Status', 'Notes'];
    const rows = enquiries.map(e => [
      e.id,
      new Date(e.createdAt).toLocaleDateString(),
      `"${e.fullName}"`,
      e.email,
      e.phone,
      `"${e.productName || 'General'}"`,
      e.requestedAmount || 0,
      e.tenureMonths || 0,
      e.employmentType || '',
      e.status,
      `"${(e.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bluewien-enquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-400" />
            <span>Customer Inquiries &amp; Loan Applications</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming borrower leads, update approval pipeline stages, and document credit underwriting notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {settings.enableGoogleSheetSync && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-[11px] font-semibold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sheets Live Sync Active</span>
            </span>
          )}

          {settings.googleSheetDirectUrl && (
            <a
              href={settings.googleSheetDirectUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open Google Sheet</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>
          )}

          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Inquiries (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or loan product..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="all">All Stages ({enquiries.length})</option>
            {statuses.map(st => (
              <option key={st} value={st}>
                {st} ({enquiries.filter(e => e.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Split View: List and Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Customer Applications</span>
            <span>{filtered.length} leads</span>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-xs">
                No customer inquiries found.
              </div>
            ) : (
              filtered.map(enq => {
                const isSelected = selectedEnquiry?.id === enq.id;
                return (
                  <div
                    key={enq.id}
                    onClick={() => handleSelect(enq)}
                    className={`p-4 flex items-center justify-between gap-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/15 border-l-4 border-blue-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white truncate">{enq.fullName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          enq.status === 'New'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : enq.status === 'In Review'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : enq.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {enq.productName || 'General Product'} • {enq.email}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                        <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{enq.phone}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-white block">
                        {settings.currencySymbol}{(enq.requestedAmount || 0).toLocaleString()}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 ml-auto mt-1" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Lead Detail & Underwriting Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
          {selectedEnquiry ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-slate-500">REF #{selectedEnquiry.id}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedEnquiry.fullName}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Delete this inquiry record?')) {
                      deleteEnquiry(selectedEnquiry.id);
                      setSelectedEnquiry(null);
                    }
                  }}
                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Underwriting Pipeline Stage
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {statuses.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateEnquiryStatus(selectedEnquiry.id, st)}
                      className={`py-1.5 px-2 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        selectedEnquiry.status === st
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Details Box */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Requested Loan</span>
                  </span>
                  <span className="font-bold text-white">
                    {settings.currencySymbol}{(selectedEnquiry.requestedAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Tenure Term</span>
                  </span>
                  <span className="font-semibold text-slate-200">
                    {selectedEnquiry.tenureMonths || 36} Months
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Direct Email</span>
                  </span>
                  <span className="font-medium text-blue-400">
                    <a href={`mailto:${selectedEnquiry.email}`}>{selectedEnquiry.email}</a>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number</span>
                  </span>
                  <span className="font-medium text-slate-200">
                    <a href={`tel:${selectedEnquiry.phone}`}>{selectedEnquiry.phone}</a>
                  </span>
                </div>
                {selectedEnquiry.employmentType && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Employment Status</span>
                    <span className="font-medium text-slate-300">{selectedEnquiry.employmentType}</span>
                  </div>
                )}
                {selectedEnquiry.monthlyIncome && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Stated Income</span>
                    <span className="font-medium text-slate-300">
                      {settings.currencySymbol}{selectedEnquiry.monthlyIncome.toLocaleString()} /mo
                    </span>
                  </div>
                )}
              </div>

              {/* Admin Underwriting Notes */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Internal Credit Committee Notes
                </label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  placeholder="Record customer conversations, requested documents, credit score verification..."
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all cursor-pointer"
                >
                  Save Underwriting Notes
                </button>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              Select an inquiry from the list to review borrower information.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
