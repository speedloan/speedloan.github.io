import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import {
  LayoutDashboard,
  Building,
  Image as ImageIcon,
  Palette,
  Compass,
  PanelBottom,
  PackageCheck,
  FolderTree,
  Flag,
  FileText,
  Edit3,
  Eye,
  Inbox,
  Search,
  PhoneCall,
  Settings,
  Globe,
  LogOut,
  ChevronRight,
  Shield,
  Menu,
  X,
  Database,
  ArrowUpRight,
  CheckCircle2,
  Download
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  category: 'core' | 'appearance' | 'catalog' | 'cms' | 'operations';
}

const navItems: NavItem[] = [
  // Core
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'core' },
  { id: 'branding', label: 'Website Branding', icon: Building, category: 'core' },
  { id: 'logos', label: 'Logo Management', icon: ImageIcon, category: 'core' },
  { id: 'theme', label: 'Theme & Colors', icon: Palette, category: 'appearance' },
  { id: 'header', label: 'Header Management', icon: Compass, category: 'appearance' },
  { id: 'footer', label: 'Footer Management', icon: PanelBottom, category: 'appearance' },
  // Catalog
  { id: 'products', label: 'Product Management', icon: PackageCheck, category: 'catalog' },
  { id: 'categories', label: 'Product Categories', icon: FolderTree, category: 'catalog' },
  // Marketing & CMS
  { id: 'banners', label: 'Banner Management', icon: Flag, category: 'cms' },
  { id: 'pages', label: 'Page Management', icon: FileText, category: 'cms' },
  { id: 'visual-editor', label: 'Visual Website Editor', icon: Edit3, category: 'cms' },
  { id: 'live-preview', label: 'Live Preview', icon: Eye, category: 'cms' },
  // Operations
  { id: 'enquiries', label: 'Customer Enquiries', icon: Inbox, category: 'operations' },
  { id: 'seo', label: 'SEO Settings', icon: Search, category: 'operations' },
  { id: 'contact', label: 'Contact Settings', icon: PhoneCall, category: 'operations' },
  { id: 'settings', label: 'Website Settings', icon: Settings, category: 'operations' },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    branding, 
    activeAdminTab, 
    setActiveAdminTab, 
    setActiveView, 
    adminUser, 
    logoutAdmin,
    enquiries,
    products,
    exportAllDataAsJSON,
    isFirebaseConnected
  } = useBuilder();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length;

  const handleExport = () => {
    const dataStr = exportAllDataAsJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bluewien-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-16 bg-slate-900/90 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            {branding.logoUrl ? (
              <div className="bg-white px-2.5 py-1 rounded-lg flex items-center shadow">
                <img
                  src={branding.logoUrl}
                  alt={branding.companyName}
                  className="h-7 w-auto max-w-[140px] object-contain"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-900/50 text-white font-black text-sm tracking-widest border border-blue-400/30">
                BW
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">Console</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/60 uppercase">
                  No-Code Builder
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">White Label Financial CMS Engine</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            title="Download Full CMS JSON Backup"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Backup</span>
          </button>

          {/* Switch to Public Website */}
          <button
            onClick={() => setActiveView('public')}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/40 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Website</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-200" />
          </button>

          {/* Admin Profile & Status */}
          <div className="h-7 w-px bg-slate-800 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden md:block">
              <p className="text-xs font-medium text-slate-200">{adminUser?.email || 'readyloans.in@gmail.com'}</p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Super Admin</span>
              </div>
            </div>
            
            <button
              onClick={logoutAdmin}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside 
          className={`fixed lg:static inset-y-16 left-0 z-20 w-64 bg-slate-900/95 border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-200 backdrop-blur-xl ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Navigation (16 Modules)
              </p>
              <div className="space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeAdminTab === item.id;
                  const isEnquiry = item.id === 'enquiries' && newEnquiriesCount > 0;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveAdminTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isEnquiry && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            {newEnquiriesCount}
                          </span>
                        )}
                        {item.id === 'products' && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-800 text-slate-400">
                            {products.length}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Database / Architecture Footer card */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  <span>Firestore DB</span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  isFirebaseConnected 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                    : 'bg-amber-950/80 text-amber-300 border border-amber-800/70'
                }`}>
                  {isFirebaseConnected ? 'Connected' : 'Standby / Local'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Blueprint &amp; security rules loaded. Auto-syncing across changes.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
