/**
 * Gregor Maric - Professional Website JavaScript
 * Ultra-modern interactions and animations
 */

'use strict';

// ==========================================================================
// Utility Functions
// ==========================================================================

const utils = {
  // Debounce function for performance
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top <= windowHeight * (1 + threshold) &&
      rect.bottom >= -windowHeight * threshold &&
      rect.left <= windowWidth * (1 + threshold) &&
      rect.right >= -windowWidth * threshold
    );
  },

  // Smooth scroll to element
  smoothScrollTo(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  },

  // Get CSS custom property value
  getCSSVar(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  },

  // Set CSS custom property value
  setCSSVar(property, value) {
    document.documentElement.style.setProperty(property, value);
  },

  // Prefers reduced motion check
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

// ==========================================================================
// Navigation Management
// ==========================================================================

class Navigation {
  constructor() {
    this.nav = document.querySelector('.nav-main');
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.isMenuOpen = false;
    this.lastScrollY = window.scrollY;

    this.init();
  }

  init() {
    if (!this.nav) return;

    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Scroll events
    window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), 16));

    // Resize events
    window.addEventListener('resize', utils.debounce(() => this.handleResize(), 250));

    // Close mobile menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.nav.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.navToggle?.classList.add('nav-toggle--open');
    this.navMenu?.classList.add('nav-menu--open');
    document.body.style.overflow = 'hidden';
    
    // Animate menu items
    this.animateMenuItems(true);
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.navToggle?.classList.remove('nav-toggle--open');
    this.navMenu?.classList.remove('nav-menu--open');
    document.body.style.overflow = '';
    
    // Animate menu items
    this.animateMenuItems(false);
  }

  animateMenuItems(opening) {
    if (utils.prefersReducedMotion()) return;

    const links = this.navMenu?.querySelectorAll('.nav-link');
    if (!links) return;

    links.forEach((link, index) => {
      const delay = opening ? index * 50 : (links.length - index - 1) * 50;
      
      setTimeout(() => {
        link.style.transform = opening ? 'translateY(0)' : 'translateY(-20px)';
        link.style.opacity = opening ? '1' : '0';
      }, delay);
    });
  }

  handleNavClick(e) {
    const href = e.target.getAttribute('href');
    
    // Handle anchor links
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        utils.smoothScrollTo(target, this.nav.offsetHeight);
        this.closeMobileMenu();
      }
    } else if (href && href.startsWith('#')) {
      // External links or other navigation
      this.closeMobileMenu();
    }
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > this.lastScrollY;
    const scrollThreshold = 100;

    // Hide/show navigation on scroll
    if (currentScrollY > scrollThreshold) {
      if (scrollingDown && !this.isMenuOpen) {
        this.nav.style.transform = 'translateY(-100%)';
      } else {
        this.nav.style.transform = 'translateY(0)';
      }
    } else {
      this.nav.style.transform = 'translateY(0)';
    }

    // Add background blur when scrolled
    if (currentScrollY > 50) {
      this.nav.classList.add('nav--scrolled');
    } else {
      this.nav.classList.remove('nav--scrolled');
    }

    this.lastScrollY = currentScrollY;
  }

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }
}

// ==========================================================================
// Loading Animation
// ==========================================================================

class LoadingManager {
  constructor() {
    this.loader = document.getElementById('loader');
    this.isLoading = true;
    this.minimumLoadTime = 1000; // Minimum loading time for UX
    this.startTime = Date.now();

    this.init();
  }

  init() {
    if (!this.loader) return;

    // Simulate content loading
    this.simulateLoading();
    
    // Hide loader when page is fully loaded
    if (document.readyState === 'complete') {
      this.hideLoader();
    } else {
      window.addEventListener('load', () => this.hideLoader());
    }
  }

  simulateLoading() {
    const loader = this.loader;
    if (!loader) return;

    // Add loading animation class
    loader.classList.add('loader--active');
  }

  hideLoader() {
    if (!this.loader || !this.isLoading) return;

    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.minimumLoadTime - elapsedTime);

    setTimeout(() => {
      this.loader.classList.add('loader--hidden');
      this.isLoading = false;
      
      // Remove loader from DOM after animation
      setTimeout(() => {
        if (this.loader.parentNode) {
          this.loader.remove();
        }
      }, 500);
    }, remainingTime);
  }
}

// ==========================================================================
// Scroll Animations
// ==========================================================================

class ScrollAnimations {
  constructor() {
    this.elements = [];
    this.observer = null;

    this.init();
  }

