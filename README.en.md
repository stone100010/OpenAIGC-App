# OpenAIGC-App 🚀

> **Next-Generation AI Content Creation Platform** - An intelligent creation tool integrating image, audio, video, and text creation

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Project Overview

OpenAIGC-App is an AI content creation platform built on modern web technology stack, dedicated to providing professional, efficient, and intelligent creation experiences for users. The project adopts the **Glassmorphism design** concept and builds a complete **multimodal AI creation ecosystem**, covering four core functional modules: image generation, audio synthesis, video production, and text creation.

### 🎯 Core Design Philosophy

- **Multimodal Integration** - Unified content creation experience supporting four creation modes: image, audio, video, and text
- **Professional Templates** - Exclusive UI templates and interaction design for each content type
- **Intelligent User Experience** - Smart routing and personalized recommendations based on user behavior
- **Commercial Architecture** - Complete membership subscription system and user management
- **Responsive Design** - Mobile-first cross-platform adaptation solution

## 🏗 Project Architecture

### Technology Stack Selection

| Domain | Technology Choice | Reason for Choice |
|--------|------------------|-------------------|
| **Frontend Framework** | Next.js 14 (App Router) | SEO optimization, server-side rendering, performance optimization |
| **Development Language** | TypeScript | Type safety, development efficiency, code maintainability |
| **UI Framework** | Tailwind CSS | Atomic CSS, design system, rapid development |
| **Icon Library** | FontAwesome 6 | Rich icon resources, unified visual language |
| **Image Resources** | Unsplash API | High-quality image resources, dynamic loading |

### Directory Structure

```
open-aigc-app/
├── 📁 app/                        # Next.js 14 App Router
│   ├── 📁 profile/                # Personal Center Ecosystem
│   │   ├── 📁 settings/           # Account Settings (Personal info, Security, Preferences)
│   │   ├── 📁 history/            # Creation History (Work management, Search & filter)
│   │   ├── 📁 favorites/          # My Favorites (Batch management, Data statistics)
│   │   ├── 📁 privacy/            # Privacy & Permissions (Data security, Third-party authorization)
│   │   ├── 📁 offline/            # Offline Management (Storage monitoring, Download management)
│   │   └── page.tsx              # Personal Center Home
│   ├── 📁 tools/                  # AI Tools Navigation
│   ├── 📁 subscription/           # Membership Subscription System
│   ├── 📁 home/                   # Homepage (Waterfall layout)
│   ├── 📁 image-gen/              # Image Generation Tool
│   ├── 📁 audio-gen/              # Audio Generation Tool
│   ├── 📁 video-gen/              # Video Generation Tool
│   ├── 📁 image-detail/           # Image Detail Template (Blue theme)
│   ├── 📁 audio-detail/           # Audio Detail Template (Green theme)
│   ├── 📁 video-detail/           # Video Detail Template (Red theme)
│   ├── 📁 text-detail/            # Text Detail Template (Purple theme)
│   ├── layout.tsx                # Root Layout
│   └── page.tsx                  # Landing Page
├── 📁 components/                 # Component Library
│   ├── 📁 ui/                    # Basic UI Components
│   │   ├── GlassCard.tsx         # Glass Card Component
│   │   ├── TabBar.tsx            # Bottom Navigation Component
│   │   ├── StatusBar.tsx         # Status Bar Component
│   │   └── PhoneFrame.tsx        # Phone Frame Component
│   └── 📁 charts/                # Chart Components
├── 📁 public/                     # Static Resources
└── 📄 Configuration Files
```

## 🎨 Design System

### Visual Design Philosophy

**Glassmorphism (Glass拟态)**
- **Background Blur** - backdrop-blur-sm creates layered depth
- **Semi-transparent Effects** - bg-white/70 creates lightweight feel
- **Border Design** - border border-slate-200/50 refined borders
- **Shadow System** - hover:shadow-xl three-dimensional interactive feedback

### Color Theme System

