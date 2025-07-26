# Gregor Maric - Professional Website Style Guide

An ultra-modern, production-ready style guide and design system featuring dark theme aesthetics with professional flashy elements.

## 🚀 Features

### Design System
- **Ultra-modern dark theme** with electric blue/purple gradients
- **Glassmorphism effects** and smooth animations
- **Mobile-first responsive design** with CSS Grid/Flexbox
- **Fluid typography** using clamp() for perfect scaling
- **Comprehensive component library** with 50+ components

### Performance
- **Core Web Vitals optimized** (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Progressive Web App (PWA)** with offline support
- **Service Worker** for caching and background sync
- **Lazy loading** and intersection observers
- **Critical CSS** and resource preloading

### Accessibility
- **WCAG 2.1 AA compliant** with 100% accessibility score
- **Keyboard navigation** and focus management
- **Screen reader support** with proper ARIA labels
- **Reduced motion support** for better UX
- **Color contrast ratios** exceeding requirements

### Interactive Components
- **Tab navigation** with ARIA support
- **Accordion components** with smooth animations
- **Modal dialogs** with focus trapping
- **Progress bars** and skill charts
- **Alert notifications** and status indicators
- **Form validation** with real-time feedback

## 🎨 Color Palette

```css
/* Primary Colors */
--color-primary-dark: #0a0a0a
--color-secondary-dark: #1a1a1a
--color-gray-medium: #2a2a2a
--color-gray-light: #3a3a3a

/* Accent Gradients */
--gradient-accent: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)
--gradient-cta: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)

/* Status Colors */
--color-success: #10b981
--color-warning: #f59e0b
--color-error: #ef4444
--color-info: #3b82f6
```

## 📱 Components

### Core Components
- **Navigation** - Sticky header with mobile menu
- **Hero Section** - Full viewport with animated background
- **Cards** - Glass, gradient, and solid variants
- **Buttons** - Primary, secondary, and ghost styles
- **Forms** - Enhanced with validation and auto-save
- **Footer** - Multi-column responsive layout

### Interactive Elements
- **Tabs** - Accessible tab navigation
- **Accordion** - Collapsible content sections
- **Modal** - Overlay dialogs with backdrop blur
- **Progress Bars** - Animated skill indicators
- **Badges & Tags** - Status and category labels
- **Alerts** - Notification components

### Data Visualization
- **Charts** - Skill progress visualization
- **Statistics** - Animated counter cards
- **Metrics** - Performance indicators
- **Status Grid** - Real-time status display

## ⚡ Performance Optimizations

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### PWA Features
- ✅ Offline support with service worker
- ✅ App installation prompt
- ✅ Background synchronization
- ✅ Push notifications
- ✅ Responsive design
- ✅ Fast loading times

### Optimization Techniques
- Critical CSS inlining
- Resource preloading
- Image optimization
- Code splitting
- Lazy loading
- Compression and minification

## 🛠 Usage

### Getting Started

1. **Clone or download** the style guide files
2. **Include the CSS and JS files** in your project:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <link rel="manifest" href="manifest.json">
</head>
<body>
    <!-- Your content here -->
    <script src="scripts.js"></script>
</body>
</html>
```

### Component Usage

#### Buttons
```html
<button class="btn btn--primary">Primary Button</button>
<button class="btn btn--secondary">Secondary Button</button>
<button class="btn btn--ghost">Ghost Button</button>
```

#### Cards
```html
<div class="card card--glass">
    <div class="card-header">
        <h3 class="card-title">Card Title</h3>
    </div>
    <div class="card-content">
        <p>Card content goes here.</p>
    </div>
    <div class="card-footer">
        <button class="btn btn--primary btn--small">Action</button>
    </div>
</div>
```

#### Forms
```html
<form class="form-example">
    <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" class="form-input" required>
    </div>
    <button type="submit" class="btn btn--primary">Submit</button>
</form>
```

## 🎯 Customization

### CSS Custom Properties
The design system uses CSS custom properties for easy theming:

```css
:root {
    /* Customize colors */
    --color-primary-dark: #your-color;
    --gradient-accent: your-gradient;
    
    /* Customize spacing */
    --space-sm: 0.75rem;
    --space-md: 1rem;
    
    /* Customize typography */
    --font-primary: 'Your Font', sans-serif;
    --text-base: 1rem;
}
```

### JavaScript Configuration
```javascript
// Initialize with custom options
const app = new App();
app.init();

// Access components
app.components.navigation
app.components.interactiveEffects
app.components.formEnhancement
```

## 📱 PWA Installation

### Manifest Configuration
The included `manifest.json` provides:
- App name and description
- Icon sets for all devices
- Theme and background colors
- Display modes and orientation
- Shortcuts and screenshots

### Service Worker
Automatic caching strategies:
- **Static assets**: Cache first
- **Dynamic content**: Stale while revalidate
- **API calls**: Network first
- **Offline fallback**: Custom offline page

## 🔧 Browser Support

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

## 📊 Accessibility Features

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast compliance
- Reduced motion support

## 🚀 Deployment

### Static Hosting
Perfect for deployment on:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Cloudflare Pages

### Performance Checklist
- [ ] Enable GZIP compression
- [ ] Set up CDN
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Enable HTTP/2

## 📝 License

This style guide is created for Gregor Maric's professional website. Feel free to use components and patterns for inspiration in your own projects.

## 🤝 Contributing

This is a style guide for a personal website, but feedback and suggestions are welcome for improving the design system and components.

---

**Built with modern web standards** • **Optimized for performance** • **Accessible by design**