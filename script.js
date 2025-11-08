// ================================
// NAVIGATION
// ================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

// Toggle mobile menu
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

// ================================
// SMOOTH SCROLLING
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ================================
// ANIMATED COUNTERS
// ================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Lower = faster

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;

        function updateCounter() {
            const current = +counter.innerText;
            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCounter, 10);
            } else {
                counter.innerText = target + (target === 1000 ? '+' : '');
            }
        }

        updateCounter();
    });
}

// Trigger counter animation when scrolling into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            animateCounters();
            entry.target.classList.add('counted');
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    counterObserver.observe(heroStats);
}

// ================================
// PORTFOLIO TABS
// ================================

const tabButtons = document.querySelectorAll('.tab-btn');
const portfolioContents = document.querySelectorAll('.portfolio-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        portfolioContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Show corresponding content
        const tabId = button.getAttribute('data-tab');
        const content = document.getElementById(tabId);
        if (content) {
            content.classList.add('active');
        }
    });
});

// ================================
// TESTIMONIALS SLIDER
// ================================

class TestimonialsSlider {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.prevBtn = document.querySelector('.slider-btn.prev');
        this.nextBtn = document.querySelector('.slider-btn.next');
        this.dotsContainer = document.querySelector('.slider-dots');
        this.currentIndex = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        if (this.testimonials.length === 0) return;

        this.createDots();
        this.setupEventListeners();
        this.startAutoPlay();
    }

    createDots() {
        this.testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Pause autoplay on hover
        const slider = document.querySelector('.testimonials-slider');
        slider?.addEventListener('mouseenter', () => this.stopAutoPlay());
        slider?.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goToSlide(index) {
        // Remove active from all
        this.testimonials.forEach(card => card.classList.remove('active'));
        document.querySelectorAll('.slider-dot').forEach(dot => dot.classList.remove('active'));

        // Add active to target
        this.testimonials[index].classList.add('active');
        document.querySelectorAll('.slider-dot')[index].classList.add('active');

        this.currentIndex = index;
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.stopAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize testimonials slider
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsSlider();
});

// ================================
// CONTACT FORM
// ================================

const contactForm = document.getElementById('contactForm');
const formMessage = document.querySelector('.form-message');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.submit-btn');
    const formData = new FormData(contactForm);

    // Show loading state
    submitBtn.classList.add('loading');
    formMessage.style.display = 'none';

    // Get form values
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        service: formData.get('service'),
        message: formData.get('message'),
        earlyClient: formData.get('earlyClient') === 'on'
    };

    try {
        // Simulate API call (replace with actual endpoint)
        await simulateFormSubmission(data);

        // Show success message
        showMessage('success', 'Thank you for your message! I\'ll get back to you within 24 hours.');
        contactForm.reset();

        // Track conversion (if using analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                'form_name': 'contact_form',
                'service_type': data.service
            });
        }

    } catch (error) {
        // Show error message
        showMessage('error', 'Oops! Something went wrong. Please try emailing me directly at tayyab.khattak@infinityservicesoy.com');
        console.error('Form submission error:', error);
    } finally {
        submitBtn.classList.remove('loading');
    }
});

function showMessage(type, message) {
    formMessage.className = 'form-message ' + type;
    formMessage.textContent = message;
    formMessage.style.display = 'block';

    // Auto-hide after 10 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 10000);
}

// Simulate form submission (replace with actual implementation)
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        // For demo purposes - always succeeds after 2 seconds
        setTimeout(() => {
            console.log('Form data:', data);
            
            // In production, replace with actual fetch call:
            /*
            fetch('YOUR_FORM_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
            */
            
            resolve({ success: true });
        }, 2000);
    });
}

// ================================
// SCROLL ANIMATIONS
// ================================

const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-card, .about-grid, .contact-grid');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
};

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', animateOnScroll);

// ================================
// SERVICE CARD HOVER EFFECTS
// ================================

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ================================
// EARLY CLIENT DISCOUNT HIGHLIGHT
// ================================

