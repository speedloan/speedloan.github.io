# BLUE WIEN WEBSITE BUILDER & FINANCIAL SERVICES PORTAL

A professional, fully functional **No-Code White Label Website Builder and Management Software** architected for financial institutions, private lenders, and corporate advisory firms.

---

## 🌟 Key Application Architecture

The system is logically partitioned into two distinct environments:

### 1. Visual Admin Panel (16 Navigation Modules)
1. **Dashboard:** Real-time KPI counters (active loans, inquiries, requested pipeline capital, system health).
2. **Website Branding:** Customize Company Name, Tagline, Brand Narrative, Copyright, and White Label Mode.
3. **Logo Management:** Manage primary logos, dark/inverted logos, mobile logos, favicons, and display height scaling (24px to 80px).
4. **Theme & Colors:** Royal Blue, Navy Blue, White, and Subtle Gold palettes, typography selection (`Plus Jakarta Sans`, `Inter`, `Manrope`, `Cinzel`, `Playfair Display`), button geometries (Rounded, Pill, Sharp, Glass, Shadow), and corner radius.
5. **Header Management:** Corporate TopBar, Modern Floating Glass, Classic, or Minimal styles, announcement ribbons, navigation links editor, and header CTAs.
6. **Footer Management:** 4-column link manager, statutory financial disclaimers, APR disclosures, social footprints, and newsletter subscription widgets.
7. **Product Management:** Complete CRUD system to create, edit, delete, publish, and unpublish financial loans. Supports product name, category, short & detailed prospectus, key features list, eligibility criteria, required documents, loan sanction range, interest rates, tenure, and apply button settings.
8. **Product Categories:** Group lending facilities into Commercial, Mortgage, Working Capital, Personal, Equipment, or custom taxonomies with custom slugs and sort order.
9. **Banner Management:** Create desktop and mobile hero carousel slides, customize dark overlays, badges, and primary/secondary CTAs.
10. **Page Management:** Manage 8 standard pages (`Home`, `About Us`, `Services`, `Financial Products`, `Contact Us`, `FAQ`, `Privacy Policy`, `Terms and Conditions`) plus unlimited custom pages with rich markdown content and SEO tags.
11. **Visual Website Editor:** Drag-and-drop / move-up-and-down visual section order, toggle section visibility on/off, customize section titles, descriptions, badges, background colors, and spacing.
12. **Live Preview:** Interactive responsive viewport simulation (Desktop, Tablet 768px, Mobile 390px) with real-time updates.
13. **Customer Enquiries:** Live lead pipeline (`New`, `Contacted`, `In Review`, `Approved`, `Rejected`), borrower details, requested loan figures, internal credit underwriting notes, and CSV export.
14. **SEO Settings:** Site Title tag, Meta Description, Keywords, Canonical URLs, OpenGraph share card preview, Google Analytics ID, and JSON-LD structured data.
15. **Contact Settings:** Primary phone, toll-free number, WhatsApp support, support email, physical headquarters, operating hours, Google Maps embed, and regional branch office directory.
16. **Website Settings:** Site status (`Live` or `Maintenance`), currency symbol selection (`$`, `€`, `£`, `₹`, `AED`, `CHF`, `S$`), GitHub Pages CI/CD workflow generator, full JSON data backup export & import, and reset to initial seed.

---

### 2. Public Output Website (Corporate Financial Portal)
- Dynamically driven by all published products, banners, pages, branding, and theme colors.
- **Interactive Loan Repayment (EMI) Calculator:** Real-time principal, tenure, and interest rate sliders with instant monthly installment calculations and amortization proportion breakdowns.
- **Filterable Product Catalog:** Instant category filtering, card views, and modal prospectus deep-dives.
- **Online Loan Application Portal:** Collects borrower requirements, contact details, and financial income, submitting real enquiries to the admin dashboard.
- **Dynamic Content Pages:** Detailed About Us, Services, FAQ, Privacy Policy, and Terms & Conditions.
- **Floating Operator Badge:** Allows authorized administrators to toggle seamlessly between public and administrative views.

---

## 🔒 Firebase Firestore & Authentication Setup

The project includes pre-configured database blueprints and security rules:
- `firebase-blueprint.json`: Data schema for branding, products, categories, banners, pages, and customer inquiries.
- `firestore.rules`: Attribute-Based Access Control (ABAC) with role-based access for `readyloans.in@gmail.com`, public read for published content, public create for validated inquiries, and strict administrator authorization for mutations.

### Connecting Firebase Credentials
To synchronize data with your Firebase Cloud project, set the following environment variables in `.env`:

```env
VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_PROJECT.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_PROJECT.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
VITE_FIREBASE_DATABASE_ID="(default)"
```

*Note: The application operates gracefully in offline/local storage mode when credentials are not yet supplied, allowing full evaluation and testing out-of-the-box.*

---

## 🚀 GitHub Pages Deployment Instructions

This repository is ready for automatic GitHub Pages continuous deployment:

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Blue Wien Website Builder"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

2. **Configure GitHub Pages Settings:**
   - In your GitHub Repository, navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.

3. **Automated CI/CD:**
   - The included workflow in `.github/workflows/deploy.yml` will automatically build the production package and deploy your portal to `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`.
   - The included `public/.nojekyll` file ensures single-page routing functions smoothly on GitHub Pages.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile and lint build verification
npm run build
```
