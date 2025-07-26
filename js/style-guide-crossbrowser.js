/**
 * GREGOR MARIC - CROSS-BROWSER & MOBILE OPTIMIZED JAVASCRIPT
 * Enhanced Style Guide with Polyfills and Performance Optimizations
 */

(function(window, document) {
    'use strict';

    /**
     * Polyfills for older browsers
     */
    
    // Array.from polyfill for IE11
    if (!Array.from) {
        Array.from = function(arrayLike, mapFn, thisArg) {
            var C = this;
            var items = Object(arrayLike);
            if (arrayLike == null) {
                throw new TypeError('Array.from requires an array-like object - not null or undefined');
            }
            var len = parseInt(items.length) || 0;
            var A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
            var k = 0;
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof thisArg === 'undefined' ? mapFn(kValue, k) : mapFn.call(thisArg, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            A.length = len;
            return A;
        };
    }

    // NodeList.forEach polyfill for IE11
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    // Element.closest polyfill for IE11
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            do {
                if (Element.prototype.matches.call(el, s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    // Element.matches polyfill for IE11
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                  Element.prototype.webkitMatchesSelector;
    }

    // CustomEvent polyfill for IE11
    if (typeof window.CustomEvent !== 'function') {
        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: null };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        window.CustomEvent = CustomEvent;
    }

    // Object.assign polyfill for IE11
    if (typeof Object.assign !== 'function') {
        Object.assign = function(target) {
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var to = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
                if (nextSource != null) {
                    for (var nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }

    // requestAnimationFrame polyfill
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || 
                                         window[vendors[x]+'CancelRequestAnimationFrame'];
        }
        
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { 
                    callback(currTime + timeToCall); 
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());

    /**
     * Feature Detection
     */
    var Features = {
        touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        passiveEvents: (function() {
            var supportsPassive = false;
            try {
                var opts = Object.defineProperty({}, 'passive', {
                    get: function() {
                        supportsPassive = true;
                    }
                });
                window.addEventListener('testPassive', null, opts);
                window.removeEventListener('testPassive', null, opts);
            } catch (e) {}
            return supportsPassive;
        })(),
        intersectionObserver: 'IntersectionObserver' in window,
        cssGrid: (function() {
            return CSS && CSS.supports && CSS.supports('display', 'grid');
        })(),
        cssCustomProperties: (function() {
            return CSS && CSS.supports && CSS.supports('color', 'var(--test)');
        })(),
        backdropFilter: (function() {
            return CSS && CSS.supports && (
                CSS.supports('backdrop-filter', 'blur(1px)') ||
                CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
            );
        })()
    };

    /**
     * Performance utilities
     */
    var Performance = {
        throttle: function(func, limit) {
            var inThrottle;
            return function() {
                var args = arguments;
                var context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(function() { inThrottle = false; }, limit);
                }
            };
        },

        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        raf: function(callback) {
            return requestAnimationFrame(callback);
        }
    };

    /**
     * Mobile-optimized Style Guide App
     */
    function StyleGuideApp() {
        this.init();
    }

    StyleGuideApp.prototype = {
        init: function() {
            var self = this;
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    self.setupComponents();
                });
            } else {
                self.setupComponents();
            }
        },

        setupComponents: function() {
            this.setupNavigation();
            this.setupSmoothScrolling();
            this.setupColorCopyFunctionality();
            this.setupFormInteractions();
            this.setupAnimationOnScroll();
            this.setupThemeToggle();
            this.setupComponentInteractions();
            this.setupMobileOptimizations();
            this.setupPerformanceOptimizations();
            this.setupAccessibilityFeatures();
        },

        /**
         * Mobile-optimized Navigation
         */
        setupNavigation: function() {
            var navbar = document.querySelector('.navbar');
            var navToggle = document.querySelector('.nav-toggle');
            var navMenu = document.querySelector('.nav-menu');
            var navLinks = document.querySelectorAll('.nav-link');
            
            if (!navToggle || !navMenu) return;

            // Create overlay for mobile menu
            var overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);

            var self = this;
            var lastScrollY = window.pageYOffset;

            // Mobile menu toggle
            navToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.toggleMobileMenu(navToggle, navMenu, overlay);
            });

            // Close menu when clicking overlay
            overlay.addEventListener('click', function() {
                self.closeMobileMenu(navToggle, navMenu, overlay);
            });

            // Close menu when clicking nav links
            navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    if (navMenu.classList.contains('active')) {
                        self.closeMobileMenu(navToggle, navMenu, overlay);
                    }
                });
            });

            // Enhanced navbar scroll behavior
            var updateNavbar = Performance.throttle(function() {
                var scrollY = window.pageYOffset;
                
                if (navbar) {
                    if (scrollY > 100) {
                        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                    } else {
                        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                    }

                    // Auto-hide navbar on mobile when scrolling down
                    if (Features.touch && window.innerWidth <= 768) {
                        if (scrollY > lastScrollY && scrollY > 100) {
                            navbar.style.transform = 'translateY(-100%)';
                        } else {
                            navbar.style.transform = 'translateY(0)';
                        }
                    }
                }

                self.highlightActiveSection();
                lastScrollY = scrollY;
            }, 16);

            window.addEventListener('scroll', updateNavbar, Features.passiveEvents ? { passive: true } : false);
        },

        toggleMobileMenu: function(navToggle, navMenu, overlay) {
            var isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                this.closeMobileMenu(navToggle, navMenu, overlay);
            } else {
                this.openMobileMenu(navToggle, navMenu, overlay);
            }
        },

        openMobileMenu: function(navToggle, navMenu, overlay) {
            navToggle.classList.add('active');
            navMenu.classList.add('active');
            overlay.classList.add('active');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Add escape key listener
            document.addEventListener('keydown', this.handleEscapeKey.bind(this));
            
            // Animate menu items
            var navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(function(link, index) {
                setTimeout(function() {
                    link.classList.add('animate-mobile-slide-in-left');
                }, index * 50);
            });
        },

        closeMobileMenu: function(navToggle, navMenu, overlay) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Remove escape key listener
            document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
        },

        handleEscapeKey: function(e) {
            if (e.keyCode === 27) { // Escape key
                var navToggle = document.querySelector('.nav-toggle');
                var navMenu = document.querySelector('.nav-menu');
                var overlay = document.querySelector('.nav-overlay');
                this.closeMobileMenu(navToggle, navMenu, overlay);
            }
        },

        highlightActiveSection: function() {
            var sections = document.querySelectorAll('section[id]');
            var navHeight = document.querySelector('.navbar').offsetHeight;
            var scrollPosition = window.pageYOffset + navHeight + 100;

            sections.forEach(function(section) {
                var sectionTop = section.offsetTop;
                var sectionBottom = sectionTop + section.offsetHeight;
                var sectionId = '#' + section.id;
                var navLink = document.querySelector('.nav-link[href="' + sectionId + '"]');

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    // Remove active class from all links
                    document.querySelectorAll('.nav-link').forEach(function(link) {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current link
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                }
            });
        },

        /**
         * Enhanced smooth scrolling with mobile optimization
         */
        setupSmoothScrolling: function() {
            var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
            var self = this;
            
            navLinks.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    var targetId = link.getAttribute('href');
                    var targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        var navHeight = document.querySelector('.navbar').offsetHeight;
                        var targetPosition = targetElement.offsetTop - navHeight - 20;
                        
                        // Use native smooth scrolling if available
                        if ('scrollBehavior' in document.documentElement.style) {
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        } else {
                            // Fallback smooth scrolling for older browsers
                            self.smoothScrollTo(targetPosition, 800);
                        }
                        
                        // Update active navigation state
                        self.updateActiveNavigation(targetId);
                    }
                });
            });
        },

        smoothScrollTo: function(targetPosition, duration) {
            var startPosition = window.pageYOffset;
            var distance = targetPosition - startPosition;
            var startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                var timeElapsed = currentTime - startTime;
                var run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        },

        updateActiveNavigation: function(activeId) {
            var navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === activeId) {
                    link.classList.add('active');
                }
            });
        },

        /**
         * Enhanced color copy functionality
         */
        setupColorCopyFunctionality: function() {
            var colorCards = document.querySelectorAll('.color-card');
            var self = this;
            
            colorCards.forEach(function(card) {
                var colorHex = card.querySelector('.color-hex');
                if (colorHex) {
                    var hexValue = colorHex.textContent;
                    
                    card.style.cursor = 'pointer';
                    card.setAttribute('title', 'Click to copy ' + hexValue);
                    card.setAttribute('role', 'button');
                    card.setAttribute('tabindex', '0');
                    
                    // Click handler
                    card.addEventListener('click', function() {
                        self.copyToClipboard(hexValue, card);
                    });
                    
                    // Keyboard handler
                    card.addEventListener('keydown', function(e) {
                        if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
                            e.preventDefault();
                            self.copyToClipboard(hexValue, card);
                        }
                    });
                    
                    // Touch feedback
                    if (Features.touch) {
                        card.addEventListener('touchstart', function() {
                            card.classList.add('gpu-accelerated');
                        }, Features.passiveEvents ? { passive: true } : false);
                        
                        card.addEventListener('touchend', function() {
                            setTimeout(function() {
                                card.classList.remove('gpu-accelerated');
                            }, 300);
                        }, Features.passiveEvents ? { passive: true } : false);
                    }
                }
            });

            // Gradient copy functionality
            var gradientCards = document.querySelectorAll('.gradient-card');
            gradientCards.forEach(function(card) {
                var gradientCode = card.querySelector('.gradient-info p');
                if (gradientCode) {
                    var gradientValue = gradientCode.textContent;
                    
                    card.style.cursor = 'pointer';
                    card.setAttribute('title', 'Click to copy gradient code');
                    card.setAttribute('role', 'button');
                    card.setAttribute('tabindex', '0');
                    
                    card.addEventListener('click', function() {
                        var fullGradient = 'background: linear-gradient(' + gradientValue + ');';
                        self.copyToClipboard(fullGradient, card);
                    });
                }
            });
        },

        copyToClipboard: function(text, element) {
            var self = this;
            
            // Modern clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() {
                    self.showToast('Copied ' + text + ' to clipboard!', 'success');
                    self.provideTouchFeedback(element);
                }).catch(function() {
                    self.fallbackCopyToClipboard(text, element);
                });
            } else {
                self.fallbackCopyToClipboard(text, element);
            }
        },

        fallbackCopyToClipboard: function(text, element) {
            var textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                var successful = document.execCommand('copy');
                if (successful) {
                    this.showToast('Copied ' + text + ' to clipboard!', 'success');
                    this.provideTouchFeedback(element);
                } else {
                    this.showToast('Failed to copy color code', 'error');
                }
            } catch (err) {
                this.showToast('Failed to copy color code', 'error');
            }
            
            document.body.removeChild(textArea);
        },

        provideTouchFeedback: function(element) {
            element.style.transform = 'scale(0.95)';
            setTimeout(function() {
                element.style.transform = '';
            }, 150);
        },

        /**
         * Enhanced form interactions with mobile optimization
         */
        setupFormInteractions: function() {
            var inputs = document.querySelectorAll('.form-input, .form-textarea');
            var self = this;
            
            inputs.forEach(function(input) {
                // Better mobile input handling
                input.addEventListener('focus', function() {
                    // Prevent zoom on iOS
                    if (Features.touch && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
                        input.style.fontSize = '16px';
                    }
                });
                
                input.addEventListener('blur', function() {
                    self.validateInput(input);
                    // Reset font size
                    input.style.fontSize = '';
                });
                
                input.addEventListener('input', Performance.debounce(function() {
                    if (input.classList.contains('error')) {
                        self.validateInput(input);
                    }
                }, 300));
                
                // Touch optimization
                if (Features.touch) {
                    input.addEventListener('touchstart', function() {
                        input.classList.add('gpu-accelerated');
                    }, Features.passiveEvents ? { passive: true } : false);
                }
            });

            // Newsletter form submission
            var newsletterForms = document.querySelectorAll('.newsletter-form');
            newsletterForms.forEach(function(form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    self.handleNewsletterSubmission(form);
                });
            });

            // Demo form submission
            var demoForm = document.querySelector('.demo-form');
            if (demoForm) {
                demoForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    self.handleDemoFormSubmission(demoForm);
                });
            }
        },

        validateInput: function(input) {
            var value = input.value.trim();
            var type = input.type;
            var isValid = true;
            var message = '';

            // Remove previous error styling
            input.classList.remove('error', 'success');
            this.removeErrorMessage(input);

            if (input.required && !value) {
                isValid = false;
                message = 'This field is required';
            } else if (type === 'email' && value) {
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
        },

        showErrorMessage: function(input, message) {
            var errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.cssText = 'color: var(--color-error, #dc3545); font-size: var(--mobile-font-sm, 14px); margin-top: var(--mobile-spacing-xs, 4px); font-weight: 500;';
            
            input.parentNode.appendChild(errorElement);
        },

        removeErrorMessage: function(input) {
            var errorMessage = input.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        },

        handleNewsletterSubmission: function(form) {
            var emailInput = form.querySelector('input[type="email"]');
            var submitButton = form.querySelector('button[type="submit"]');
            var self = this;
            
            if (this.validateInput(emailInput)) {
                submitButton.textContent = 'Subscribing...';
                submitButton.disabled = true;
                
                setTimeout(function() {
                    self.showToast('Successfully subscribed to newsletter!', 'success');
                    emailInput.value = '';
                    emailInput.classList.remove('success');
                    submitButton.textContent = 'Subscribe';
                    submitButton.disabled = false;
                }, 2000);
            }
        },

        handleDemoFormSubmission: function(form) {
            var inputs = form.querySelectorAll('.form-input, .form-textarea');
            var submitButton = form.querySelector('button[type="submit"]');
            var allValid = true;
            var self = this;

            inputs.forEach(function(input) {
                if (!self.validateInput(input)) {
                    allValid = false;
                }
            });

            if (allValid) {
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;
                
                setTimeout(function() {
                    self.showToast('Form submitted successfully!', 'success');
                    form.reset();
                    inputs.forEach(function(input) {
                        input.classList.remove('success', 'error');
                    });
                    submitButton.textContent = 'Submit Form';
                    submitButton.disabled = false;
                }, 2000);
            } else {
                this.showToast('Please fix the errors in the form', 'error');
            }
        },

        /**
         * Mobile-optimized animations
         */
        setupAnimationOnScroll: function() {
            if (!Features.intersectionObserver) {
                // Fallback for older browsers
                this.setupScrollBasedAnimations();
                return;
            }

            var observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-mobile-slide-in-up');
                        
                        // Stagger animations for better mobile performance
                        if (entry.target.classList.contains('color-card') || 
                            entry.target.classList.contains('component-demo') ||
                            entry.target.classList.contains('card')) {
                            
                            var delay = Math.random() * 100; // Reduced delay for mobile
                            setTimeout(function() {
                                entry.target.style.animationDelay = delay + 'ms';
                            }, delay);
                        }
                        
                        // Stop observing once animated
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            var animatableElements = document.querySelectorAll('.color-card, .component-demo, .card, .brand-card, .hero-demo, .pattern-demo');
            animatableElements.forEach(function(el) {
                observer.observe(el);
            });
        },

        setupScrollBasedAnimations: function() {
            var animatableElements = document.querySelectorAll('.color-card, .component-demo, .card, .brand-card, .hero-demo, .pattern-demo');
            var self = this;
            
            var checkVisible = Performance.throttle(function() {
                var windowHeight = window.innerHeight;
                var scrollTop = window.pageYOffset;
                
                animatableElements.forEach(function(el) {
                    if (el.classList.contains('animate-mobile-slide-in-up')) return;
                    
                    var elementTop = el.offsetTop;
                    var elementHeight = el.offsetHeight;
                    
                    if (scrollTop + windowHeight > elementTop + 100) {
                        el.classList.add('animate-mobile-slide-in-up');
                    }
                });
            }, 16);
            
            window.addEventListener('scroll', checkVisible, Features.passiveEvents ? { passive: true } : false);
            checkVisible(); // Check on load
        },

        /**
         * Theme toggle with mobile optimization
         */
        setupThemeToggle: function() {
            var themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '🌙';
            themeToggle.setAttribute('title', 'Toggle dark mode');
            themeToggle.setAttribute('aria-label', 'Toggle dark mode');
            
            var toggleStyles = 'position: fixed; bottom: 2rem; right: 2rem; width: ' + 
                (Features.touch ? '60px' : '50px') + '; height: ' + 
                (Features.touch ? '60px' : '50px') + 
                '; border-radius: 50%; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 1.5rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 9999; transition: all 0.3s ease; touch-action: manipulation;';
            
            themeToggle.style.cssText = toggleStyles;
            document.body.appendChild(themeToggle);

            var self = this;
            
            // Toggle functionality
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-theme');
                var isDark = document.body.classList.contains('dark-theme');
                themeToggle.innerHTML = isDark ? '☀️' : '🌙';
                
                // Store preference
                try {
                    localStorage.setItem('dark-theme', isDark);
                } catch (e) {
                    // Ignore localStorage errors
                }
            });

            // Load saved preference
            try {
                var savedTheme = localStorage.getItem('dark-theme');
                if (savedTheme === 'true') {
                    document.body.classList.add('dark-theme');
                    themeToggle.innerHTML = '☀️';
                }
            } catch (e) {
                // Ignore localStorage errors
            }

            // Touch feedback
            if (Features.touch) {
                themeToggle.addEventListener('touchstart', function() {
                    themeToggle.style.transform = 'scale(0.95)';
                }, Features.passiveEvents ? { passive: true } : false);
                
                themeToggle.addEventListener('touchend', function() {
                    themeToggle.style.transform = 'scale(1)';
                }, Features.passiveEvents ? { passive: true } : false);
            } else {
                themeToggle.addEventListener('mouseenter', function() {
                    themeToggle.style.transform = 'scale(1.1)';
                });

                themeToggle.addEventListener('mouseleave', function() {
                    themeToggle.style.transform = 'scale(1)';
                });
            }

            // Keyboard accessibility
            themeToggle.addEventListener('keydown', function(e) {
                if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
                    e.preventDefault();
                    themeToggle.click();
                }
            });
        },

        /**
         * Enhanced component interactions
         */
        setupComponentInteractions: function() {
            var buttons = document.querySelectorAll('.btn');
            var self = this;
            
            buttons.forEach(function(button) {
                button.addEventListener('click', function(e) {
                    if (!button.disabled) {
                        self.createRippleEffect(e, button);
                    }
                });
                
                // Touch optimization
                if (Features.touch) {
                    button.addEventListener('touchstart', function() {
                        button.classList.add('gpu-accelerated');
                    }, Features.passiveEvents ? { passive: true } : false);
                    
                    button.addEventListener('touchend', function() {
                        setTimeout(function() {
                            button.classList.remove('gpu-accelerated');
                        }, 300);
                    }, Features.passiveEvents ? { passive: true } : false);
                }
            });

            // Enhanced card interactions
            var cards = document.querySelectorAll('.card-hover');
            cards.forEach(function(card) {
                if (!Features.touch) {
                    card.addEventListener('mouseenter', function() {
                        card.style.transform = 'translateY(-8px) scale(1.02)';
                    });

                    card.addEventListener('mouseleave', function() {
                        card.style.transform = '';
                    });
                }
            });

            // Alert auto-dismiss with better mobile UX
            var alerts = document.querySelectorAll('.alert');
            alerts.forEach(function(alert) {
                var closeButton = document.createElement('button');
                closeButton.innerHTML = '×';
                closeButton.setAttribute('aria-label', 'Close alert');
                closeButton.style.cssText = 'background: none; border: none; font-size: 1.5rem; cursor: pointer; margin-left: auto; color: inherit; opacity: 0.7; transition: opacity 0.3s ease; padding: 0; min-width: 30px; min-height: 30px; display: flex; align-items: center; justify-content: center;';

                closeButton.addEventListener('click', function() {
                    alert.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(function() {
                        if (alert.parentNode) {
                            alert.parentNode.removeChild(alert);
                        }
                    }, 300);
                });

                // Touch feedback
                if (Features.touch) {
                    closeButton.addEventListener('touchstart', function() {
                        closeButton.style.opacity = '1';
                    }, Features.passiveEvents ? { passive: true } : false);
                } else {
                    closeButton.addEventListener('mouseenter', function() {
                        closeButton.style.opacity = '1';
                    });

                    closeButton.addEventListener('mouseleave', function() {
                        closeButton.style.opacity = '0.7';
                    });
                }

                alert.appendChild(closeButton);
            });
        },

        createRippleEffect: function(event, button) {
            var ripple = document.createElement('span');
            var rect = button.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height);
            var x = event.clientX - rect.left - size / 2;
            var y = event.clientY - rect.top - size / 2;

            ripple.style.cssText = 'position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.3); pointer-events: none; transform: scale(0); animation: ripple 0.6s linear; width: ' + size + 'px; height: ' + size + 'px; left: ' + x + 'px; top: ' + y + 'px;';

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(function() {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        },

        /**
         * Mobile-specific optimizations
         */
        setupMobileOptimizations: function() {
            // Prevent zoom on input focus for iOS
            if (Features.touch && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
                var meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                
                var existingMeta = document.querySelector('meta[name="viewport"]');
                if (existingMeta) {
                    existingMeta.parentNode.replaceChild(meta, existingMeta);
                } else {
                    document.head.appendChild(meta);
                }
            }

            // Handle orientation change
            window.addEventListener('orientationchange', Performance.debounce(function() {
                // Force repaint to fix mobile browser issues
                document.body.style.display = 'none';
                document.body.offsetHeight; // Trigger reflow
                document.body.style.display = '';
            }, 100));

            // Optimize touch events
            if (Features.touch) {
                // Prevent 300ms click delay on mobile
                var FastClick = function(layer, options) {
                    if (!layer || !layer.nodeType) return;
                    this.trackingClick = false;
                    this.trackingClickStart = 0;
                    this.targetElement = null;
                    this.touchStartX = 0;
                    this.touchStartY = 0;
                    this.lastTouchIdentifier = 0;
                    this.touchBoundary = options && options.touchBoundary || 10;
                    this.layer = layer;
                    this.tapDelay = options && options.tapDelay || 200;
                    this.tapTimeout = options && options.tapTimeout || 700;

                    if (!this.layer.addEventListener) return;

                    var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
                    var context = this;
                    for (var i = 0, l = methods.length; i < l; i++) {
                        context[methods[i]] = (function(method) {
                            return function() { return context[method].apply(context, arguments); };
                        }(methods[i]));
                    }

                    this.layer.addEventListener('click', this.onClick, true);
                    this.layer.addEventListener('touchstart', this.onTouchStart, false);
                    this.layer.addEventListener('touchmove', this.onTouchMove, false);
                    this.layer.addEventListener('touchend', this.onTouchEnd, false);
                    this.layer.addEventListener('touchcancel', this.onTouchCancel, false);
                };

                // Initialize FastClick for better mobile performance
                if (typeof FastClick !== 'undefined') {
                    new FastClick(document.body);
                }
            }

            // Optimize scroll performance
            var ticking = false;
            var lastKnownScrollPosition = 0;

            function updateScrollPosition() {
                lastKnownScrollPosition = window.scrollY;
                ticking = false;
            }

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    requestAnimationFrame(updateScrollPosition);
                    ticking = true;
                }
            }, Features.passiveEvents ? { passive: true } : false);
        },

        /**
         * Performance optimizations
         */
        setupPerformanceOptimizations: function() {
            // Lazy load images
            var images = document.querySelectorAll('img[data-src]');
            if (images.length > 0) {
                if (Features.intersectionObserver) {
                    var imageObserver = new IntersectionObserver(function(entries) {
                        entries.forEach(function(entry) {
                            if (entry.isIntersecting) {
                                var img = entry.target;
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                img.classList.add('loaded');
                                imageObserver.unobserve(img);
                            }
                        });
                    });

                    images.forEach(function(img) {
                        imageObserver.observe(img);
                    });
                } else {
                    // Fallback for older browsers
                    images.forEach(function(img) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    });
                }
            }

            // Preload critical resources
            var criticalResources = ['style-guide.css', 'style-guide-mobile.css'];
            criticalResources.forEach(function(resource) {
                var link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = resource;
                document.head.appendChild(link);
            });

            // Memory management
            this.setupMemoryManagement();
        },

        setupMemoryManagement: function() {
            var self = this;
            
            // Clean up event listeners on page unload
            window.addEventListener('beforeunload', function() {
                // Remove all event listeners we added
                self.cleanup();
            });

            // Passive memory monitoring
            if ('memory' in performance) {
                setInterval(function() {
                    if (performance.memory.usedJSHeapSize > 50000000) { // 50MB
                        console.warn('High memory usage detected');
                        // Trigger garbage collection if possible
                        if (window.gc) {
                            window.gc();
                        }
                    }
                }, 30000);
            }
        },

        cleanup: function() {
            // Remove dynamically created elements
            var overlay = document.querySelector('.nav-overlay');
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }

            var themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle && themeToggle.parentNode) {
                themeToggle.parentNode.removeChild(themeToggle);
            }
        },

        /**
         * Accessibility features
         */
        setupAccessibilityFeatures: function() {
            // Enhanced keyboard navigation
            document.addEventListener('keydown', function(e) {
                // Skip to main content with Alt+S
                if (e.altKey && e.keyCode === 83) {
                    e.preventDefault();
                    var mainContent = document.querySelector('main, #main, .main-content');
                    if (mainContent) {
                        mainContent.focus();
                        mainContent.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });

            // Announce dynamic content changes to screen readers
            this.setupARIALiveRegion();

            // Improve focus management
            this.improveFocusManagement();
        },

        setupARIALiveRegion: function() {
            var liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            liveRegion.id = 'aria-live-region';
            document.body.appendChild(liveRegion);
        },

        improveFocusManagement: function() {
            // Ensure all interactive elements are focusable
            var interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
            
            interactiveElements.forEach(function(element) {
                if (!element.hasAttribute('tabindex') && element.tagName !== 'INPUT' && element.tagName !== 'SELECT' && element.tagName !== 'TEXTAREA') {
                    element.setAttribute('tabindex', '0');
                }
            });

            // Add visible focus indicators
            var style = document.createElement('style');
            style.textContent = '.focus-visible { outline: 3px solid #667eea; outline-offset: 2px; }';
            document.head.appendChild(style);

            // Apply focus-visible class for better focus indicators
            document.addEventListener('keydown', function(e) {
                if (e.keyCode === 9) { // Tab key
                    document.body.classList.add('using-keyboard');
                }
            });

            document.addEventListener('mousedown', function() {
                document.body.classList.remove('using-keyboard');
            });
        },

        /**
         * Enhanced toast notification system
         */
        showToast: function(message, type) {
            type = type || 'info';
            var toast = document.createElement('div');
            toast.className = 'toast toast-' + type;
            toast.textContent = message;
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            
            var colors = {
                success: '#28a745',
                error: '#dc3545',
                warning: '#fd7e14',
                info: '#17a2b8'
            };

            var toastStyles = 'position: fixed; top: 2rem; right: 2rem; padding: 1rem 1.5rem; border-radius: 12px; color: white; font-weight: 500; z-index: 10000; transform: translateX(100%); transition: transform 0.3s ease; max-width: 300px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); background: ' + (colors[type] || colors.info) + ';';
            
            // Mobile adjustments
            if (Features.touch && window.innerWidth <= 768) {
                toastStyles = toastStyles.replace('top: 2rem; right: 2rem;', 'top: 1rem; right: 1rem; left: 1rem; max-width: none;');
            }
            
            toast.style.cssText = toastStyles;

            document.body.appendChild(toast);

            // Animate in
            setTimeout(function() {
                toast.style.transform = 'translateX(0)';
            }, 100);

            // Auto remove
            setTimeout(function() {
                toast.style.transform = Features.touch && window.innerWidth <= 768 ? 'translateX(100vw)' : 'translateX(100%)';
                setTimeout(function() {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);

            // Announce to screen readers
            var liveRegion = document.getElementById('aria-live-region');
            if (liveRegion) {
                liveRegion.textContent = message;
            }
        }
    };

    // Initialize the app
    window.StyleGuideApp = StyleGuideApp;
    
    // Auto-initialize when DOM is ready
    new StyleGuideApp();

    // Add CSS for mobile optimizations
    var mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
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
        
        .gpu-accelerated {
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            will-change: transform;
        }
        
        .using-keyboard button:focus,
        .using-keyboard a:focus,
        .using-keyboard input:focus,
        .using-keyboard select:focus,
        .using-keyboard textarea:focus {
            outline: 3px solid #667eea !important;
            outline-offset: 2px !important;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
            .theme-toggle {
                bottom: 1rem !important;
                right: 1rem !important;
                width: 50px !important;
                height: 50px !important;
            }
            
            .toast {
                font-size: 14px !important;
                padding: 0.75rem 1rem !important;
            }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
            .btn, .form-input, .form-select, .form-textarea {
                border-width: 3px !important;
            }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    
    document.head.appendChild(mobileStyles);

})(window, document);