const earlyClientCheckbox = document.getElementById('earlyClient');
const serviceSelect = document.getElementById('service');

earlyClientCheckbox?.addEventListener('change', function() {
    if (this.checked) {
        // Highlight AI/No-code services
        const aiOptions = ['ai', 'nocode', 'both'];
        const selectedService = serviceSelect.value;
        
        if (!aiOptions.includes(selectedService)) {
            // Suggest selecting AI service for discount
            showMessage('info', '💡 Early client discount applies to AI Agent and No-Code SaaS services!');
        }
    }
});

// ================================
// PORTFOLIO FILTER ANIMATION
// ================================

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const content = document.querySelector('.portfolio-content.active');
        if (content) {
            // Fade out
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            
            // Fade in after delay
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 100);
        }
    });
});

// ================================
// CALL-TO-ACTION PULSE
// ================================

function pulseCtaButtons() {
    const ctaButtons = document.querySelectorAll('.hero-cta .btn-primary, .service-cta');
    
    setInterval(() => {
        ctaButtons.forEach(btn => {
            btn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        });
    }, 5000);
}

// Start CTA pulse
document.addEventListener('DOMContentLoaded', pulseCtaButtons);

// ================================
// KEYBOARD NAVIGATION
// ================================

document.addEventListener('keydown', (e) => {
    // Left arrow - previous testimonial
    if (e.key === 'ArrowLeft') {
        document.querySelector('.slider-btn.prev')?.click();
    }
    // Right arrow - next testimonial
    if (e.key === 'ArrowRight') {
        document.querySelector('.slider-btn.next')?.click();
    }
});

// ================================
// FORM VALIDATION ENHANCEMENT
// ================================

const formInputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.required && !this.value) {
            this.style.borderColor = 'var(--error-red)';
        } else {
            this.style.borderColor = 'var(--gray-200)';
        }
    });

    input.addEventListener('input', function() {
        if (this.value) {
            this.style.borderColor = 'var(--success-green)';
        }
    });
});

// ================================
// PRELOAD OPTIMIZATION
// ================================

// Lazy load portfolio images if you add real images later
document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// ================================
// ANALYTICS TRACKING
// ================================

// Track button clicks
document.querySelectorAll('.btn-primary, .btn-secondary, .service-cta').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'button_click', {
                'button_text': buttonText,
                'button_location': this.closest('section')?.id || 'unknown'
            });
        }
        
        console.log('Button clicked:', buttonText);
    });
});

// Track service card interest
serviceCards.forEach((card, index) => {
    card.addEventListener('click', function() {
        const serviceName = this.querySelector('h3')?.textContent;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_interest', {
                'service_name': serviceName,
                'service_index': index
            });
        }
        
        console.log('Service interest:', serviceName);
    });
});

// ================================
// ACCESSIBILITY ENHANCEMENTS
// ================================

// Add skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#hero';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-blue);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 9999;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});
document.body.prepend(skipLink);

// Announce page changes for screen readers
function announcePageChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
}

// ================================
// PERFORMANCE MONITORING
// ================================

// Log page load time
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_performance', {
            'load_time': loadTime,
            'page_path': window.location.pathname
        });
    }
});

// ================================
// EASTER EGG (Optional)
// ================================

let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ================================
// CONSOLE MESSAGE
// ================================

console.log(`
%c👋 Hello there, fellow developer!

%cLooking at the code? Feel free to reach out if you'd like to collaborate!

%c📧 tayyab.khattak@infinityservicesoy.com
🔗 linkedin.com/in/tayyabmasoodkhattak

Built with: HTML, CSS, JavaScript
No frameworks - Just clean, performant code!
`,
'font-size: 20px; font-weight: bold; color: #2563eb;',
'font-size: 14px; color: #475569;',
'font-size: 12px; color: #94a3b8; font-family: monospace;'
);

// ================================
// UTILITY FUNCTIONS
// ================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth reveal on scroll (throttled)
const handleScroll = throttle(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
            element.classList.add('revealed');
        }
    });
}, 100);

window.addEventListener('scroll', handleScroll);
