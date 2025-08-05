// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarScroll();
    initCopyToClipboard();
    initParticleEffects();
    initScreenshotsGallery();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .staff-card, .timeline-item, .feature-item, .guide-item, .community-stat, .community-feature, .event-card, .screenshot-item, .highlight-card, .comparison-table tr');
    animateElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for enhanced styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Copy IP Address to Clipboard
function initCopyToClipboard() {
    // Copy to clipboard function
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).then(() => {
                showNotification('IP адрес скопирован!', 'success');
            }).catch(() => {
                fallbackCopyToClipboard(text);
            });
        } else {
            return fallbackCopyToClipboard(text);
        }
    }
    
    // Fallback for older browsers
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('IP адрес скопирован!', 'success');
        } catch (err) {
            showNotification('Ошибка копирования', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    // Add click handlers to IP addresses
    document.querySelectorAll('.ip-address').forEach(element => {
        element.addEventListener('click', function() {
            copyToClipboard(this.textContent);
        });
    });
    
    // Add click handler to hero button
    const heroButton = document.querySelector('.btn-primary');
    if (heroButton) {
        heroButton.addEventListener('click', function() {
            copyToClipboard('gromover.pw');
        });
    }
}

// Global copyIP function for onclick attributes
function copyIP(ip = 'gromover.pw') {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(ip).then(() => {
            showNotification('IP адрес скопирован!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(ip);
        });
    } else {
        fallbackCopyToClipboard(ip);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Particle Effects
function initParticleEffects() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: ${Math.random() > 0.5 ? '#e94560' : '#ff6b9d'};
        border-radius: 50%;
        pointer-events: none;
        opacity: ${Math.random() * 0.5 + 0.2};
        animation: float ${Math.random() * 10 + 10}s linear infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
            createParticle(container);
        }
    }, 15000);
}

// Typing Effect for Hero Title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    typeWriter();
}

// Minecraft Block Animation
function initMinecraftBlock() {
    const block = document.querySelector('.minecraft-block');
    if (!block) return;
    
    // Add hover effect
    block.addEventListener('mouseenter', () => {
        block.style.animationDuration = '5s';
    });
    
    block.addEventListener('mouseleave', () => {
        block.style.animationDuration = '20s';
    });
    
    // Add click effect
    block.addEventListener('click', () => {
        block.style.transform = 'scale(1.1) rotateY(180deg)';
        setTimeout(() => {
            block.style.transform = '';
        }, 500);
    });
}

// Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 50);
    };
    
    // Observe stats for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

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

// Screenshots Gallery
function initScreenshotsGallery() {
    const galleryBtns = document.querySelectorAll('.gallery-btn');
    const galleryImgs = document.querySelectorAll('.gallery-img');
    
    if (galleryBtns.length === 0 || galleryImgs.length === 0) return;
    
    galleryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const slideIndex = btn.getAttribute('data-slide');
            
            // Remove active class from all buttons and images
            galleryBtns.forEach(b => b.classList.remove('active'));
            galleryImgs.forEach(img => img.classList.remove('active'));
            
            // Add active class to clicked button and corresponding image
            btn.classList.add('active');
            galleryImgs[slideIndex].classList.add('active');
        });
    });
}

// Console Welcome Message
console.log('%c🎮 GromoverCreative', 'color: #e94560; font-size: 20px; font-weight: bold; font-family: "JetBrains Mono", monospace;');
console.log('%cДобро пожаловать в консоль разработчика!', 'color: #ff6b9d; font-size: 14px; font-family: "JetBrains Mono", monospace;');
console.log('%cIP: gromover.pw', 'color: #8b5cf6; font-size: 12px; font-family: "JetBrains Mono", monospace;');
console.log('%cDiscord: discord.gg/NYWQt3tr2h', 'color: #8b5cf6; font-size: 12px; font-family: "JetBrains Mono", monospace;'); 