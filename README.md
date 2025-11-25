# OpenAIGC-App 🚀

> **An AI Content Creation Platform** - An intelligent creative tool integrating image, audio, video, and text creation

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🙏 Tribute

This project was developed entirely through conversational development with iflow cli. Thanks to the great work of the [iFlow](https://platform.iflow.cn/) team and the hard work of all staff members! 🎉🎉🎉

## ✨ Project Overview

OpenAIGC-App is an AI content creation platform built on modern web technology stack, committed to providing users with professional, efficient, and intelligent creative experience. The project adopts the **glassmorphism design** concept and builds a complete **multimodal AI creation ecosystem**, covering four core functional modules: image generation, audio synthesis, video production, and text creation.

### 🎯 Core Design Philosophy

- **Multimodal Integration** - Unified content creation experience supporting image, audio, video, and text creation modes
- **Professional Templates** - Exclusive UI templates and interaction design for each content type
- **Intelligent User Experience** - Intelligent routing and personalized recommendations based on user behavior
- **Commercial Architecture** - Complete membership subscription system and user management system
- **Responsive Design** - Mobile-first full-platform adaptation solution

## 🏗 Project Architecture

### Technology Stack Selection

| Domain | Technology Choice | Rationale |
|--------|------------------|-----------|
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
│   │   ├── 📁 settings/           # Account Settings (personal info, security, preferences)
│   │   ├── 📁 history/            # Creation History (work management, search filtering)
│   │   ├── 📁 favorites/          # My Favorites (batch management, data statistics)
│   │   ├── 📁 privacy/            # Privacy Settings (data security, third-party authorization)
│   │   ├── 📁 offline/            # Offline Management (storage monitoring, download management)
│   │   └── page.tsx              # Personal Center Homepage
│   ├── 📁 tools/                  # AI Tools Navigation
│   ├── 📁 subscription/           # Membership Subscription System
│   ├── 📁 home/                   # Homepage (waterfall layout)
│   ├── 📁 image-gen/              # Image Generation Tool
│   ├── 📁 audio-gen/              # Audio Generation Tool
│   ├── 📁 video-gen/              # Video Generation Tool
│   ├── 📁 image-detail/           # Image Detail Template (blue theme)
│   ├── 📁 audio-detail/           # Audio Detail Template (green theme)
│   ├── 📁 video-detail/           # Video Detail Template (red theme)
│   ├── 📁 text-detail/            # Text Detail Template (purple theme)
│   ├── layout.tsx                # Root Layout
│   └── page.tsx                  # Startup Page
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

**Glassmorphism**
- **Background Blur** - backdrop-blur-sm creates layered depth
- **Semi-transparent Effects** - bg-white/70 creates lightweight feel
- **Border Design** - border border-slate-200/50 refined borders
- **Shadow System** - hover:shadow-xl three-dimensional interactive feedback

### Color Theme System

| Content Type | Theme Color | Symbolic Meaning | Application Scenarios |
|--------------|-------------|------------------|----------------------|
| 🖼️ **Image** | Blue System (#3B82F6) | Creativity, Professional | Image generation, gallery display |
| 🎵 **Audio** | Green System (#10B981) | Nature, Harmony | Audio player, music production |
| 🎬 **Video** | Red System (#EF4444) | Energy, Passion | Video player, film production |
| 📝 **Text** | Purple System (#8B5CF6) | Wisdom, Thinking | Article reading, writing tools |

### Responsive Layout Strategy

```css
/* Mobile-first breakpoint system */
grid-cols-1        /* Mobile: single column layout */
md:grid-cols-2     /* Tablet: two-column layout */  
lg:grid-cols-3     /* Desktop: three-column layout */
xl:grid-cols-4     /* Large screen: four-column layout */
```

## 🚀 Core Functional Modules

### 1. AI Creation Tools

#### 🎨 Image Generation (`/image-gen`)
- **Text-to-Image** - AI-based text description generation technology
- **Style Selection** - 12 professional artistic styles (realistic, anime, oil painting, etc.)
- **Parameter Control** - Quality selection, aspect ratio, generation parameters
- **Inspiration Gallery** - Curated work examples to inspire creativity

#### 🎵 Audio Synthesis (`/audio-gen`)
- **Text-to-Speech** - Multi-language speech synthesis technology
- **Music Generation** - AI-assisted background music creation
- **Sound Effects Production** - Professional-grade audio effects processing
- **Format Support** - Multiple audio format exports

#### 🎬 Video Generation (`/video-gen`)
- **Text-to-Video** - Dynamic video one-click generation
- **Image Animation** - Static image dynamic processing
- **Effects Processing** - Rich visual effects library
- **Editing Tools** - Basic video editing functionality

#### 📝 Text Creation (`/text-gen`)
- **Intelligent Writing** - AI-assisted copywriting creation
- **Multi-type Support** - Ad copy, novel creation, content planning
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
- **Intelligent Search** - Support for title, description, and tag search
- **Category Filtering** - Filter by content type, time, and popularity
- **Batch Operations** - Batch management, sharing, and deletion functions

#### ❤️ My Favorites (`/profile/favorites`)
- **Favorite Management** - Centralized management of favorited works
- **Batch Selection** - Support for multi-select batch operations
- **Category Organization** - Automatic categorization by type
- **Sharing Features** - One-click sharing to social platforms

#### 🔒 Privacy Settings (`/profile/privacy`)
- **Visibility Control** - Three levels: public/friends/private
- **Data Permissions** - Fine-grained data usage permission management
- **Third-party Authorization** - Application authorization and revocation management
- **Data Export** - Complete data export functionality

#### 📱 Offline Management (`/profile/offline`)
- **Storage Monitoring** - Real-time storage space usage monitoring
- **Offline Caching** - Work offline caching management
- **Sync Settings** - Automatic sync and download configuration
- **Cleanup Tools** - Cache cleanup and space management

### 3. Membership Subscription System

#### 💎 Membership Level Design

| Level | Price | Monthly Quota | Core Privileges |
|-------|-------|---------------|-----------------|
| **Free** | ¥0/Permanent | 3 generations/day | SD export, watermarked, basic templates |
| **Personal Creator** | ¥19/month | 200 generations | HD export, no watermark, priority queue, API trial |
| **Professional Creator** | ¥49/month | 800 generations | 4K HD, batch processing, API access, exclusive support |
| **Enterprise Creator** | ¥199/month | 3000 generations | Customized services, enterprise-level support, advanced features |

#### 🎯 Business Model Highlights
- **Usage-based Billing** - Flexible billing based on actual usage
- **Tiered Services** - Complete service chain from free trial to enterprise
- **Value-oriented** - Corresponding services based on creation needs and scale
- **Sustainability** - Reasonable pricing strategy considering AI computing costs

### 4. Homepage Waterfall System

#### 📱 Content-driven Layout
- **Dynamic Grid** - Intelligent waterfall algorithm with adaptive arrangement for different height content
- **Infinite Scroll** - Lazy loading mechanism to optimize performance experience
- **Content Aggregation** - Unified display of four content types
- **Intelligent Sorting** - Personalized recommendations based on user behavior

#### 🔄 Interactive Experience Design
- **Hover Effects** - Card hover and zoom animations
- **Quick Preview** - Hover to display key information
- **One-click Operations** - Quick access to favorite, share, download
- **Intelligent Routing** - Automatic jump to corresponding detail pages based on content type

## 🛠 Development Guide

### Environment Requirements
- Node.js 18+ 
- npm 8+ or yarn 1.22+
- Modern browser support

### Quick Start

```bash
# Clone the project
git clone https://github.com/stone100010/OpenAIGC-App.git
cd open-aigc-app

# Install dependencies
npm install

# Start development server
npm run dev

# Access the application
open http://localhost:3000
```

### Build and Deployment

```bash
# Build production version
npm run build

# Start production server
npm start

# Deploy with Docker
docker build -t openaigc-app .
docker run -p 3000:3000 openaigc-app
```

## 📊 Performance Optimization

### Next.js Optimization Features
- **Automatic Code Splitting** - Automatic JavaScript bundle splitting by page
- **Image Optimization** - Next.js Image component automatic optimization
- **Static Generation** - SSG support to improve first-screen loading speed
- **Server-side Rendering** - SSR improves SEO and initial loading performance

### User Experience Optimization
- **Skeleton Screens** - Loading state placeholders
- **Lazy Loading** - On-demand loading of images and components
- **Caching Strategy** - Intelligent caching to improve response speed
- **Preloading** - Critical resource preloading

## 🔧 Technical Implementation Highlights

### Intelligent Routing System
```typescript
// Intelligent routing based on content type
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

### Glassmorphism Components
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

## 🤝 Contributing Guidelines

We welcome all forms of contribution!

### How to Contribute
- 🐛 **Bug Reports** - Report issues through Issues
- 💡 **Feature Suggestions** - Propose new feature ideas
- 📝 **Documentation Improvement** - Improve project documentation
- 🔧 **Code Contributions** - Submit Pull Requests

### Development Process
1. Fork the project repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

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

## 🙏 Acknowledgments

Thanks to the following open source projects and services:

- [Next.js](https://nextjs.org/) - React full-stack framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [FontAwesome](https://fontawesome.com/) - Icon library
- [Unsplash](https://unsplash.com/) - High-quality images

---

<div align="center">

**🚀 Making AI Creation Accessible - OpenAIGC-App**


Made with ❤️ by OpenAIGC-App Team

</div>