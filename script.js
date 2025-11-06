// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormValidation();
    initializeAccessibilityFeatures();
    initializeSmoothScrolling();
    initializeParticleSystem();
    initializeTypingEffect();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA attribute
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('interest-grid') || 
                    entry.target.classList.contains('principles-grid')) {
                    const items = entry.target.querySelectorAll('.interest-item, .principle-card');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(`
        .section-header,
        .about-text,
        .about-highlights,
        .research-description,
        .research-interests,
        .accessibility-intro,
        .principles-grid,
        .interest-grid,
        .contact-info,
        .contact-form-section,
        .highlight-card,
        .principle-card,
        .interest-item
    `);

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Initialize grid items with hidden state
    document.querySelectorAll('.interest-item, .principle-card').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Form validation and submission
function initializeFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Real-time validation
    function validateField(input, validationFn, errorMessage) {
        const errorElement = document.getElementById(`${input.id}-error`);
        
        function validate() {
            if (validationFn(input.value)) {
                input.classList.remove('error');
                input.classList.add('valid');
                errorElement.textContent = '';
                return true;
            } else {
                input.classList.remove('valid');
                input.classList.add('error');
                errorElement.textContent = errorMessage;
                return false;
            }
        }

        input.addEventListener('blur', validate);
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validate();
            }
        });

        return validate;
    }

    // Validation functions
    const validateName = validateField(
        nameInput,
        value => value.trim().length >= 2,
        'Please enter your name (at least 2 characters)'
    );

    const validateEmail = validateField(
        emailInput,
        value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        'Please enter a valid email address'
    );

    const validateMessage = validateField(
        messageInput,
        value => value.trim().length >= 10,
        'Please enter a message (at least 10 characters)'
    );

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        if (isNameValid && isEmailValid && isMessageValid) {
            // Simulate form submission
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitButton.style.background = 'linear-gradient(45deg, #00b894, #55a3ff)';
                
                setTimeout(() => {
                    form.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                    
                    // Clear validation classes
                    form.querySelectorAll('.valid, .error').forEach(el => {
                        el.classList.remove('valid', 'error');
                    });
                }, 2000);
            }, 1000);
        } else {
            // Focus on first invalid field
            const firstInvalid = form.querySelector('.error');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });
}

// Accessibility features
function initializeAccessibilityFeatures() {
    // High contrast toggle
    const contrastToggle = document.querySelector('.accessibility-toggle');
    if (contrastToggle) {
        contrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            
            // Save preference
            localStorage.setItem('highContrast', isHighContrast);
            
            // Update button text
            const icon = contrastToggle.querySelector('i');
            if (isHighContrast) {
                contrastToggle.innerHTML = '<i class="fas fa-sun"></i> Normal Contrast';
            } else {
                contrastToggle.innerHTML = '<i class="fas fa-adjust"></i> High Contrast';
            }
        });

        // Load saved preference
        if (localStorage.getItem('highContrast') === 'true') {
            contrastToggle.click();
        }
    }

    // Keyboard navigation enhancement
    document.addEventListener('keydown', (e) => {
        // Skip to main content with 'S' key
        if (e.key === 's' || e.key === 'S') {
            if (e.ctrlKey || e.metaKey) return; // Don't interfere with browser shortcuts
            
            const mainContent = document.getElementById('main-content');
            if (mainContent && document.activeElement !== mainContent) {
                e.preventDefault();
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Close mobile menu with Escape
        if (e.key === 'Escape') {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        }
    });

    // Focus management for mobile menu
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                // Menu was just opened, focus first link
                setTimeout(() => {
                    const firstLink = navMenu.querySelector('.nav-link');
                    if (firstLink) firstLink.focus();
                }, 100);
            }
        });
    }

    // Announce page changes for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    document.body.appendChild(announcer);

    // Announce section changes
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionTitle = entry.target.querySelector('h2');
                if (sectionTitle) {
                    announcer.textContent = `Now viewing: ${sectionTitle.textContent}`;
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => sectionObserver.observe(section));
}

// Enhanced particle system
function initializeParticleSystem() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;

    // Create additional floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        heroParticles.appendChild(particle);
    }

    // Add CSS for floating particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Typing effect for hero section
function initializeTypingEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;

    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    heroSubtitle.style.borderRight = '2px solid rgba(255, 255, 255, 0.7)';

    let index = 0;
    function typeText() {
        if (index < text.length) {
            heroSubtitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 50);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroSubtitle.style.borderRight = 'none';
            }, 1000);
        }
    }

    // Start typing effect after a delay
    setTimeout(typeText, 1000);
}

// Intersection Observer for counting animations
function initializeCountingAnimations() {
    const countElements = document.querySelectorAll('[data-count]');
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = parseInt(element.dataset.count);
                let currentValue = 0;
                const increment = finalValue / 100;
                const duration = 2000; // 2 seconds
                const stepTime = duration / 100;

                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        element.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(currentValue);
                    }
                }, stepTime);

                countObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    countElements.forEach(el => countObserver.observe(el));
}

// Mouse parallax effect for hero section
function initializeParallaxEffect() {
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.float-element');
    
    if (!hero || floatingElements.length === 0) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const deltaX = (mouseX - centerX) / centerX;
        const deltaY = (mouseY - centerY) / centerY;

        floatingElements.forEach((element, index) => {
            const speed = parseFloat(element.dataset.speed) || 1;
            const moveX = deltaX * speed * 10;
            const moveY = deltaY * speed * 10;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        floatingElements.forEach(element => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

// Progress bar for reading progress
function initializeReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Service Worker registration for PWA features
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Performance monitoring
function initializePerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            if (loadTime > 3000) {
                console.warn('Page load time is slow:', loadTime + 'ms');
            }
        });
    }
}

// Error handling and reporting
function initializeErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // In production, you might want to send this to an error reporting service
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        // In production, you might want to send this to an error reporting service
    });
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeParallaxEffect();
    initializeReadingProgress();
    initializeLazyLoading();
    initializeCountingAnimations();
    initializePerformanceMonitoring();
    initializeErrorHandling();
    
    // Initialize service worker in production
    if (location.protocol === 'https:') {
        registerServiceWorker();
    }
});

// Utility functions
const utils = {
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: function(func, limit) {
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
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export utils for other scripts
window.CharlotteUtils = utils;