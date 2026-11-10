import React, { useState } from 'react';
import { BuilderProvider, useBuilder } from './context/BuilderContext.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { AdminAuthModal } from './components/admin/AdminAuthModal.tsx';
import { DashboardTab } from './components/admin/DashboardTab.tsx';
import { BrandingTab } from './components/admin/BrandingTab.tsx';
import { LogoTab } from './components/admin/LogoTab.tsx';
import { ThemeColorsTab } from './components/admin/ThemeColorsTab.tsx';
import { HeaderTab } from './components/admin/HeaderTab.tsx';
import { FooterTab } from './components/admin/FooterTab.tsx';
import { ProductManagerTab } from './components/admin/ProductManagerTab.tsx';
import { CategoriesTab } from './components/admin/CategoriesTab.tsx';
import { BannerManagerTab } from './components/admin/BannerManagerTab.tsx';
import { PageManagerTab } from './components/admin/PageManagerTab.tsx';
import { VisualEditorTab } from './components/admin/VisualEditorTab.tsx';
import { LivePreviewTab } from './components/admin/LivePreviewTab.tsx';
import { EnquiriesTab } from './components/admin/EnquiriesTab.tsx';
import { SeoTab } from './components/admin/SeoTab.tsx';
import { ContactTab } from './components/admin/ContactTab.tsx';
import { SettingsTab } from './components/admin/SettingsTab.tsx';
import { PublicAppView } from './components/public/PublicAppView.tsx';

const AppContent: React.FC = () => {
  const { activeView, activeAdminTab, adminUser, setActiveView } = useBuilder();

  // If user navigated to admin view but is not authenticated via Firebase
  if (activeView === 'admin' && !adminUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <AdminAuthModal isOpen={true} onClose={() => setActiveView('public')} />
      </div>
    );
  }

  if (activeView === 'admin') {
    return (
      <AdminLayout>
        {activeAdminTab === 'dashboard' && <DashboardTab />}
        {activeAdminTab === 'branding' && <BrandingTab />}
        {activeAdminTab === 'logos' && <LogoTab />}
        {activeAdminTab === 'theme' && <ThemeColorsTab />}
        {activeAdminTab === 'header' && <HeaderTab />}
        {activeAdminTab === 'footer' && <FooterTab />}
        {activeAdminTab === 'products' && <ProductManagerTab />}
        {activeAdminTab === 'categories' && <CategoriesTab />}
        {activeAdminTab === 'banners' && <BannerManagerTab />}
        {activeAdminTab === 'pages' && <PageManagerTab />}
        {activeAdminTab === 'visual-editor' && <VisualEditorTab />}
        {activeAdminTab === 'live-preview' && <LivePreviewTab />}
        {activeAdminTab === 'enquiries' && <EnquiriesTab />}
        {activeAdminTab === 'seo' && <SeoTab />}
        {activeAdminTab === 'contact' && <ContactTab />}
        {activeAdminTab === 'settings' && <SettingsTab />}
      </AdminLayout>
    );
  }

  return <PublicAppView />;
};

export default function App() {
  return (
    <BuilderProvider>
      <AppContent />
    </BuilderProvider>
  );
}