  init() {
    if (utils.prefersReducedMotion()) return;

    this.setupIntersectionObserver();
    this.findAnimatableElements();
    this.observeElements();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => this.handleIntersection(entry));
    }, options);
  }

  findAnimatableElements() {
    // Elements to animate on scroll
    const selectors = [
      '.card',
      '.section-title',
      '.hero-content',
      '.color-card',
      '.button-group',
      '.effect-demo',
      '.testimonial-card',
      '.form-example',
      '.typography-group'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        // Add initial animation state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        element.style.transitionDelay = `${index * 100}ms`;
        
        this.elements.push(element);
      });
    });
  }

  observeElements() {
    this.elements.forEach(element => {
      if (this.observer) {
        this.observer.observe(element);
      }
    });
  }

  handleIntersection(entry) {
    if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
      this.animateElement(entry.target);
      this.observer?.unobserve(entry.target);
    }
  }

  animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// ==========================================================================
// Parallax Effects
// ==========================================================================

class ParallaxEffects {
  constructor() {
    this.elements = [];
    this.ticking = false;

    this.init();
  }

  init() {
    if (utils.prefersReducedMotion()) return;

    this.findParallaxElements();
    this.bindEvents();
    this.updateParallax();
  }

  findParallaxElements() {
    // Hero background
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      this.elements.push({
        element: heroBg,
        speed: 0.5,
        type: 'background'
      });
    }

    // Parallax demo element
    const parallaxDemo = document.querySelector('.effect-demo--parallax');
    if (parallaxDemo) {
      this.elements.push({
        element: parallaxDemo,
        speed: 0.3,
        type: 'transform'
      });
    }
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateParallax();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }

  updateParallax() {
    const scrollTop = window.pageYOffset;

    this.elements.forEach(({ element, speed, type }) => {
      if (!utils.isInViewport(element)) return;

      const yPos = -(scrollTop * speed);

      if (type === 'background') {
        element.style.transform = `translateY(${yPos}px)`;
      } else if (type === 'transform') {
        element.style.transform = `perspective(1000px) rotateX(5deg) translateY(${yPos}px)`;
      }
    });
  }
}

// ==========================================================================
// Interactive Effects
// ==========================================================================

class InteractiveEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupCardHovers();
    this.setupButtonEffects();
    this.setupGlowEffects();
    this.setupFormInteractions();
  }

  setupCardHovers() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => this.handleCardEnter(e));
      card.addEventListener('mouseleave', (e) => this.handleCardLeave(e));
      card.addEventListener('mousemove', (e) => this.handleCardMove(e));
    });
  }

  handleCardEnter(e) {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
  }

  handleCardLeave(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
  }

  handleCardMove(e) {
    if (utils.prefersReducedMotion()) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * 5;
    const rotateY = (centerX - x) / centerX * 5;

    card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  setupButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => this.createRippleEffect(e));
    });
  }

  createRippleEffect(e) {
    if (utils.prefersReducedMotion()) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      background-color: rgba(255, 255, 255, 0.6);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
    `;

    // Add ripple styles to document if not exists
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 600);
  }

  setupGlowEffects() {
    const glowElements = document.querySelectorAll('.effect-demo--glow');
    
    glowElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (!utils.prefersReducedMotion()) {
          element.style.filter = 'brightness(1.2)';
        }
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.filter = 'brightness(1)';
      });
    });
  }

  setupFormInteractions() {
    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    formInputs.forEach(input => {
      // Add floating label effect
      this.setupFloatingLabel(input);
      
      // Add focus effects
      input.addEventListener('focus', () => this.handleInputFocus(input));
      input.addEventListener('blur', () => this.handleInputBlur(input));
    });
  }

  setupFloatingLabel(input) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label) return;

    const updateLabel = () => {
      if (input.value || input === document.activeElement) {
        label.style.transform = 'translateY(-150%) scale(0.85)';
        label.style.color = 'var(--color-text-primary)';
      } else {
        label.style.transform = 'translateY(0) scale(1)';
        label.style.color = 'var(--color-text-tertiary)';
      }
    };

    label.style.transition = 'transform 0.2s ease-out, color 0.2s ease-out';
    label.style.transformOrigin = 'left top';
    label.style.pointerEvents = 'none';

    input.addEventListener('input', updateLabel);
    input.addEventListener('focus', updateLabel);
    input.addEventListener('blur', updateLabel);

    updateLabel();
  }

  handleInputFocus(input) {
    input.parentElement?.classList.add('form-group--focused');
  }

  handleInputBlur(input) {
    input.parentElement?.classList.remove('form-group--focused');
  }
}

// ==========================================================================
// Performance Monitor
// ==========================================================================

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      memory: 0,
      loadTime: 0
    };

    this.init();
  }

  init() {
    this.measureLoadTime();
    this.startFPSMonitoring();
    this.monitorMemoryUsage();
  }

  measureLoadTime() {
    if ('performance' in window && 'timing' in performance) {
      window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        this.metrics.loadTime = loadTime;
        console.log(`Page load time: ${loadTime}ms`);
      });
    }
  }

  startFPSMonitoring() {
    let lastTime = performance.now();
    let frames = 0;

    const calculateFPS = (currentTime) => {
      frames++;
      
      if (currentTime >= lastTime + 1000) {
        this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
        
        // Log performance warnings
        if (this.metrics.fps < 30) {
          console.warn(`Low FPS detected: ${this.metrics.fps}`);
        }
      }
      
      requestAnimationFrame(calculateFPS);
    };

    requestAnimationFrame(calculateFPS);
  }

  monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        this.metrics.memory = performance.memory.usedJSHeapSize / 1048576; // MB
        
        // Log memory warnings
        if (this.metrics.memory > 50) {
          console.warn(`High memory usage: ${this.metrics.memory.toFixed(2)}MB`);
        }
      }, 5000);
    }
  }

  getMetrics() {
    return this.metrics;
  }
}

// ==========================================================================
// Theme Manager
// ==========================================================================

class ThemeManager {
  constructor() {
    this.currentTheme = 'dark'; // Default theme
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  bindEvents() {
    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme-preference')) {
        this.applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = theme === 'dark' ? '#0a0a0a' : '#ffffff';
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);
  }

  getTheme() {
    return this.currentTheme;
  }
}

// ==========================================================================
// Accessibility Manager
// ==========================================================================

class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupARIALabels();
    this.setupSkipLinks();
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for custom elements
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      } else if (e.key === 'Enter' || e.key === ' ') {
        this.handleActivation(e);
      }
    });
  }

  handleTabNavigation(e) {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (e.shiftKey) {
      // Shift + Tab (backward)
      if (currentIndex === 0) {
        e.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      }
    } else {
      // Tab (forward)
      if (currentIndex === focusableElements.length - 1) {
        e.preventDefault();
        focusableElements[0].focus();
      }
    }
  }

  handleActivation(e) {
    const target = e.target;
    
    if (target.hasAttribute('role') && target.getAttribute('role') === 'button') {
      e.preventDefault();
      target.click();
    }
  }

  getFocusableElements() {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])'
    ].join(', ');

    return Array.from(document.querySelectorAll(selector));
  }

  setupFocusManagement() {
    // Add focus indicators for better visibility
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible {
        outline: 2px solid #4f46e5;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);

    // Apply focus-visible class
    document.addEventListener('focusin', (e) => {
      if (this.isKeyboardFocus()) {
        e.target.classList.add('focus-visible');
      }
    });

    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('focus-visible');
    });
  }

  isKeyboardFocus() {
    // Simple heuristic to detect keyboard focus
    return !window.mouseDown;
  }

  setupARIALabels() {
    // Add missing ARIA labels
    const nav = document.querySelector('.nav-main');
    if (nav && !nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }

    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle && !navToggle.hasAttribute('aria-label')) {
      navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    }
  }

  setupSkipLinks() {
    // Add skip to content link if not exists
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.className = 'skip-link';
      skipLink.href = '#main';
      skipLink.textContent = 'Skip to main content';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary-dark);
        color: var(--color-text-primary);
        padding: 8px;
        text-decoration: none;
        z-index: 9999;
        border-radius: 4px;
        transition: top 0.3s ease;
      `;

      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });

      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });

      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Add main ID if not exists
    const main = document.querySelector('main, .main-content');
    if (main && !main.id) {
      main.id = 'main';
    }
  }
}

// ==========================================================================
// Interactive Components Manager
// ==========================================================================

class InteractiveComponentsManager {
  constructor() {
    this.tabs = [];
    this.accordions = [];
    this.modals = [];
    this.progressBars = [];
    this.skillBars = [];
    
    this.init();
  }

  init() {
    this.initTabs();
    this.initAccordions();
    this.initModals();
    this.initProgressBars();
    this.initSkillBars();
    this.initAlerts();
  }

  initTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container');
    
    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.tab');
      const panels = container.querySelectorAll('.tab-panel');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetPanel = tab.dataset.tab;
          
          // Remove active classes
          tabs.forEach(t => {
            t.classList.remove('tab--active');
            t.setAttribute('aria-selected', 'false');
          });
          panels.forEach(p => p.classList.remove('tab-panel--active'));
          
          // Add active classes
          tab.classList.add('tab--active');
          tab.setAttribute('aria-selected', 'true');
          const activePanel = container.querySelector(`[data-panel="${targetPanel}"]`);
          if (activePanel) {
            activePanel.classList.add('tab-panel--active');
          }
        });
      });
      
      this.tabs.push({ container, tabs, panels });
    });
  }

  initAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      
      if (header && content) {
        header.addEventListener('click', () => {
          const isExpanded = header.getAttribute('aria-expanded') === 'true';
          
          // Close all other accordion items
          accordionItems.forEach(otherItem => {
            if (otherItem !== item) {
              const otherHeader = otherItem.querySelector('.accordion-header');
              const otherContent = otherItem.querySelector('.accordion-content');
              
              if (otherHeader && otherContent) {
                otherHeader.setAttribute('aria-expanded', 'false');
                otherContent.style.maxHeight = '0';
              }
            }
          });
          
          // Toggle current item
          if (isExpanded) {
            header.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0';
          } else {
            header.setAttribute('aria-expanded', 'true');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
        
        this.accordions.push({ item, header, content });
      }
    });
  }

  initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const modalId = trigger.dataset.modal;
        const modal = document.getElementById(modalId);
        
        if (modal) {
          this.openModal(modal);
        }
      });
    });
    
    modals.forEach(modal => {
      const closeButtons = modal.querySelectorAll('[data-modal-close]');
      
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.closeModal(modal);
        });
      });
      
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
          this.closeModal(modal);
        }
      });
      
      this.modals.push(modal);
    });
  }

  openModal(modal) {
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  closeModal(modal) {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  initProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    const animateProgress = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const progress = progressBar.dataset.progress;
          
          setTimeout(() => {
            progressBar.style.width = `${progress}%`;
          }, 200);
          
          observer.unobserve(progressBar);
        }
      });
    };
    
    const progressObserver = new IntersectionObserver(animateProgress, {
      threshold: 0.5
    });
    
    progressFills.forEach(fill => {
      progressObserver.observe(fill);
      this.progressBars.push(fill);
    });
  }

  initSkillBars() {
    const skillProgress = document.querySelectorAll('.skill-progress');
    
    const animateSkills = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillBar = entry.target;
          const skill = skillBar.dataset.skill;
          
          setTimeout(() => {
            skillBar.style.width = `${skill}%`;
          }, 300);
          
          observer.unobserve(skillBar);
        }
      });
    };
    
    const skillObserver = new IntersectionObserver(animateSkills, {
      threshold: 0.5
    });
    
    skillProgress.forEach(skill => {
      skillObserver.observe(skill);
      this.skillBars.push(skill);
    });
  }

  initAlerts() {
    const alertCloseButtons = document.querySelectorAll('.alert-close');
    
    alertCloseButtons.forEach(button => {
      button.addEventListener('click', () => {
        const alert = button.closest('.alert');
        if (alert) {
          alert.style.transform = 'translateX(100%)';
          alert.style.opacity = '0';
          
          setTimeout(() => {
            alert.remove();
          }, 300);
        }
      });
    });
  }

  destroy() {
    this.tabs = [];
    this.accordions = [];
    this.modals = [];
    this.progressBars = [];
    this.skillBars = [];
  }
}

// ==========================================================================
// Animation Controller
// ==========================================================================

class AnimationController {
  constructor() {
    this.animations = new Map();
    this.isReducedMotion = utils.prefersReducedMotion();
    
    this.init();
  }

  init() {
    if (this.isReducedMotion) return;
    
    this.initCounterAnimations();
    this.initFloatingElements();
    this.initTypewriterEffect();
  }

  initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
      const duration = 2000;
      const start = performance.now();
      const startValue = 0;
      
