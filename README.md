# SMK Diponegoro 1 Jakarta - Official Website

[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.89.0-3ECF8E.svg)](https://supabase.com/)

A modern, responsive web application for SMK Diponegoro 1 Jakarta, built with React and Vite. This platform serves as the official website for the vocational school, providing information about programs, facilities, teachers, and school activities, along with an administrative panel for content management.

## 🌟 Features

### Public Features

- **Homepage**: Hero section with school branding, principal's welcome message, statistics, and featured programs
- **About Section**: Comprehensive information including profile, vision & mission, history, uniform, facilities, organizational structure, and teachers
- **Academic Programs**: Detailed information about TKJ (Computer & Network Engineering) and DKV (Visual Communication Design) majors
- **Articles & News**: Latest school news, student achievements, and educational content
- **Programs**: Information about outstanding programs and extracurricular activities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Lazy loading, code splitting, and optimized assets

### Administrative Features

- **Content Management**: Admin panel for managing articles, teachers, uniforms, facilities, and programs
- **Authentication**: Secure login system for administrators
- **CRUD Operations**: Create, read, update, and delete functionality for all content types
- **File Upload**: Image upload capabilities for articles and content
- **Protected Routes**: Secure access to admin-only sections

## 🛠️ Tech Stack

### Frontend

- **React 19.2.3** - Modern JavaScript library for building user interfaces
- **Vite 7.2.4** - Fast build tool and development server
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **React Router DOM 7.11.0** - Declarative routing for React

### Animations & Interactions

- **GSAP 3.14.2** - High-performance JavaScript animation library
- **Framer Motion 12.24.10** - Production-ready motion library for React
- **AOS 2.3.4** - Animate on scroll library

### Backend & Database

- **Supabase 2.89.0** - Open source Firebase alternative for backend services

### Development Tools

- **ESLint 9.39.1** - JavaScript linting utility
- **Lucide React 0.562.0** - Beautiful & consistent icon toolkit
- **Recharts 3.6.0** - Composable charting library built on React components
- **HTML2PDF.js 0.12.1** - Client-side HTML-to-PDF conversion

### Build & Deployment

- **Vercel Analytics 1.6.1** - Real-time analytics for web applications
- **Vite Compression Plugin 0.5.1** - Compression plugin for Vite
- **JavaScript Obfuscator 5.1.0** - JavaScript obfuscator for production builds

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Supabase** account for backend services

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd web-dipo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add your Supabase configuration:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
web-dipo/
├── public/                    # Static assets
│   ├── logo yayasan al-hidayah-02.png
│   └── vite.png
├── src/
│   ├── assets/               # Images and media files
│   ├── components/           # Reusable React components
│   │   ├── Layout.jsx        # Main layout wrapper
│   │   ├── Navbar.jsx        # Navigation component
│   │   ├── Footer.jsx        # Footer component
│   │   ├── Mobilemenu.jsx    # Mobile navigation
│   │   └── ...
│   ├── data/                 # Static data and configurations
│   ├── lib/                  # Utility libraries
│   │   └── supabase.js       # Supabase client configuration
│   ├── pages/                # Page components
│   │   ├── Home.jsx          # Homepage
│   │   ├── Login.jsx         # Admin login page
│   │   ├── admin/            # Admin panel pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageArtikel.jsx
│   │   │   └── ...
│   │   ├── tentang/          # About section pages
│   │   │   ├── Overview.jsx
│   │   │   ├── Profil.jsx
│   │   │   └── ...
│   │   ├── Jurusan/          # Major programs pages
│   │   │   ├── TKJ.jsx
│   │   │   └── DKV.jsx
│   │   └── ...
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── package.json              # Project dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── eslint.config.js          # ESLint configuration
└── README.md                 # Project documentation
```

## 🎯 Usage

### For Visitors

- Browse school information, programs, and latest news
- Learn about TKJ and DKV majors
- Access contact information and registration details
- View school facilities and teacher profiles

### For Administrators

1. Access the admin panel at `/admin`
2. Log in with administrator credentials
3. Manage content through the dashboard:
   - Add/edit/delete articles and news
   - Update teacher information
   - Manage facility details
   - Configure program information
   - Upload and manage images

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

This application is configured for deployment on Vercel with the following optimizations:

- **Compression**: Static assets are compressed for faster loading
- **Analytics**: Integrated with Vercel Analytics for performance monitoring
- **Obfuscation**: JavaScript code is obfuscated in production builds
- **Environment Variables**: Secure configuration through environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for SMK Diponegoro 1 Jakarta.

## 📞 Contact

For questions or support, please contact the school administration.

---

**SMK Diponegoro 1 Jakarta** - Building Future Leaders Through Vocational Excellence