| Content Type | Theme Color | Symbolic Meaning | Application Scenarios |
|--------------|-------------|------------------|----------------------|
| 🖼️ **Image** | Blue (#3B82F6) | Creativity, Professional | Image generation, gallery display |
| 🎵 **Audio** | Green (#10B981) | Nature, Harmony | Audio player, music production |
| 🎬 **Video** | Red (#EF4444) | Energy, Passion | Video player, film production |
| 📝 **Text** | Purple (#8B5CF6) | Wisdom, Thinking | Article reading, writing tools |

### Responsive Layout Strategy

```css
/* Mobile-first breakpoint system */
grid-cols-1        /* Mobile: Single column layout */
md:grid-cols-2     /* Tablet: Double column layout */  
lg:grid-cols-3     /* Desktop: Three column layout */
xl:grid-cols-4     /* Large screen: Four column layout */
```

## 🚀 Core Functional Modules

### 1. AI Creation Tool Suite

#### 🎨 Image Generation (`/image-gen`)
- **Text-to-Image** - AI-based text description generation technology
- **Style Selection** - 12 professional art styles (Realistic, Anime, Oil painting, etc.)
- **Parameter Control** - Quality selection, aspect ratio, generation parameters
- **Inspiration Gallery** - Curated work examples to inspire creativity

#### 🎵 Audio Synthesis (`/audio-gen`)
- **Text-to-Speech** - Multi-language speech synthesis technology
- **Music Generation** - AI-assisted background music creation
- **Sound Effects** - Professional-grade audio effect processing
- **Format Support** - Multiple audio format export

#### 🎬 Video Generation (`/video-gen`)
- **Text-to-Video** - Dynamic video one-click generation
- **Image Animation** - Static image dynamic processing
- **Effect Processing** - Rich visual effect library
- **Editing Tools** - Basic video editing functionality

#### 📝 Text Creation (`/text-gen`)
- **Smart Writing** - AI-assisted copywriting
- **Multi-type Support** - Advertising copy, novel creation, content planning
- **Style Optimization** - Multiple writing style templates
- **Collaborative Editing** - Real-time collaborative editing features

### 2. User Center Ecosystem

#### 👤 Account Settings (`/profile/settings`)
- **Personal Information Management** - Avatar, nickname, bio, contact info
- **Security Settings** - Password change, two-factor authentication, login history
- **Preference Settings** - Language, theme, auto-save, etc.
- **Account Management** - Data export, account deletion

#### 📚 Creation History (`/profile/history`)
- **Work Management** - Unified management of all platform creation content
- **Smart Search** - Support for title, description, and tag search
- **Category Filtering** - Filter by content type, time, and popularity
- **Batch Operations** - Batch management, sharing, and deletion features

#### ❤️ My Favorites (`/profile/favorites`)
- **Favorite Management** - Centralized management of favorite works
- **Batch Selection** - Support for multi-select batch operations
- **Category Organization** - Automatic categorization by type
- **Sharing Features** - One-click sharing to social platforms

#### 🔒 Privacy & Permissions (`/profile/privacy`)
- **Visibility Control** - Public/Friends/Private three-level visibility
- **Data Permissions** - Fine-grained data usage permission management
- **Third-party Authorization** - App authorization and revocation management
- **Data Export** - Complete data export functionality

#### 📱 Offline Management (`/profile/offline`)
- **Storage Monitoring** - Real-time storage space usage monitoring
- **Offline Caching** - Work offline caching management
- **Sync Settings** - Auto-sync and download configuration
- **Cleanup Tools** - Cache cleanup and space management

### 3. Membership Subscription System

#### 💎 Membership Level Design

| Level | Price | Monthly Quota | Core Privileges |
|-------|-------|---------------|-----------------|
| **Free** | ¥0/Permanent | 3 generations/day | Standard export, watermark, basic templates |
| **Personal Creator** | ¥19/Month | 200 generations | HD export, no watermark, priority queue, API trial |
| **Professional Creator** | ¥49/Month | 800 generations | 4K HD, batch processing, API access, dedicated support |
| **Enterprise Creator** | ¥199/Month | 3000 generations | Customized services, enterprise-level support, advanced features |

#### 🎯 Business Model Highlights
- **Usage-based Billing** - Flexible billing based on actual usage
- **Tiered Services** - Complete service chain from free trial to enterprise
- **Value-oriented** - Corresponding services based on creation needs and scale
- **Sustainability** - Reasonable pricing considering AI computing costs

### 4. Homepage Waterfall System

#### 📱 Content-driven Layout
- **Dynamic Grid** - Smart waterfall algorithm, adaptive arrangement for different height content
- **Infinite Scroll** - Lazy loading mechanism for optimized performance
- **Content Aggregation** - Unified display of four content types
- **Smart Sorting** - Personalized recommendations based on user behavior

#### 🔄 Interactive Experience Design
- **Hover Effects** - Card hover and zoom animations
- **Quick Preview** - Hover display of key information
- **One-click Operations** - Favorite, share, download quick access
- **Smart Routing** - Automatic routing to corresponding detail pages based on content type

## 🛠 Development Guide

### Environment Requirements
- Node.js 18+ 
- npm 8+ or yarn 1.22+
- Modern browser support

### Quick Start

```bash
# Clone the project
git clone https://gitee.com/sun_qiikai/open-aigc-app.git
cd open-aigc-app

# Install dependencies
npm install

# Start development server
npm run dev

# Access the application
open http://localhost:3000
```

### Build & Deploy

```bash
# Build production version
npm run build

# Start production server
npm start

# Deploy with Docker
docker build -t openaigc-app .
docker run -p 3000:3000 openaigc-app
```

### Development Standards

#### Component Development Standards
```typescript
// Component naming: PascalCase
// File naming: PascalCase.tsx
// Props interface: ComponentNameProps

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  rounded?: 'xl' | '2xl' | '3xl';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}
```

#### Style Development Standards
```css
/* Use Tailwind CSS atomic classes */
<div className="glass rounded-3xl p-8 hover:shadow-xl transition-all duration-300">

/* Custom component styles */
.glass {
  @apply bg-white/70 backdrop-blur-sm border border-slate-200/50;
}
```

## 📊 Performance Optimization

### Next.js Optimization Features
- **Automatic Code Splitting** - Automatic JavaScript bundle splitting by page
- **Image Optimization** - Next.js Image component automatic optimization
- **Static Generation** - SSG support for faster first-screen loading
- **Server-Side Rendering** - SSR for SEO and initial loading performance

### User Experience Optimization
- **Skeleton Screens** - Loading state placeholders
- **Lazy Loading** - On-demand loading of images and components
- **Caching Strategy** - Smart caching for improved response speed
- **Preloading** - Preloading of critical resources

## 🔧 Technical Implementation Highlights

### Smart Routing System
```typescript
// Smart routing based on content type
const getDetailRoute = (type: string, id: string) => {
  const routes = {
    image: `/image-detail/${id}`,
    audio: `/audio-detail/${id}`,
    video: `/video-detail/${id}`,
    text: `/text-detail/${id}`
  };
  return routes[type] || `/artwork-detail/${id}`;
};
```

### Glassmorphism Component
```typescript
const GlassCard = ({ children, className = '' }: GlassCardProps) => {
  return (
    <div className={`
      glass 
      rounded-3xl 
      p-8 
      card-hover 
      ${className}
    `}>
      {children}
    </div>
  );
};
```

### Responsive Design System
```css
/* Mobile-first responsive design */
.grid-responsive {
  @apply grid grid-cols-1;
  @apply md:grid-cols-2;
  @apply lg:grid-cols-3;
  @apply xl:grid-cols-4;
}
```

## 📈 Project Development History

### Version Evolution Record

| Version | Time | Core Updates | Key Features |
|---------|------|--------------|--------------|
| v1.0 | 2024-11 | **Project Launch** | Next.js framework, glassmorphism design, basic pages |
| v1.1 | 2024-11 | **Landing Page Optimization** | Staggered function card layout, redundant element removal |
| v1.2 | 2024-11 | **Homepage Refactoring** | Waterfall layout, four-type content aggregation, stats card removal |
| v1.3 | 2024-11 | **Template System** | Four content type professional templates, theme color system |
| v1.4 | 2024-11 | **Image Generation** | AI image tool, style selection, parameter control |
| v1.5 | 2024-11 | **Audio Generation** | AI audio tool, speech synthesis, music generation |
| v1.6 | 2024-11 | **Video Generation** | AI video tool, animation processing, effect system |
| v1.7 | 2024-11 | **Membership System** | Subscription model refactoring, usage-based billing, privilege system |
| v1.8 | 2024-11 | **User Center** | Complete user management ecosystem, 5 major functional modules |

### Future Development Plan

#### 🎯 Short-term Goals (v2.0)
- **AI Model Integration** - Integrate mainstream AI service APIs
- **User Authentication System** - OAuth login, JWT authentication
- **Payment System** - Integrate third-party payment platforms
- **Mobile Application** - React Native cross-platform application

#### 🚀 Medium-term Goals (v3.0)
- **AI Collaboration Features** - Multi-user real-time collaborative editing
- **Knowledge Base System** - User work cloud storage
- **Recommendation Algorithm** - AI-based personalized recommendations
- **API Open Platform** - Third-party developer ecosystem

#### 🌟 Long-term Vision (v4.0)
- **Metaverse Integration** - VR/AR creation tools
- **Blockchain Copyright** - NFT work certification system
- **Global Deployment** - Multi-region CDN acceleration
- **Enterprise Solutions** - Customized enterprise services

## 🤝 Contributing Guide

We welcome all forms of contribution!

### Ways to Contribute
- 🐛 **Bug Reports** - Report issues through GitHub Issues
- 💡 **Feature Suggestions** - Propose new feature ideas
- 📝 **Documentation Improvements** - Enhance project documentation
- 🔧 **Code Contributions** - Submit Pull Requests

### Development Workflow
1. Fork the project repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2024 OpenAIGC-App

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👥 Team

- **Development Team**: [Sun Qiikai](https://gitee.com/sun_qiikai) - Full Stack Developer
- **Design Philosophy**: Modern AI content creation experience
- **Contact**: Welcome to contact us through GitHub Issues

## 🙏 Acknowledgments

Thanks to the following open source projects and services:

- [Next.js](https://nextjs.org/) - React full-stack framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [FontAwesome](https://fontawesome.com/) - Icon library
- [Unsplash](https://unsplash.com/) - High-quality images
- [Vercel](https://vercel.com/) - Deployment platform

---

<div align="center">

**🚀 Making AI Creation Accessible - OpenAIGC-App**

[⭐ Star this repo](https://gitee.com/sun_qiikai/open-aigc-app) • [🐛 Report Bug](https://gitee.com/sun_qiikai/open-aigc-app/issues) • [💡 Request Feature](https://gitee.com/sun_qiikai/open-aigc-app/issues)

Made with ❤️ by OpenAIGC-App Team

</div>