      const isPercentage = target.includes('%');
      const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (numericTarget - startValue) * easeOutCubic);
        
        if (isPercentage) {
          element.textContent = currentValue + '%';
        } else if (target.includes('+')) {
          element.textContent = currentValue + '+';
        } else {
          element.textContent = currentValue;
        }
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
        }
      };
      
      requestAnimationFrame(updateCounter);
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.textContent;
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
      counterObserver.observe(stat);
    });
  }

  initFloatingElements() {
    const floatingElements = document.querySelectorAll('.effect-demo--parallax');
    
    floatingElements.forEach((element, index) => {
      const randomDelay = index * 200;
      const randomDuration = 3000 + (index * 500);
      
      element.style.animation = `float ${randomDuration}ms ease-in-out infinite ${randomDelay}ms`;
    });
    
    // Add floating keyframes
    if (!document.getElementById('floating-keyframes')) {
      const style = document.createElement('style');
      style.id = 'floating-keyframes';
      style.textContent = `
        @keyframes float {
          0%, 100% {
            transform: perspective(1000px) rotateX(5deg) translateY(0);
          }
          50% {
            transform: perspective(1000px) rotateX(5deg) translateY(-10px);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
      const text = element.dataset.typewriter || element.textContent;
      const speed = parseInt(element.dataset.speed) || 50;
      
      element.textContent = '';
      
      const typeWriter = (i = 0) => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          setTimeout(() => typeWriter(i + 1), speed);
        }
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeWriter();
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(element);
    });
  }

  addAnimation(name, element, config) {
    if (this.isReducedMotion) return;
    
    this.animations.set(name, {
      element,
      config,
      isPlaying: false
    });
  }

  playAnimation(name) {
    if (this.isReducedMotion) return;
    
    const animation = this.animations.get(name);
    if (animation && !animation.isPlaying) {
      animation.isPlaying = true;
      // Animation logic here
    }
  }

  stopAnimation(name) {
    const animation = this.animations.get(name);
    if (animation) {
      animation.isPlaying = false;
      // Stop animation logic here
    }
  }

  destroy() {
    this.animations.clear();
  }
}

// ==========================================================================
// Form Enhancement
// ==========================================================================

class FormEnhancement {
  constructor() {
    this.forms = [];
    
    this.init();
  }

  init() {
    this.enhanceForms();
    this.addValidation();
    this.addAutoSave();
  }

  enhanceForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add loading states
      form.addEventListener('submit', (e) => {
        this.handleFormSubmission(e, form);
      });
      
      // Enhanced input interactions
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        this.enhanceInput(input);
      });
      
      this.forms.push(form);
    });
  }

  enhanceInput(input) {
    // Real-time validation
    input.addEventListener('blur', () => {
      this.validateField(input);
    });
    
    // Character count for textareas
    if (input.tagName === 'TEXTAREA' && input.hasAttribute('maxlength')) {
      this.addCharacterCount(input);
    }
    
    // Auto-resize textareas
    if (input.tagName === 'TEXTAREA') {
      this.autoResizeTextarea(input);
    }
  }

  validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let message = '';
    
    // Remove existing validation message
    this.removeValidationMessage(input);
    
    // Required field validation
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      message = 'This field is required';
    }
    
    // Email validation
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    }
    
    // Add validation styling and message
    if (!isValid) {
      input.classList.add('input--error');
      this.addValidationMessage(input, message);
    } else {
      input.classList.remove('input--error');
      input.classList.add('input--success');
    }
    
    return isValid;
  }

  addValidationMessage(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: var(--color-error);
      font-size: var(--text-sm);
      margin-top: 0.5rem;
      animation: slideInDown 0.3s ease-out;
    `;
    
    input.parentNode.appendChild(errorElement);
  }

  removeValidationMessage(input) {
    const existingError = input.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
    input.classList.remove('input--error', 'input--success');
  }

  addCharacterCount(textarea) {
    const maxLength = parseInt(textarea.getAttribute('maxlength'));
    const counter = document.createElement('div');
    counter.className = 'character-count';
    counter.style.cssText = `
      text-align: right;
      font-size: var(--text-sm);
      color: var(--color-text-tertiary);
      margin-top: 0.5rem;
    `;
    
    const updateCount = () => {
      const remaining = maxLength - textarea.value.length;
      counter.textContent = `${remaining} characters remaining`;
      
      if (remaining < 0) {
        counter.style.color = 'var(--color-error)';
      } else if (remaining < 20) {
        counter.style.color = 'var(--color-warning)';
      } else {
        counter.style.color = 'var(--color-text-tertiary)';
      }
    };
    
    textarea.addEventListener('input', updateCount);
    textarea.parentNode.appendChild(counter);
    updateCount();
  }

  autoResizeTextarea(textarea) {
    const resize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    };
    
    textarea.addEventListener('input', resize);
    resize();
  }

  handleFormSubmission(e, form) {
    e.preventDefault();
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) {
      return;
    }
    
    // Add loading state
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      submitButton.classList.add('btn--loading');
    }
    
    // Simulate form submission
    setTimeout(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        submitButton.classList.remove('btn--loading');
      }
      
      // Show success message
      this.showSuccessMessage(form);
    }, 2000);
  }

  showSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert--success';
    successMessage.innerHTML = `
      <div class="alert-icon"></div>
      <div class="alert-content">
        <h4 class="alert-title">Success!</h4>
        <p class="alert-message">Your message has been sent successfully.</p>
      </div>
    `;
    
    form.parentNode.insertBefore(successMessage, form);
    form.reset();
    
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }

  addAutoSave() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
      if (textarea.id) {
        // Load saved content
        const saved = localStorage.getItem(`autosave_${textarea.id}`);
        if (saved) {
          textarea.value = saved;
        }
        
        // Save on input
        textarea.addEventListener('input', utils.debounce(() => {
          localStorage.setItem(`autosave_${textarea.id}`, textarea.value);
        }, 1000));
        
        // Clear on form submit
        const form = textarea.closest('form');
        if (form) {
          form.addEventListener('submit', () => {
            localStorage.removeItem(`autosave_${textarea.id}`);
          });
        }
      }
    });
  }

  destroy() {
    this.forms = [];
  }
}

