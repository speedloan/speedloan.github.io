export type HeaderStyle = 'classic' | 'floating' | 'minimal' | 'corporate' | 'topbar';
export type FooterStyle = 'corporate_4col' | 'modern_grid' | 'minimal';
export type ButtonDesign = 'rounded' | 'pill' | 'sharp' | 'glass' | 'shadow';
export type BorderRadiusSize = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type EnquiryStatus = 'New' | 'Contacted' | 'In Review' | 'Approved' | 'Rejected';

export interface NavLinkItem {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface SocialLinkItem {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'whatsapp';
  url: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: { label: string; url: string }[];
}

export interface BrandingSettings {
  companyName: string;
  tagline: string;
  brandStory: string;
  copyrightText: string;
  logoUrl: string;
  darkLogoUrl: string;
  mobileLogoUrl: string;
  logoHeight: number;
  logoMaxWidth?: number;
  showCompanyNameBesideLogo?: boolean;
  faviconUrl: string;
}

export interface ThemeSettings {
  primaryColor: string; // Royal Blue e.g. #1d4ed8
  secondaryColor: string; // Navy Blue e.g. #0f172a
  accentColor: string; // Subtle Gold e.g. #f59e0b
  backgroundColor: string; // #f8fafc or #ffffff
  textColor: string;
  fontFamily: 'Inter' | 'Plus Jakarta Sans' | 'Manrope' | 'Cinzel' | 'Playfair Display';
  headingFontSize: 'normal' | 'large' | 'xlarge';
  bodyFontSize: 'small' | 'normal' | 'medium';
  buttonDesign: ButtonDesign;
  borderRadius: BorderRadiusSize;
  headerStyle: HeaderStyle;
  footerStyle: FooterStyle;
}

export interface HeaderSettings {
  headerStyle: HeaderStyle;
  isSticky: boolean;
  showAnnouncement: boolean;
  announcementText: string;
  announcementLink: string;
  navLinks: NavLinkItem[];
  ctaButtonText: string;
  ctaButtonLink: string;
  showPhoneNumber: boolean;
}

export interface FooterSettings {
  footerStyle: FooterStyle;
  copyrightText: string;
  disclaimerText: string;
  columns: FooterColumn[];
  socialLinks: SocialLinkItem[];
  showNewsletter: boolean;
}

export interface ProductParagraph {
  id: string;
  heading?: string;
  text: string;
  imageUrl?: string;
  imageDescription?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  imageDescription?: string;
  shortDescription: string;
  detailedDescription: string;
  paragraphs?: ProductParagraph[];
  features: string[];
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  loanAmount: string; // e.g. "₹10,00,000 - ₹5,00,00,000"
  minAmount: number;
  maxAmount: number;
  interestRate: string; // e.g. "8.50% - 13.50% p.a."
  minRate: number;
  tenure: string; // e.g. "12 to 84 Months"
  processingFee: string;
  applyButtonText: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  displayOrder: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  desktopImage: string;
  mobileImage: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  overlayOpacity: number; // 0 to 1
  isActive: boolean;
  displayOrder: number;
}

export interface PageContent {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string; // rich markdown or HTML text
  sections?: { heading: string; body: string }[];
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  isSystemPage: boolean;
  lastUpdated: string;
}

export type SectionType = 
  | 'hero' 
  | 'stats' 
  | 'products' 
  | 'calculator' 
  | 'why_us' 
  | 'process' 
  | 'testimonials' 
  | 'faq' 
  | 'cta_banner';

export interface TestimonialItem {
  id: string;
  name: string;
  title: string;
  facility: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  isActive: boolean;
}

export interface VisualSection {
  id: string;
  type: SectionType;
  name: string;
  isVisible: boolean;
  order: number;
  title: string;
  subtitle: string;
  badge?: string;
  backgroundColor: string; // 'default' | 'navy' | 'light' | 'primary' | 'gold_tint'
  paddingY: 'compact' | 'normal' | 'relaxed';
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  imageDescription?: string;
  backgroundImageUrl?: string;
  paragraphs?: string[];
  contentData?: Record<string, any>;
}

export interface CustomerEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  productId?: string;
  productName?: string;
  requestedAmount?: number;
  tenureMonths?: number;
  employmentType?: 'Salaried' | 'Self-Employed' | 'Business Owner' | 'Professional';
  monthlyIncome?: number;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface SEOSettings {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  enableRobotsIndex: boolean;
  structuredDataEnabled: boolean;
}

export interface ContactSettings {
  phone: string;
  tollFree: string;
  email: string;
  whatsappNumber: string;
  address: string;
  operatingHours: string;
  googleMapsEmbedUrl: string;
  branchLocations: { name: string; address: string; phone: string }[];
}

export interface WebsiteSettings {
  siteStatus: 'live' | 'maintenance';
  whiteLabelMode: boolean;
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  enableCustomerLoanCalculator: boolean;
  enableInstantApplyModal: boolean;
  // Google Sheets & Forms Integration
  enableGoogleSheetSync?: boolean;
  googleSheetWebhookUrl?: string;
  googleSheetDirectUrl?: string;
  enableGoogleFormEmbed?: boolean;
  googleFormEmbedUrl?: string;
  googleFormButtonText?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'Super Administrator' | 'Editor';
  photoURL?: string;
}
