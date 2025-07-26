/**
 * GREGOR MARIC - PROFESSIONAL STYLE GUIDE
 * Interactive JavaScript Components & Functionality
 */

class StyleGuideApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupNavigationInteractions();
        this.setupColorCopyFunctionality();
        this.setupFormInteractions();
        this.setupAnimationOnScroll();
        this.setupThemeToggle();
        this.setupComponentInteractions();
        this.setupResponsiveNavigation();
        this.setupPerformanceOptimizations();
    }

    /**
     * Smooth Scrolling Navigation
     */
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active navigation state
                    this.updateActiveNavigation(targetId);
                }
            });
        });
    }

    /**
     * Update Active Navigation State
     */
    updateActiveNavigation(activeId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Navigation Scroll Effects
     */
    setupNavigationInteractions() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNavbar = () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }

            // Auto-highlight navigation based on scroll position
            this.highlightActiveSection();
            
            lastScrollY = scrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    /**
     * Highlight Active Section in Navigation
     */
    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = `#${section.id}`;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                this.updateActiveNavigation(sectionId);
            }
        });
    }

    /**
     * Color Palette Copy Functionality
     */
    setupColorCopyFunctionality() {
        const colorCards = document.querySelectorAll('.color-card');
        
        colorCards.forEach(card => {
            const colorHex = card.querySelector('.color-hex');
            if (colorHex) {
                const hexValue = colorHex.textContent;
                
                card.style.cursor = 'pointer';
                card.title = `Click to copy ${hexValue}`;
                
                card.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(hexValue);
                        this.showToast(`Copied ${hexValue} to clipboard!`, 'success');
                        
                        // Visual feedback
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.transform = '';
                        }, 150);
                        
                    } catch (err) {
                        this.showToast('Failed to copy color code', 'error');
                    }
                });
            }
        });

        // Copy gradient values
        const gradientCards = document.querySelectorAll('.gradient-card');
        gradientCards.forEach(card => {
            const gradientCode = card.querySelector('.gradient-info p');
            if (gradientCode) {
                const gradientValue = gradientCode.textContent;
                
                card.style.cursor = 'pointer';
                card.title = 'Click to copy gradient code';
                
                card.addEventListener('click', async () => {
                    try {
                        const fullGradient = `background: linear-gradient(${gradientValue});`;
                        await navigator.clipboard.writeText(fullGradient);
                        this.showToast('Copied gradient code to clipboard!', 'success');
                        
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.transform = '';
                        }, 150);
                        
                    } catch (err) {
                        this.showToast('Failed to copy gradient code', 'error');
                    }
                });
            }
        });
    }

    /**
     * Enhanced Form Interactions
     */
    setupFormInteractions() {
        // Real-time form validation
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateInput(input);
                }
            });
        });

        // Newsletter form submission
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmission(form);
            });
        });

        // Demo form submission
        const demoForm = document.querySelector('.demo-form');
        if (demoForm) {
            demoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDemoFormSubmission(demoForm);
            });
        }

        // Custom select styling
        this.setupCustomSelects();
    }

    /**
     * Input Validation
     */
    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let message = '';

        // Remove previous error styling
        input.classList.remove('error', 'success');
        this.removeErrorMessage(input);

        if (input.required && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        if (!isValid) {
            input.classList.add('error');
            this.showErrorMessage(input, message);
        } else if (value) {
            input.classList.add('success');
        }

        return isValid;
    }

    /**
     * Show Error Message
     */
    showErrorMessage(input, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-sm);
            margin-top: var(--spacing-xs);
            font-weight: var(--font-weight-medium);
        `;
        
        input.parentNode.appendChild(errorElement);
    }

    /**
     * Remove Error Message
     */
    removeErrorMessage(input) {
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * Newsletter Form Submission
     */
    handleNewsletterSubmission(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (this.validateInput(emailInput)) {
            // Simulate API call
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                this.showToast('Successfully subscribed to newsletter!', 'success');
                emailInput.value = '';
                emailInput.classList.remove('success');
                submitButton.textContent = 'Subscribe';
                submitButton.disabled = false;
            }, 2000);
        }
    }

    /**
     * Demo Form Submission
     */
    handleDemoFormSubmission(form) {
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        const submitButton = form.querySelector('button[type="submit"]');
        let allValid = true;

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                allValid = false;
            }
        });

        if (allValid) {
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                this.showToast('Form submitted successfully!', 'success');
                form.reset();
                inputs.forEach(input => {
                    input.classList.remove('success', 'error');
                });
                submitButton.textContent = 'Submit Form';
                submitButton.disabled = false;
            }, 2000);
        } else {
            this.showToast('Please fix the errors in the form', 'error');
        }
    }

    /**
     * Custom Select Styling
     */
    setupCustomSelects() {
        const selects = document.querySelectorAll('.form-select');
        
        selects.forEach(select => {
            select.addEventListener('focus', () => {
                select.style.borderColor = 'var(--color-primary-blue)';
                select.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            });
            
            select.addEventListener('blur', () => {
                select.style.borderColor = '';
                select.style.boxShadow = '';
            });
        });
    }

    /**
     * Animation on Scroll
     */
    setupAnimationOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    
                    // Stagger animations for grid items
                    if (entry.target.classList.contains('color-card') || 
                        entry.target.classList.contains('component-demo') ||
                        entry.target.classList.contains('card')) {
                        
                        const delay = Math.random() * 200;
                        setTimeout(() => {
                            entry.target.style.animationDelay = `${delay}ms`;
                        }, delay);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatableElements = document.querySelectorAll(`
            .color-card, 
            .component-demo, 
            .card, 
            .brand-card, 
            .hero-demo,
            .pattern-demo
        `);

        animatableElements.forEach(el => observer.observe(el));
    }

    /**
     * Theme Toggle (Dark/Light Mode)
     */
    setupThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '🌙';
        themeToggle.title = 'Toggle dark mode';
        themeToggle.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            background: var(--gradient-primary);
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            z-index: var(--z-fixed);
            transition: all var(--transition-base);
        `;

        document.body.appendChild(themeToggle);

        // Toggle functionality
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.innerHTML = isDark ? '☀️' : '🌙';
            
            // Store preference
            localStorage.setItem('dark-theme', isDark);
        });

        // Load saved preference
        const savedTheme = localStorage.getItem('dark-theme');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '☀️';
        }

        // Hover effects
        themeToggle.addEventListener('mouseenter', () => {
            themeToggle.style.transform = 'scale(1.1)';
        });

        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.style.transform = 'scale(1)';
        });
    }

    /**
     * Component Interactions
     */
    setupComponentInteractions() {
        // Button click effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!button.disabled) {
                    this.createRippleEffect(e, button);
                }
            });
        });

        // Card hover enhancements
        const cards = document.querySelectorAll('.card-hover');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Alert auto-dismiss
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: auto;
                color: inherit;
                opacity: 0.7;
                transition: opacity var(--transition-base);
            `;

            closeButton.addEventListener('click', () => {
                alert.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => alert.remove(), 300);
            });

            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.opacity = '1';
            });

            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.opacity = '0.7';
            });

            alert.appendChild(closeButton);
        });
    }

    /**
     * Ripple Effect for Buttons
     */
    createRippleEffect(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Responsive Navigation
     */
    setupResponsiveNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                
                // Animate hamburger menu
                const spans = navToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    if (navToggle.classList.contains('active')) {
                        if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                        if (index === 1) span.style.opacity = '0';
                        if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    } else {
                        span.style.transform = '';
                        span.style.opacity = '';
                    }
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        }
    }

    /**
     * Performance Optimizations
     */
    setupPerformanceOptimizations() {
        // Lazy load images if any
        const images = document.querySelectorAll('img[data-src]');
        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        // Debounce scroll events
        this.debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
    }

    /**
     * Toast Notification System
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            color: white;
            font-weight: var(--font-weight-medium);
            z-index: var(--z-tooltip);
            transform: translateX(100%);
            transition: transform var(--transition-base);
            max-width: 300px;
        `;

        // Set background color based on type
        const colors = {
            success: 'var(--color-success)',
            error: 'var(--color-error)',
            warning: 'var(--color-warning)',
            info: 'var(--color-info)'
        };

        toast.style.background = colors[type] || colors.info;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// CSS Animation Keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }

    .nav-link.active {
        color: var(--color-primary-blue);
        background-color: rgba(102, 126, 234, 0.1);
    }

    .form-input.error,
    .form-textarea.error {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }

    .form-input.success,
    .form-textarea.success {
        border-color: var(--color-success);
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }

    /* Dark Theme Styles */
    .dark-theme {
        --color-white: #1a1a1a;
        --color-light-gray: #2d2d2d;
        --color-dark-gray: #ffffff;
        --color-medium-gray: #cccccc;
    }

    .dark-theme .navbar {
        background: rgba(26, 26, 26, 0.95);
    }

    .dark-theme .card,
    .dark-theme .component-demo,
    .dark-theme .brand-card {
        background: #2d2d2d;
        border-color: #404040;
    }

    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all var(--transition-base);
        }

        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }

        .theme-toggle {
            bottom: 1rem !important;
            right: 1rem !important;
            width: 50px !important;
            height: 50px !important;
        }
    }
`;

document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StyleGuideApp();
});

// Export for potential external use
window.StyleGuideApp = StyleGuideApp;