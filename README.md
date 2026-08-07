# Free Invoice Generator 📄✨

> **100% Client-Side, Serverless & Private Invoice Builder** for freelancers, agencies, contractors, and small businesses. Create, manage, and export professional PDF invoices directly in your browser with complete data privacy.

[![Live Demo](https://img.shields.io/badge/Live_Demo-freeinvoice.live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://www.freeinvoice.live)
[![Built with Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 🌐 Live Application

- **Official Live Domain:** [https://www.freeinvoice.live/](https://www.freeinvoice.live/)
- **Vercel Production Mirror:** [https://free-invoice-generator-red.vercel.app](https://free-invoice-generator-red.vercel.app)

---

## ✨ Features

- 🔒 **100% Private & Client-Side:** No sign-up required, no backend servers. All your business profiles, client records, and invoice histories remain safely stored in your browser's local storage (IndexedDB).
- 🎨 **Multiple Professional Templates:** Switch seamlessly between Modern, Classic, Minimal, Compact, and Bold PDF invoice layouts.
- 👥 **Client Management Directory:** Save recurring client details for 1-click invoice auto-fill.
- 📦 **Item & Service Library:** Pre-save standard line items, unit pricing, and default taxes to build invoices in seconds.
- 📊 **Saved Invoices & Status Tracking:** Track unpaid, paid, and overdue invoices with clean visual filters.
- 🌍 **Internationalization & Multi-Currency:** Customize currency symbols, tax rules, payment terms, and select from multiple app languages.
- 💾 **Data Backup & Restore:** Export your full application state as a single JSON file and restore it on any device anytime.
- 🖨️ **High-Resolution PDF Export:** One-click PDF download optimized for clean printing without UI elements.
- ☕ **Independent Developer Support:** Integrated Ko-fi widget and interactive Google Form feedback section.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [TailwindCSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **Storage:** Browser LocalStorage & IndexedDB
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm** or **bun**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nikking18/free-invoice-generator.git
   cd free-invoice-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📂 Project Structure

```text
free-invoice-generator/
├── app/
│   ├── globals.css         # Design system tokens & global utility styles
│   ├── layout.tsx          # Root layout & dark mode script initialization
│   └── page.tsx            # Main application tab views & layout
├── components/
│   ├── templates/          # PDF invoice templates (Classic, Modern, Bold, etc.)
│   ├── BackupRestore.tsx   # Data import/export & system wipe modal
│   ├── BusinessSettings.tsx# Business profile management
│   ├── ClientManagement.tsx# Client directory table & form
│   ├── FeedbackWidget.tsx  # Floating user feedback form widget
│   ├── Header.tsx          # App header bar, navigation tabs & language selector
│   ├── InvoiceBuilder.tsx  # Interactive live invoice builder & previewer
│   ├── ItemLibrary.tsx     # Reusable items & pricing presets
│   ├── KofiWidgets.tsx     # Ko-fi support banner & floating chat widget
│   ├── PrivacyBanner.tsx   # Privacy disclosure modal
│   └── SavedInvoices.tsx   # Invoice history dashboard
├── lib/
│   ├── db.ts               # IndexedDB database manager
│   ├── storage.ts          # LocalStorage helper functions
│   ├── pdf.ts              # PDF generation & download handlers
│   └── types.ts            # TypeScript interfaces & types
└── public/                 # Static branding assets
```

---

## ☕ Support & Feedback

If you find this tool helpful, consider supporting independent open-source development:

- ☕ **Buy me a coffee:** [Support on Ko-fi](https://ko-fi.com/Y0H123WFGA)
- 💬 **Share Suggestions:** [Submit Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLScUP7c8Av1NXwCB5oKcO51P0cdisGfSnpc8kVa6osjpa37jZQ/viewform?usp=header)

---

## 👨‍💻 Author

Created with ❤️ by **Nikhil Khanpara**

- **GitHub:** [@Nikking18](https://github.com/Nikking18)
- **LinkedIn:** [Nikhil Khanpara](https://www.linkedin.com/in/nikhilkhanpara/)
- **Twitter / X:** [@nikhilkhanpara](https://x.com/nikhilkhanpara)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