// ==========================================================================
// Application Initialization
// ==========================================================================

class App {
  constructor() {
    this.components = {};
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Initialize core components
      this.components.loadingManager = new LoadingManager();
      this.components.navigation = new Navigation();
      this.components.themeManager = new ThemeManager();
      this.components.accessibilityManager = new AccessibilityManager();

      // Initialize effects (only if not reduced motion)
      if (!utils.prefersReducedMotion()) {
        this.components.scrollAnimations = new ScrollAnimations();
        this.components.parallaxEffects = new ParallaxEffects();
        this.components.interactiveEffects = new InteractiveEffects();
      }
      
      // Initialize new interactive components
      this.components.interactiveComponentsManager = new InteractiveComponentsManager();
      this.components.animationController = new AnimationController();
      this.components.formEnhancement = new FormEnhancement();
      this.components.pwaManager = new PWAManager();

      // Initialize performance monitoring (development only)
      if (process?.env?.NODE_ENV === 'development') {
        this.components.performanceMonitor = new PerformanceMonitor();
      }

      this.bindGlobalEvents();
      this.initialized = true;

      console.log('🚀 Gregor Maric website initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize website:', error);
    }
  }

  bindGlobalEvents() {
    // Global error handling
    window.addEventListener('error', (e) => {
      console.error('JavaScript error:', e.error);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
    });

    // Performance logging
    window.addEventListener('load', () => {
      if ('performance' in window) {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log('Performance metrics:', {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            totalTime: perfData.loadEventEnd - perfData.fetchStart
          });
        }, 0);
      }
    });

    // Track mouse state for focus management
    document.addEventListener('mousedown', () => {
      window.mouseDown = true;
    });

    document.addEventListener('mouseup', () => {
      window.mouseDown = false;
    });
  }

  destroy() {
    // Clean up components
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });

    this.components = {};
    this.initialized = false;
  }
}

// ==========================================================================
// Initialize Application
// ==========================================================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  window.app = new App();
  window.app.init();
}

// ==========================================================================
// Service Worker Registration (PWA Support)
// ==========================================================================

class PWAManager {
  constructor() {
    this.init();
  }

  async init() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('js/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
    
    this.handleInstallPrompt();
    this.addToHomeScreenPrompt();
  }

  handleInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button if you have one
      const installButton = document.querySelector('.install-button');
      if (installButton) {
        installButton.style.display = 'block';
        
        installButton.addEventListener('click', async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            deferredPrompt = null;
            installButton.style.display = 'none';
          }
        });
      }
    });
  }

  addToHomeScreenPrompt() {
    // iOS specific
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone;
    
    if (isIOS && !isStandalone) {
      // Show iOS install instructions
      console.log('iOS device detected - show add to home screen instructions');
    }
  }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    App, 
    utils, 
    InteractiveComponentsManager, 
    AnimationController, 
    FormEnhancement, 
    PWAManager 
  };
}