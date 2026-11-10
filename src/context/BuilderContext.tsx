import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  BrandingSettings,
  ThemeSettings,
  HeaderSettings,
  FooterSettings,
  Product,
  ProductCategory,
  Banner,
  PageContent,
  VisualSection,
  TestimonialItem,
  CustomerEnquiry,
  SEOSettings,
  ContactSettings,
  WebsiteSettings,
  AdminUser,
  EnquiryStatus
} from '../types/index.ts';
import {
  defaultBranding,
  defaultTheme,
  defaultHeader,
  defaultFooter,
  defaultProducts,
  defaultCategories,
  defaultBanners,
  defaultPages,
  defaultVisualSections,
  defaultTestimonials,
  defaultEnquiries,
  defaultSEO,
  defaultContact,
  defaultSettings
} from '../data/defaultData.ts';
import { 
  testConnection, 
  isFirebaseConfigured, 
  syncDocToFirestore, 
  deleteDocFromFirestore, 
  fetchCollectionFromFirestore,
  fetchDocFromFirestore,
  subscribeCollectionFromFirestore,
  getFirebaseAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from '../services/firebase.ts';

interface BuilderContextType {
  branding: BrandingSettings;
  theme: ThemeSettings;
  header: HeaderSettings;
  footer: FooterSettings;
  products: Product[];
  categories: ProductCategory[];
  banners: Banner[];
  pages: PageContent[];
  visualSections: VisualSection[];
  testimonials: TestimonialItem[];
  enquiries: CustomerEnquiry[];
  seo: SEOSettings;
  contact: ContactSettings;
  settings: WebsiteSettings;
  adminUser: AdminUser | null;
  activeView: 'public' | 'admin';
  activeAdminTab: string;
  activePublicPage: string;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  selectedProductIdForDetail: string | null;
  isApplyModalOpen: boolean;
  preselectedProductForApply: Product | null;
  isFirebaseConnected: boolean;
  firebaseStatusMessage: string;
  hasUnsavedChanges: boolean;
  
  // Actions
  updateBranding: (newBranding: Partial<BrandingSettings>) => void;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
  updateHeader: (newHeader: Partial<HeaderSettings>) => void;
  updateFooter: (newFooter: Partial<FooterSettings>) => void;
  
  // Products
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  
  // Categories
  addCategory: (category: Omit<ProductCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<ProductCategory>) => void;
  deleteCategory: (id: string) => void;
  
  // Banners
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;
  
  // Pages
  updatePage: (id: string, page: Partial<PageContent>) => void;
  addPage: (page: Omit<PageContent, 'id' | 'isSystemPage' | 'lastUpdated'>) => void;
  deletePage: (id: string) => void;
  
  // Visual Editor
  updateVisualSection: (id: string, section: Partial<VisualSection>) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  toggleSectionVisibility: (id: string) => void;
  
  // Testimonials / Client Stories
  addTestimonial: (item: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonial: (id: string, item: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;
  
  // Enquiries
  submitEnquiry: (enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, notes?: string) => void;
  deleteEnquiry: (id: string) => void;
  
  // SEO, Contact, Settings
  updateSEO: (newSEO: Partial<SEOSettings>) => void;
  updateContact: (newContact: Partial<ContactSettings>) => void;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;
  
  // Navigation & Modals
  setActiveView: (view: 'public' | 'admin') => void;
  setActiveAdminTab: (tab: string) => void;
  setActivePublicPage: (pageSlug: string) => void;
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  openProductDetail: (productId: string) => void;
  closeProductDetail: () => void;
  openApplyModal: (product?: Product) => void;
  closeApplyModal: () => void;
  
  // Auth
  loginAdmin: (email: string, password?: string) => Promise<boolean>;
  logoutAdmin: () => void;
  
  // Google Sheets Integration
  testGoogleSheetWebhook: (url: string) => Promise<{ success: boolean; message: string }>;
  
  // Backup / Reset
  exportAllDataAsJSON: () => string;
  importDataFromJSON: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'bluewien_cms_';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export const BuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingSettings>(() => {
    const stored = loadStored<Partial<BrandingSettings>>('branding', {});
    const isOldPlaceholder = !stored.logoUrl || stored.logoUrl.includes('unsplash.com');
    return {
      ...defaultBranding,
      ...stored,
      logoUrl: isOldPlaceholder ? defaultBranding.logoUrl : (stored.logoUrl || defaultBranding.logoUrl),
      showCompanyNameBesideLogo: stored.showCompanyNameBesideLogo ?? false,
      logoMaxWidth: stored.logoMaxWidth ?? 240,
      logoHeight: stored.logoHeight ?? 52,
    };
  });
  const [theme, setTheme] = useState<ThemeSettings>(() => loadStored('theme', defaultTheme));
  const [header, setHeader] = useState<HeaderSettings>(() => loadStored('header', defaultHeader));
  const [footer, setFooter] = useState<FooterSettings>(() => loadStored('footer', defaultFooter));
  const [products, setProducts] = useState<Product[]>(() => loadStored('products', defaultProducts));
  const [categories, setCategories] = useState<ProductCategory[]>(() => loadStored('categories', defaultCategories));
  const [banners, setBanners] = useState<Banner[]>(() => loadStored('banners', defaultBanners));
  const [pages, setPages] = useState<PageContent[]>(() => loadStored('pages', defaultPages));
  const [visualSections, setVisualSections] = useState<VisualSection[]>(() => loadStored('visualSections', defaultVisualSections));
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => loadStored('testimonials', defaultTestimonials));
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(() => loadStored('enquiries', defaultEnquiries));
  const [seo, setSeo] = useState<SEOSettings>(() => loadStored('seo', defaultSEO));
  const [contact, setContact] = useState<ContactSettings>(() => loadStored('contact', defaultContact));
  const [settings, setSettings] = useState<WebsiteSettings>(() => loadStored('settings', defaultSettings));

  // Admin user & session - Strictly null by default (no mock bypass, requires Firebase Auth)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Monitor real Firebase Authentication state changes
  useEffect(() => {
    const authInstance = getFirebaseAuth();
    if (authInstance) {
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        if (user) {
          setAdminUser({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
            role: 'Super Administrator'
          });
        } else {
          setAdminUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const [activeView, setActiveView] = useState<'public' | 'admin'>('public');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [activePublicPage, setActivePublicPage] = useState<string>('home');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const [selectedProductIdForDetail, setSelectedProductIdForDetail] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [preselectedProductForApply, setPreselectedProductForApply] = useState<Product | null>(null);

  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [firebaseStatusMessage, setFirebaseStatusMessage] = useState<string>('Checking Firebase Cloud Database...');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Check Firebase and initialize live sync
  useEffect(() => {
    let isMounted = true;
    const initFirebase = async () => {
      if (isFirebaseConfigured()) {
        const res = await testConnection();
        if (!isMounted) return;
        setIsFirebaseConnected(res.success);
        setFirebaseStatusMessage(res.message);

        if (res.success) {
          try {
            // Load live data from Firestore
            const [fbProducts, fbCategories, fbBanners, fbPages, fbEnquiries, fbBranding, fbTheme] = await Promise.all([
              fetchCollectionFromFirestore<Product>('products'),
              fetchCollectionFromFirestore<ProductCategory>('categories'),
              fetchCollectionFromFirestore<Banner>('banners'),
              fetchCollectionFromFirestore<PageContent>('pages'),
              fetchCollectionFromFirestore<CustomerEnquiry>('enquiries'),
              fetchDocFromFirestore<BrandingSettings>('settings', 'branding'),
              fetchDocFromFirestore<ThemeSettings>('settings', 'theme')
            ]);

            // If remote products exist, sync into local state; otherwise, seed defaults to cloud
            if (fbProducts && fbProducts.length > 0) {
              setProducts(fbProducts);
            } else {
              // Seed initial products to Firestore
              for (const p of defaultProducts) {
                await syncDocToFirestore('products', p.id, p);
              }
            }

            if (fbCategories && fbCategories.length > 0) {
              setCategories(fbCategories);
            } else {
              for (const c of defaultCategories) {
                await syncDocToFirestore('categories', c.id, c);
              }
            }

            if (fbBanners && fbBanners.length > 0) {
              setBanners(fbBanners);
            } else {
              for (const b of defaultBanners) {
                await syncDocToFirestore('banners', b.id, b);
              }
            }

            if (fbPages && fbPages.length > 0) {
              setPages(fbPages);
            } else {
              for (const pg of defaultPages) {
                await syncDocToFirestore('pages', pg.id, pg);
              }
            }

            if (fbEnquiries && fbEnquiries.length > 0) {
              setEnquiries(fbEnquiries);
            } else {
              for (const e of defaultEnquiries) {
                await syncDocToFirestore('enquiries', e.id, e);
              }
            }

            if (fbBranding) setBranding(fbBranding);
            if (fbTheme) setTheme(fbTheme);

            // Subscribe to real-time incoming enquiries from Firestore
            subscribeCollectionFromFirestore<CustomerEnquiry>('enquiries', (liveEnquiries) => {
              if (liveEnquiries && liveEnquiries.length > 0) {
                setEnquiries(liveEnquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
              }
            });

          } catch (cloudErr) {
            console.warn('[Firebase] Firestore initial fetch notice:', cloudErr);
          }
        }
      } else {
        if (isMounted) {
          setIsFirebaseConnected(false);
          setFirebaseStatusMessage('Firebase credentials standby. Provide VITE_FIREBASE_ keys in .env to connect.');
        }
      }
    };

    initFirebase();
    return () => { isMounted = false; };
  }, []);

  // Sync to local storage
  useEffect(() => { saveStored('branding', branding); }, [branding]);
  useEffect(() => { saveStored('theme', theme); }, [theme]);
  useEffect(() => { saveStored('header', header); }, [header]);
  useEffect(() => { saveStored('footer', footer); }, [footer]);
  useEffect(() => { saveStored('products', products); }, [products]);
  useEffect(() => { saveStored('categories', categories); }, [categories]);
  useEffect(() => { saveStored('banners', banners); }, [banners]);
  useEffect(() => { saveStored('pages', pages); }, [pages]);
  useEffect(() => { saveStored('visualSections', visualSections); }, [visualSections]);
  useEffect(() => { saveStored('testimonials', testimonials); }, [testimonials]);
  useEffect(() => { saveStored('enquiries', enquiries); }, [enquiries]);
  useEffect(() => { saveStored('seo', seo); }, [seo]);
  useEffect(() => { saveStored('contact', contact); }, [contact]);
  useEffect(() => { saveStored('settings', settings); }, [settings]);
  useEffect(() => { saveStored('adminUser', adminUser); }, [adminUser]);

  // Apply theme styling dynamically to CSS variables & root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-bg', theme.backgroundColor);
    root.style.setProperty('--color-text', theme.textColor);
    
    // Font family mapping
    if (theme.fontFamily === 'Cinzel') {
      root.style.fontFamily = "'Cinzel', serif";
    } else if (theme.fontFamily === 'Playfair Display') {
      root.style.fontFamily = "'Playfair Display', serif";
    } else if (theme.fontFamily === 'Manrope') {
      root.style.fontFamily = "'Manrope', sans-serif";
    } else if (theme.fontFamily === 'Plus Jakarta Sans') {
      root.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    } else {
      root.style.fontFamily = "'Inter', sans-serif";
    }
  }, [theme]);

  // Updaters with direct Firestore live sync
  const updateBranding = (newBranding: Partial<BrandingSettings>) => {
    const updated = { ...branding, ...newBranding };
    setBranding(updated);
    setHasUnsavedChanges(true);
    syncDocToFirestore('settings', 'branding', updated);
  };

  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    const updated = { ...theme, ...newTheme };
    setTheme(updated);
    setHasUnsavedChanges(true);
    syncDocToFirestore('settings', 'theme', updated);
  };

  const updateHeader = (newHeader: Partial<HeaderSettings>) => {
    const updated = { ...header, ...newHeader };
    setHeader(updated);
    setHasUnsavedChanges(true);
    syncDocToFirestore('settings', 'header', updated);
  };

  const updateFooter = (newFooter: Partial<FooterSettings>) => {
    const updated = { ...footer, ...newFooter };
    setFooter(updated);
    setHasUnsavedChanges(true);
    syncDocToFirestore('settings', 'footer', updated);
  };

  // Product management with live Firestore sync
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = 'prod-' + Date.now();
    const newProduct: Product = { ...productData, id: newId };
    setProducts(prev => [newProduct, ...prev]);
    setHasUnsavedChanges(true);
    syncDocToFirestore('products', newId, newProduct);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...productData };
        syncDocToFirestore('products', id, merged);
        return merged;
      }
      return p;
    }));
    setHasUnsavedChanges(true);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setHasUnsavedChanges(true);
    deleteDocFromFirestore('products', id);
  };

  const toggleProductActive = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, isActive: !p.isActive };
        syncDocToFirestore('products', id, updated);
        return updated;
      }
      return p;
    }));
    setHasUnsavedChanges(true);
  };

  // Categories
  const addCategory = (catData: Omit<ProductCategory, 'id'>) => {
    const newId = 'cat-' + Date.now();
    const newCategory: ProductCategory = { ...catData, id: newId };
    setCategories(prev => [...prev, newCategory]);
    setHasUnsavedChanges(true);
    syncDocToFirestore('categories', newId, newCategory);
  };

  const updateCategory = (id: string, catData: Partial<ProductCategory>) => {
    setCategories(prev => prev.map(c => {
      if (c.id === id) {
        const merged = { ...c, ...catData };
        syncDocToFirestore('categories', id, merged);
        return merged;
      }
      return c;
    }));
    setHasUnsavedChanges(true);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setHasUnsavedChanges(true);
    deleteDocFromFirestore('categories', id);
  };

  // Banners
  const addBanner = (bannerData: Omit<Banner, 'id'>) => {
    const newId = 'banner-' + Date.now();
    const newBanner: Banner = { ...bannerData, id: newId };
    setBanners(prev => [...prev, newBanner]);
    setHasUnsavedChanges(true);
    syncDocToFirestore('banners', newId, newBanner);
  };

  const updateBanner = (id: string, bannerData: Partial<Banner>) => {
    setBanners(prev => prev.map(b => {
      if (b.id === id) {
        const merged = { ...b, ...bannerData };
        syncDocToFirestore('banners', id, merged);
        return merged;
      }
      return b;
    }));
    setHasUnsavedChanges(true);
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    setHasUnsavedChanges(true);
    deleteDocFromFirestore('banners', id);
  };

  const toggleBannerActive = (id: string) => {
    setBanners(prev => prev.map(b => {
      if (b.id === id) {
        const updated = { ...b, isActive: !b.isActive };
        syncDocToFirestore('banners', id, updated);
        return updated;
      }
      return b;
    }));
    setHasUnsavedChanges(true);
  };

  // Pages
  const updatePage = (id: string, pageData: Partial<PageContent>) => {
    setPages(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...pageData, lastUpdated: new Date().toISOString().split('T')[0] };
        syncDocToFirestore('pages', id, merged);
        return merged;
      }
      return p;
    }));
    setHasUnsavedChanges(true);
  };

  const addPage = (pageData: Omit<PageContent, 'id' | 'isSystemPage' | 'lastUpdated'>) => {
    const newId = 'page-' + Date.now();
    const newPage: PageContent = {
      ...pageData,
      id: newId,
      isSystemPage: false,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setPages(prev => [...prev, newPage]);
    setHasUnsavedChanges(true);
    syncDocToFirestore('pages', newId, newPage);
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id || p.isSystemPage));
    setHasUnsavedChanges(true);
    deleteDocFromFirestore('pages', id);
  };

  // Visual Editor
  const updateVisualSection = (id: string, sectionData: Partial<VisualSection>) => {
    const updated = visualSections.map(s => s.id === id ? { ...s, ...sectionData } : s);
    setVisualSections(updated);
    setHasUnsavedChanges(true);
    syncDocToFirestore('settings', 'visualSections', { sections: updated });
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const sorted = [...visualSections].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(s => s.id === id);
    if (index === -1) return;
    if (direction === 'up' && index > 0) {
      const prevOrder = sorted[index - 1].order;
      sorted[index - 1].order = sorted[index].order;
      sorted[index].order = prevOrder;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const nextOrder = sorted[index + 1].order;
      sorted[index + 1].order = sorted[index].order;
      sorted[index].order = nextOrder;
    }
    setVisualSections([...sorted]);
    setHasUnsavedChanges(true);
    syncDocToFirestore('settings', 'visualSections', { sections: sorted });
  };

  const toggleSectionVisibility = (id: string) => {
    const updated = visualSections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s);
    setVisualSections(updated);
    setHasUnsavedChanges(true);
    syncDocToFirestore('settings', 'visualSections', { sections: updated });
  };

  // Testimonials / Client Stories
  const addTestimonial = (item: Omit<TestimonialItem, 'id'>) => {
    const newItem: TestimonialItem = {
      ...item,
      id: 'testi-' + Date.now(),
    };
    setTestimonials(prev => [...prev, newItem]);
    setHasUnsavedChanges(true);
    syncDocToFirestore('testimonials', newItem.id, newItem);
  };

  const updateTestimonial = (id: string, item: Partial<TestimonialItem>) => {
    setTestimonials(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...item };
        syncDocToFirestore('testimonials', id, updated);
        return updated;
      }
      return t;
    }));
    setHasUnsavedChanges(true);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    setHasUnsavedChanges(true);
    deleteDocFromFirestore('testimonials', id);
  };

  // Enquiries (Saves to Firestore and updates state)
  const submitEnquiry = async (enquiryData: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    try {
      const newId = 'enq-' + Date.now();
      const newEnquiry: CustomerEnquiry = {
        ...enquiryData,
        id: newId,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      setEnquiries(prev => [newEnquiry, ...prev]);
      
      // Save directly to Firestore collection
      await syncDocToFirestore('enquiries', newId, newEnquiry);

      // Auto-Forward to Google Sheet Webhook if enabled
      if (settings.enableGoogleSheetSync && settings.googleSheetWebhookUrl) {
        try {
          fetch(settings.googleSheetWebhookUrl.trim(), {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: newId,
              timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
              fullName: newEnquiry.fullName,
              phone: newEnquiry.phone,
              email: newEnquiry.email,
              city: newEnquiry.city || 'N/A',
              productName: newEnquiry.productName || 'General Financial Inquiry',
              requestedAmount: newEnquiry.requestedAmount || 0,
              tenureMonths: newEnquiry.tenureMonths || 0,
              employmentType: newEnquiry.employmentType || 'N/A',
              monthlyIncome: newEnquiry.monthlyIncome || 0,
              notes: newEnquiry.adminNotes || '',
              status: 'New'
            })
          }).catch(syncErr => console.warn('[Google Sheet Sync] Background sync warning:', syncErr));
        } catch (postErr) {
          console.warn('[Google Sheet Sync] Trigger failed:', postErr);
        }
      }

      return true;
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      return false;
    }
  };

  const testGoogleSheetWebhook = async (url: string): Promise<{ success: boolean; message: string }> => {
    if (!url || !url.trim().startsWith('https://script.google.com/macros/s/')) {
      return { 
        success: false, 
        message: 'Invalid Web App URL. The URL must start with: https://script.google.com/macros/s/...' 
      };
    }

    try {
      await fetch(url.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'TEST-' + Math.floor(100000 + Math.random() * 900000),
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          fullName: 'Test Borrower (Blue Wien Verification)',
          phone: '+91 98765 43210',
          email: 'test@bluewien.com',
          city: 'Mumbai',
          productName: 'Corporate Term Loan (Test Lead)',
          requestedAmount: 2500000,
          tenureMonths: 36,
          employmentType: 'Salaried',
          monthlyIncome: 150000,
          notes: 'Automatic test entry dispatched from Blue Wien Website Builder.',
          status: 'New'
        })
      });
      return { 
        success: true, 
        message: 'Test row successfully dispatched to your Google Sheet! Please check your Google Sheet.' 
      };
    } catch (err: any) {
      return { 
        success: false, 
        message: err?.message || 'Failed to dispatch test row to Google Sheet.' 
      };
    }
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus, notes?: string) => {
    setEnquiries(prev => prev.map(e => {
      if (e.id === id) {
        const updated = {
          ...e,
          status,
          ...(notes !== undefined ? { adminNotes: notes } : {})
        };
        syncDocToFirestore('enquiries', id, updated);
        return updated;
      }
      return e;
    }));
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
    deleteDocFromFirestore('enquiries', id);
  };

  const updateSEO = (newSEO: Partial<SEOSettings>) => {
    const updated = { ...seo, ...newSEO };
    setSeo(updated);
    setHasUnsavedChanges(true);
    syncDocToFirestore('settings', 'seo', updated);
  };

  const updateContact = (newContact: Partial<ContactSettings>) => {
    const updated = { ...contact, ...newContact };
    setContact(updated);
    setHasUnsavedChanges(true);
    syncDocToFirestore('settings', 'contact', updated);
  };

  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    setHasUnsavedChanges(true);
    syncDocToFirestore('settings', 'general', updated);
  };

  // Modals & Navigation
  const openProductDetail = (productId: string) => {
    setSelectedProductIdForDetail(productId);
  };

  const closeProductDetail = () => {
    setSelectedProductIdForDetail(null);
  };

  const openApplyModal = (product?: Product) => {
    setPreselectedProductForApply(product || null);
    setIsApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
    setPreselectedProductForApply(null);
  };

  // Auth - Mandatory Firebase Authentication with no bypass
  const loginAdmin = async (email: string, password?: string): Promise<boolean> => {
    if (!email || !email.trim()) {
      throw new Error('Please enter your administrator email address.');
    }
    if (!password || !password.trim()) {
      throw new Error('Please enter your password.');
    }

    const authInstance = getFirebaseAuth();
    if (authInstance && isFirebaseConfigured()) {
      try {
        const userCredential = await signInWithEmailAndPassword(authInstance, email.trim(), password);
        const user = userCredential.user;
        const admin: AdminUser = {
          uid: user.uid,
          email: user.email || email.trim(),
          displayName: user.displayName || user.email?.split('@')[0] || 'Administrator',
          role: 'Super Administrator'
        };
        setAdminUser(admin);
        return true;
      } catch (err: any) {
        console.error('Firebase Auth error:', err);
        let errorMsg = 'Authentication failed. Please verify your credentials.';
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          errorMsg = 'Incorrect password or email. Please check your credentials in Firebase Auth.';
        } else if (err.code === 'auth/user-not-found') {
          errorMsg = 'No administrator account found with this email in Firebase Authentication.';
        } else if (err.code === 'auth/too-many-requests') {
          errorMsg = 'Access temporarily disabled due to multiple failed login attempts. Please try again later.';
        } else if (err.code === 'auth/network-request-failed') {
          errorMsg = 'Network error: Unable to connect to Firebase. Please check your internet connection.';
        } else if (err.message) {
          errorMsg = err.message;
        }
        throw new Error(errorMsg);
      }
    } else {
      throw new Error('Firebase Authentication is not configured or in standby mode. Please ensure your VITE_FIREBASE_ keys are provided in .env and an admin user is created in Firebase Console.');
    }
  };

  const logoutAdmin = async () => {
    const authInstance = getFirebaseAuth();
    if (authInstance) {
      try {
        await signOut(authInstance);
      } catch (err) {
        console.warn('Firebase sign out error:', err);
      }
    }
    setAdminUser(null);
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'adminUser');
    setActiveView('public');
  };

  // Export & Import
  const exportAllDataAsJSON = (): string => {
    const fullBackup = {
      branding,
      theme,
      header,
      footer,
      products,
      categories,
      banners,
      pages,
      visualSections,
      testimonials,
      enquiries,
      seo,
      contact,
      settings,
      exportedAt: new Date().toISOString(),
      builderVersion: '1.0.0-bluewien'
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importDataFromJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.branding) setBranding(data.branding);
      if (data.theme) setTheme(data.theme);
      if (data.header) setHeader(data.header);
      if (data.footer) setFooter(data.footer);
      if (data.products) setProducts(data.products);
      if (data.categories) setCategories(data.categories);
      if (data.banners) setBanners(data.banners);
      if (data.pages) setPages(data.pages);
      if (data.visualSections) setVisualSections(data.visualSections);
      if (data.testimonials) setTestimonials(data.testimonials);
      if (data.seo) setSeo(data.seo);
      if (data.contact) setContact(data.contact);
      if (data.settings) setSettings(data.settings);
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to restore all website content, themes, and branding to initial defaults? Any unsaved edits will be lost.')) {
      setBranding(defaultBranding);
      setTheme(defaultTheme);
      setHeader(defaultHeader);
      setFooter(defaultFooter);
      setProducts(defaultProducts);
      setCategories(defaultCategories);
      setBanners(defaultBanners);
      setPages(defaultPages);
      setVisualSections(defaultVisualSections);
      setTestimonials(defaultTestimonials);
      setEnquiries(defaultEnquiries);
      setSeo(defaultSEO);
      setContact(defaultContact);
      setSettings(defaultSettings);
      localStorage.clear();
      setHasUnsavedChanges(false);
    }
  };

  return (
    <BuilderContext.Provider
      value={{
        branding,
        theme,
        header,
        footer,
        products,
        categories,
        banners,
        pages,
        visualSections,
        testimonials,
        enquiries,
        seo,
        contact,
        settings,
        adminUser,
        activeView,
        activeAdminTab,
        activePublicPage,
        previewDevice,
        selectedProductIdForDetail,
        isApplyModalOpen,
        preselectedProductForApply,
        isFirebaseConnected,
        firebaseStatusMessage,
        hasUnsavedChanges,
        
        updateBranding,
        updateTheme,
        updateHeader,
        updateFooter,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerActive,
        updatePage,
        addPage,
        deletePage,
        updateVisualSection,
        moveSection,
        toggleSectionVisibility,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        submitEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        updateSEO,
        updateContact,
        updateSettings,
        setActiveView,
        setActiveAdminTab,
        setActivePublicPage,
        setPreviewDevice,
        openProductDetail,
        closeProductDetail,
        openApplyModal,
        closeApplyModal,
        loginAdmin,
        logoutAdmin,
        testGoogleSheetWebhook,
        exportAllDataAsJSON,
        importDataFromJSON,
        resetToDefaults
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = (): BuilderContextType => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};
