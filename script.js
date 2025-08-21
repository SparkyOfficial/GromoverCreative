// The New Order: Last Days of Europe - Tube TV Interface
document.addEventListener('DOMContentLoaded', function() {
    initializeTNOInterface();
});

function initializeTNOInterface() {
    addTubeTVEffects();
    addMilitaryNotifications();
    addScrollAnimations();
    addInteractiveElements();
    addEvidenceSystem();
    addKeyboardShortcuts();
    addLoadingScreen();
}

function addTubeTVEffects() {
    // Add tube TV scanlines effect
    const scanlines = document.createElement('div');
    scanlines.className = 'tube-tv-scanlines';
    scanlines.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(135, 206, 235, 0.02) 2px,
            rgba(135, 206, 235, 0.02) 4px
        );
        pointer-events: none;
        z-index: 1;
        animation: scanlineMove 10s linear infinite;
    `;
    document.body.appendChild(scanlines);

    // Add CSS for tube TV animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scanlineMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(4px); }
        }
        
        .tube-tv-text {
            font-family: 'Source Code Pro', monospace;
            color: #87CEEB;
            text-shadow: 0 0 5px #87CEEB;
        }
        
        .military-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            border: 2px solid #87CEEB;
            color: #87CEEB;
            padding: 15px 20px;
            font-family: 'Source Code Pro', monospace;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 0 20px rgba(135, 206, 235, 0.3);
        }
        
        .military-notification.show {
            transform: translateX(0);
        }
        
        .military-notification.critical {
            border-color: #FF6B6B;
            color: #FF6B6B;
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
        }
        
        .evidence-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .evidence-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .evidence-content {
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            border: 2px solid #87CEEB;
            padding: 30px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            position: relative;
        }
        
        .evidence-content img {
            max-width: 100%;
            height: auto;
            border: 1px solid #87CEEB;
        }
        
        .evidence-close {
            position: absolute;
            top: 10px;
            right: 15px;
            color: #87CEEB;
            font-size: 1.5rem;
            cursor: pointer;
            font-family: 'Source Code Pro', monospace;
        }
        
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10002;
            color: #87CEEB;
            font-family: 'Source Code Pro', monospace;
        }
        
        .loading-text {
            font-size: 1.2rem;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .loading-bar {
            width: 300px;
            height: 4px;
            background: #1a1a1a;
            border: 1px solid #87CEEB;
            position: relative;
            overflow: hidden;
        }
        
        .loading-progress {
            height: 100%;
            background: #87CEEB;
            width: 0%;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px #87CEEB;
        }
        
        .tube-tv-glow {
            animation: tubeTVGlow 3s ease-in-out infinite alternate;
        }
        
        @keyframes tubeTVGlow {
            0% { text-shadow: 0 0 5px #87CEEB, 0 0 10px #87CEEB; }
            100% { text-shadow: 0 0 10px #87CEEB, 0 0 20px #87CEEB, 0 0 30px #87CEEB; }
        }
    `;
    document.head.appendChild(style);

    // Add tube TV glow effect to important elements
    document.querySelectorAll('.hero-title, .section-title, .problem-card h3').forEach(el => {
        el.classList.add('tube-tv-glow');
    });
}

function addMilitaryNotifications() {
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'military-notifications';
    document.body.appendChild(notificationContainer);
}

function showMilitaryNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `military-notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.2rem;">${type === 'critical' ? '⚠' : '⚡'}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.getElementById('military-notifications').appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('problem-card')) {
                    showMilitaryNotification('ДОКУМЕНТ ОБНАРУЖЕН', 'info');
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.problem-card, .section-title, .hero-title').forEach(el => {
        observer.observe(el);
    });
}

function addInteractiveElements() {
    // Add hover effects to evidence tags
    document.querySelectorAll('.evidence-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.boxShadow = '0 0 15px rgba(135, 206, 235, 0.5)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.boxShadow = 'none';
        });
    });

    // Add click effects to threat quotes
    document.querySelectorAll('.threat-quote').forEach(quote => {
        quote.addEventListener('click', () => {
            showMilitaryNotification('КРИТИЧЕСКОЕ СВИДЕТЕЛЬСТВО АКТИВИРОВАНО', 'critical');
            playMilitarySound();
        });
    });

    // Add form submission handling
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showMilitaryNotification('ДАННЫЕ ОТПРАВЛЕНЫ В ЦЕНТРАЛЬНЫЙ АРХИВ', 'info');
        });
    });
}

function addEvidenceSystem() {
    // Add click listeners to evidence hotspots
    document.querySelectorAll('.evidence-hotspot').forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            const screenshot = hotspot.dataset.screenshot;
            showEvidenceModal(screenshot);
        });
    });

    // Add dossier action buttons
    document.querySelectorAll('#view-all-dossiers, #export-dossiers, #evidence-search').forEach(btn => {
        btn.addEventListener('click', () => {
            handleDossierAction(btn.id);
        });
    });
}

function showEvidenceModal(screenshot) {
    const modal = document.createElement('div');
    modal.className = 'evidence-modal';
    modal.innerHTML = `
        <div class="evidence-content">
            <div class="evidence-close" onclick="this.parentElement.parentElement.remove()">✕</div>
            <h3 style="color: #87CEEB; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px;">ДОКАЗАТЕЛЬСТВО</h3>
            <img src="${screenshot}" alt="Evidence" style="max-width: 100%; height: auto;">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

function handleDossierAction(action) {
    const actions = {
        'view-all-dossiers': 'ПРОСМОТР ВСЕХ ДОСЬЕ ИНИЦИИРОВАН',
        'export-dossiers': 'ЭКСПОРТ ДАННЫХ ВЫПОЛНЕН',
        'evidence-search': 'ПОИСК ПО ДОКАЗАТЕЛЬСТВАМ АКТИВИРОВАН'
    };
    
    showMilitaryNotification(actions[action] || 'ДЕЙСТВИЕ ВЫПОЛНЕНО', 'info');
}

function playMilitarySound() {
    // Simulate military sound with visual flash
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 107, 107, 0.1);
        z-index: 9998;
        pointer-events: none;
    `;
    document.body.appendChild(flash);
    
    setTimeout(() => flash.remove(), 200);
}

function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+K for search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            showMilitaryNotification('ПОИСК АКТИВИРОВАН', 'info');
        }
        
        // Ctrl+A for select all
        if (e.ctrlKey && e.key === 'a') {
            showMilitaryNotification('ВСЕ ЭЛЕМЕНТЫ ВЫБРАНЫ', 'info');
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.evidence-modal.show');
            modals.forEach(modal => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        }
    });
}

function addLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-text">ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ</div>
        <div class="loading-bar">
            <div class="loading-progress"></div>
        </div>
    `;
    
    document.body.appendChild(loadingScreen);
    
    // Simulate loading progress
    const progress = loadingScreen.querySelector('.loading-progress');
    let width = 0;
    
    const interval = setInterval(() => {
        width += Math.random() * 20;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                    showMilitaryNotification('СИСТЕМА ГОТОВА К РАБОТЕ', 'info');
                }, 500);
            }, 500);
        }
        progress.style.width = width + '%';
    }, 200);
}

// Add current date to the page
function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateElement.textContent = now.toLocaleDateString('ru-RU', options);
    }
}

// Initialize date on load
document.addEventListener('DOMContentLoaded', updateCurrentDate);