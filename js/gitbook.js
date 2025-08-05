// GitBook Style JavaScript for GromoverCreative Guides

document.addEventListener('DOMContentLoaded', function() {
    initGitBookFeatures();
});

function initGitBookFeatures() {
    initSidebarNavigation();
    initCodeBlockHighlighting();
    initScrollSpy();
    initSearchHighlight();
    initMobileMenu();
}

// Sidebar Navigation
function initSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const currentPath = window.location.pathname;
    
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
        
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

// Code Block Highlighting
function initCodeBlockHighlighting() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋';
        copyButton.title = 'Копировать код';
        
        copyButton.addEventListener('click', function() {
            const codeContent = block.querySelector('.code-content').textContent;
            copyToClipboard(codeContent);
            
            // Visual feedback
            this.innerHTML = '✅';
            this.style.background = 'var(--accent-primary)';
            
            setTimeout(() => {
                this.innerHTML = '📋';
                this.style.background = '';
            }, 2000);
        });
        
        const codeHeader = block.querySelector('.code-header');
        if (codeHeader) {
            codeHeader.appendChild(copyButton);
        }
    });
}

// Scroll Spy for Navigation
function initScrollSpy() {
    const sections = document.querySelectorAll('h2, h3');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    
    if (sections.length && sidebarLinks.length) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-20% 0px -80% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    updateActiveNavLink(id);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            if (section.id) {
                observer.observe(section);
            }
        });
    }
}

function updateActiveNavLink(sectionId) {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Search Highlight
function initSearchHighlight() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Поиск по странице...';
    searchInput.className = 'search-input';
    
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader) {
        sidebarHeader.appendChild(searchInput);
    }
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const contentElements = document.querySelectorAll('.content p, .content h2, .content h3, .content li');
        
        contentElements.forEach(element => {
            const text = element.textContent;
            if (searchTerm && text.toLowerCase().includes(searchTerm)) {
                element.style.background = 'rgba(233, 69, 96, 0.2)';
                element.style.borderRadius = '4px';
                element.style.padding = '2px 4px';
            } else {
                element.style.background = '';
                element.style.borderRadius = '';
                element.style.padding = '';
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-button';
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.title = 'Открыть меню';
    
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && mainContent) {
        mainContent.insertBefore(mobileMenuButton, mainContent.firstChild);
        
        mobileMenuButton.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                sidebar.classList.remove('active');
                mobileMenuButton.innerHTML = '☰';
            }
        });
    }
}

// Utility Functions
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Код скопирован в буфер обмена!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

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
        showNotification('Код скопирован в буфер обмена!', 'success');
    } catch (err) {
        showNotification('Не удалось скопировать код', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = 'var(--accent-primary)';
    } else if (type === 'error') {
        notification.style.background = '#dc3545';
    } else {
        notification.style.background = 'var(--minecraft-violet)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for new elements
const additionalStyles = `
    .copy-button {
        background: var(--border-color);
        border: none;
        color: var(--text-secondary);
        padding: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: var(--transition-fast);
        margin-left: auto;
    }
    
    .copy-button:hover {
        background: var(--accent-primary);
        color: white;
    }
    
    .search-input {
        width: 100%;
        padding: 0.75rem;
        background: var(--tertiary-bg);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-secondary);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        margin-top: 1rem;
    }
    
    .search-input:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.2);
    }
    
    .mobile-menu-button {
        display: none;
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 200;
        background: var(--accent-primary);
        border: none;
        color: white;
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: var(--transition-fast);
    }
    
    .mobile-menu-button:hover {
        background: var(--accent-secondary);
        transform: scale(1.05);
    }
    
    @media (max-width: 768px) {
        .mobile-menu-button {
            display: block;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Console welcome message
console.log('%c🎮 GromoverCreative Guides', 'color: #e94560; font-size: 20px; font-weight: bold; font-family: "JetBrains Mono", monospace;');
console.log('%cДобро пожаловать в документацию Creative+!', 'color: #ff6b9d; font-size: 14px; font-family: "JetBrains Mono", monospace;');
console.log('%cИзучайте кодинг-на-блоках и создавайте удивительные проекты!', 'color: #8b5cf6; font-size: 12px; font-family: "JetBrains Mono", monospace;'); 