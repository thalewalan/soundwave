// ===== DOM ELEMENTS =====
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const scrollTopBtn = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const yearEl = document.getElementById('year');

// ===== THEME TOGGLE WITH LOCALSTORAGE =====
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.setAttribute('data-theme', 'dark');
    }

    themeToggle?.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
};

// ===== NAVIGATION WITH SCROLL EFFECT =====
const initNavigation = () => {
    const nav = document.querySelector('.glass-nav');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');
    const btnContact = document.querySelector('.btn-contact');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }

        if (scrollTopBtn) {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    mobileToggle?.addEventListener('click', () => {
        mobileMenuOverlay?.classList.add('active');
        document.body.classList.add('menu-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
    });

    const closeMobileMenu = () => {
        mobileMenuOverlay?.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
    };

    mobileMenuClose?.addEventListener('click', closeMobileMenu);

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    btnContact?.addEventListener('click', closeMobileMenu);

    mobileMenuOverlay?.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOverlay?.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// ===== REVEAL ANIMATIONS ON SCROLL =====
const initScrollReveal = () => {
    const elements = document.querySelectorAll('.glass-card, .service-card, .testimonial-card, .timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
};

// ===== CONTACT FORM HANDLING =====
const initContactForm = () => {
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            contactForm.style.display = 'none';
            formSuccess?.classList.add('show');
            contactForm.reset();
            console.log('Form submitted:', data);

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Oops! Something went wrong. Please try again or contact us directly.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
};

window.resetForm = () => {
    if (contactForm && formSuccess) {
        contactForm.style.display = 'flex';
        formSuccess.classList.remove('show');
    }
};

// ===== COOKIE BANNER =====
const initCookieBanner = () => {
    if (localStorage.getItem('cookiesAccepted')) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
    <p>We use cookies to enhance your experience and analyze our traffic. <a href="#" style="color:var(--accent-primary);text-decoration:underline">Learn more</a></p>
    <div class="cookie-buttons">
      <button class="cookie-btn decline">Decline</button>
      <button class="cookie-btn accept">Accept All</button>
    </div>
  `;
    document.body.appendChild(banner);

    setTimeout(() => banner.classList.add('show'), 1000);

    const acceptBtn = banner.querySelector('.accept');
    const declineBtn = banner.querySelector('.decline');

    const hideBanner = (accepted) => {
        localStorage.setItem('cookiesAccepted', accepted ? 'true' : 'false');
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 400);
    };

    acceptBtn?.addEventListener('click', () => hideBanner(true));
    declineBtn?.addEventListener('click', () => hideBanner(false));
};

// ===== TESTIMONIALS SLIDER =====
const initTestimonialsSlider = () => {
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const testiPrev = document.getElementById('testiPrev');
    const testiNext = document.getElementById('testiNext');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');

    if (!testimonialsTrack || !testiPrev || !testiNext) return;

    const testimonialItems = testimonialsTrack.querySelectorAll('.testimonial-item');
    let currentTestimonial = 0;
    const totalTestimonials = testimonialItems.length;

    if (totalTestimonials === 0) return;

    const updateCounter = () => {
        if (currentSlideEl && totalSlidesEl) {
            currentSlideEl.textContent = String(currentTestimonial + 1).padStart(2, '0');
            totalSlidesEl.textContent = String(totalTestimonials).padStart(2, '0');
        }
    };

    const showTestimonial = (index) => {
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
        updateCounter();
    };

    const nextTestimonial = () => {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    };

    const prevTestimonial = () => {
        currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
        showTestimonial(currentTestimonial);
    };

    testiNext.addEventListener('click', nextTestimonial);
    testiPrev.addEventListener('click', prevTestimonial);

    setInterval(nextTestimonial, 6000);
    updateCounter();
    showTestimonial(0);
};

// ===== HERO IMAGE SLIDER =====
const initHeroSlider = () => {
    const sliderTrack = document.getElementById('heroSliderTrack');
    if (!sliderTrack) return;

    const slides = sliderTrack.querySelectorAll('.slider-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    const nextSlide = () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    };

    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
};

// ===== STATS COUNTING ANIMATION =====
const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.getAttribute('data-target'), 10);
                const duration = 2500;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        statNumber.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCount);
                    } else {
                        statNumber.textContent = target.toLocaleString();
                    }
                };

                updateCount();
                statObserver.unobserve(statNumber);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => statObserver.observe(stat));
};

// ===== DYNAMIC YEAR =====
const updateYear = () => {
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
};

// ===== SIMPLE PARTICLES (Hero Background) =====
const initParticles = () => {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: var(--accent-primary);
      border-radius: 50%;
      opacity: ${Math.random() * 0.5 + 0.1};
      animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
    `;
        container.appendChild(particle);
    }

    if (!document.querySelector('#particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particle-keyframes';
        style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(-10px) translateX(-10px); }
        75% { transform: translateY(-30px) translateX(5px); }
      }
    `;
        document.head.appendChild(style);
    }
};

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                if (navLinks?.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileToggle.textContent = '☰';
                }

                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ===== KEYBOARD NAVIGATION SUPPORT =====
const initKeyboardNav = () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks?.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.textContent = '☰';
        }
    });
};

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    animateStats();
    initScrollReveal();
    initContactForm();
    initCookieBanner();
    updateYear();
    initParticles();
    initHeroSlider();
    initTestimonialsSlider();
    initSmoothScroll();
    initKeyboardNav();

    document.querySelectorAll('.service-card, .testimonial-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });
});
