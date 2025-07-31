// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDate = new Date().toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('current-date').textContent = currentDate;

    // Initialize dossier storage
    initializeDossierStorage();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a, .footer-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.problem-card, .alternative-card, .dossier-card');
    animatedElements.forEach(el => observer.observe(el));

    // Enhanced form handling for dossier uploads
    // IP-based moderation system
    const BLACKLISTED_IPS = ['92.52.166.230'];
    const MODERATION_ENABLED = true;

    // Function to get client IP (simulated for static site)
    async function getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.log('Could not get IP, using fallback');
            return 'unknown';
        }
    }

    // Function to check if IP is blacklisted
    function isIPBlacklisted(ip) {
        return BLACKLISTED_IPS.includes(ip);
    }

    // Enhanced form handling with IP moderation
    async function handleFormSubmission(form, formType) {
        const clientIP = await getClientIP();
        
        if (MODERATION_ENABLED && isIPBlacklisted(clientIP)) {
            console.log(`Content from blacklisted IP ${clientIP} flagged for moderation`);
            showNotification('Ваше свидетельство отправлено на модерацию.', 'warning');
            return false; // Content flagged but not saved
        }
        
        const formData = new FormData(form);
        const textarea = form.querySelector('textarea');
        const fileInput = form.querySelector('input[type="file"]');
        const titleInput = form.querySelector('input[type="text"]');

        if (textarea && textarea.value.trim()) {
            const dossierEntry = {
                id: Date.now(),
                title: titleInput ? titleInput.value.trim() : 'Анонимное свидетельство',
                content: textarea.value.trim(),
                files: [],
                timestamp: new Date().toISOString(),
                type: formType,
                status: 'pending',
                clientIP: clientIP,
                moderated: isIPBlacklisted(clientIP)
            };

            if (fileInput && fileInput.files.length > 0) {
                const files = Array.from(fileInput.files);
                let processedFiles = 0;
                
                files.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        dossierEntry.files.push({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            data: e.target.result
                        });
                        processedFiles++;
                        
                        if (processedFiles === files.length) {
                            saveDossierEntry(dossierEntry);
                        }
                    };
                    reader.readAsDataURL(file);
                });
            } else {
                saveDossierEntry(dossierEntry);
            }
            
            const message = isIPBlacklisted(clientIP) 
                ? 'Свидетельство отправлено на модерацию.' 
                : 'Свидетельство отправлено! Спасибо за ваш вклад в разоблачение правды.';
            showNotification(message, isIPBlacklisted(clientIP) ? 'warning' : 'success');
            form.reset();
            return true;
        } else {
            showNotification('Пожалуйста, заполните описание вашего опыта.', 'error');
            return false;
        }
    }

    // Enhanced form handling for dossier uploads
    const uploadForms = document.querySelectorAll('.upload-form, .anonymous-upload');
    uploadForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formType = this.classList.contains('anonymous-upload') ? 'anonymous' : 'public';
            await handleFormSubmission(this, formType);
        });
    });

    // Enhanced file upload preview
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const files = this.files;
            if (files.length > 0) {
                const fileNames = Array.from(files).map(file => file.name).join(', ');
                const totalSize = Array.from(files).reduce((sum, file) => sum + file.size, 0);
                const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
                
                showNotification(`Выбрано файлов: ${files.length} (${sizeMB} MB)`, 'info');
                
                // Show file preview
                showFilePreview(files);
            }
        });
    });

    // Evidence tag interactions with dossier data
    const evidenceTags = document.querySelectorAll('.evidence-tag');
    evidenceTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent;
            const dossierData = getDossierData();
            const relatedEntries = dossierData.filter(entry => 
                entry.content.toLowerCase().includes(tagText.toLowerCase()) ||
                entry.title.toLowerCase().includes(tagText.toLowerCase())
            );
            
            if (relatedEntries.length > 0) {
                showDossierDetails(tagText, relatedEntries);
            } else {
                showNotification(`Досье: ${tagText} - подробная информация будет добавлена позже.`, 'info');
            }
        });
    });

    // Meme placeholders interactions
    const memePlaceholders = document.querySelectorAll('.meme-placeholder');
    memePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const placeholderText = this.querySelector('p').textContent;
            showNotification(`${placeholderText} - материалы будут добавлены по мере поступления.`, 'info');
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add header transition
    header.style.transition = 'transform 0.3s ease-in-out';

    // Statistics counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        if (finalValue !== '∞' && finalValue !== '100%') {
            animateCounter(stat, 0, parseInt(finalValue), 2000);
        }
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // View all dossiers button
    const viewAllDossiersBtn = document.getElementById('view-all-dossiers');
    if (viewAllDossiersBtn) {
        viewAllDossiersBtn.addEventListener('click', function() {
            const dossierData = getDossierData();
            if (dossierData.length > 0) {
                showAllDossiers(dossierData);
            } else {
                showNotification('Пока нет загруженных свидетельств.', 'info');
            }
        });
    }

    // Export dossiers button
    const exportDossiersBtn = document.getElementById('export-dossiers');
    if (exportDossiersBtn) {
        exportDossiersBtn.addEventListener('click', function() {
            const dossierData = getDossierData();
            if (dossierData.length > 0) {
                exportDossierData(dossierData);
            } else {
                showNotification('Нет данных для экспорта.', 'warning');
            }
        });
    }
});

// Dossier storage functions
function initializeDossierStorage() {
    if (!localStorage.getItem('dossierData')) {
        localStorage.setItem('dossierData', JSON.stringify([]));
    }
}

function saveDossierEntry(entry) {
    const dossierData = getDossierData();
    dossierData.push(entry);
    localStorage.setItem('dossierData', JSON.stringify(dossierData));
    
    // Update dossier statistics
    updateDossierStats();
}

function getDossierData() {
    return JSON.parse(localStorage.getItem('dossierData') || '[]');
}

function updateDossierStats() {
    const dossierData = getDossierData();
    const totalEntries = dossierData.length;
    const anonymousEntries = dossierData.filter(entry => entry.type === 'anonymous').length;
    const publicEntries = dossierData.filter(entry => entry.type === 'public').length;
    
    // Update stats in the hero section if they exist
    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
        const newStat = document.createElement('div');
        newStat.className = 'stat';
        newStat.innerHTML = `
            <span class="stat-number">${totalEntries}</span>
            <span class="stat-label">Свидетельств</span>
        `;
        
        // Replace or add the new stat
        const existingStat = statsContainer.querySelector('.stat:last-child');
        if (existingStat) {
            existingStat.replaceWith(newStat);
        }
    }
}

function showFilePreview(files) {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'file-preview';
    previewContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        max-width: 400px;
        max-height: 300px;
        overflow-y: auto;
    `;
    
    const fileList = document.createElement('ul');
    fileList.style.cssText = 'list-style: none; padding: 0; margin: 0;';
    
    Array.from(files).forEach(file => {
        const listItem = document.createElement('li');
        listItem.style.cssText = 'padding: 8px 0; border-bottom: 1px solid #eee;';
        listItem.innerHTML = `
            <strong>${file.name}</strong><br>
            <small>${(file.size / 1024).toFixed(1)} KB</small>
        `;
        fileList.appendChild(listItem);
    });
    
    previewContainer.innerHTML = `
        <h4 style="margin-bottom: 15px;">Предварительный просмотр файлов</h4>
        ${fileList.outerHTML}
        <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 16px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
    `;
    
    document.body.appendChild(previewContainer);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (previewContainer.parentNode) {
            previewContainer.remove();
        }
    }, 5000);
}

function showDossierDetails(tagText, entries) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    let content = `<h3 style="color: #ff6b6b; margin-bottom: 20px;">Досье: ${tagText}</h3>`;
    
    entries.forEach((entry, index) => {
        content += `
            <div style="border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
                <h4 style="margin-bottom: 10px;">${entry.title}</h4>
                <p style="margin-bottom: 10px; color: #666;">${entry.content}</p>
                <small style="color: #999;">${new Date(entry.timestamp).toLocaleDateString('ru-RU')}</small>
                ${entry.files.length > 0 ? `<br><small style="color: #ff6b6b;">Файлов: ${entry.files.length}</small>` : ''}
            </div>
        `;
    });
    
    modalContent.innerHTML = `
        ${content}
        <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 20px; cursor: pointer; color: #999;">×</button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showAllDossiers(dossierData) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    let content = `
        <h3 style="color: #ff6b6b; margin-bottom: 20px;">
            <i class="fas fa-archive"></i> Все свидетельства (${dossierData.length})
        </h3>
        <div style="margin-bottom: 20px;">
            <button onclick="filterDossiers('all')" class="filter-btn active">Все</button>
            <button onclick="filterDossiers('anonymous')" class="filter-btn">Анонимные</button>
            <button onclick="filterDossiers('public')" class="filter-btn">Публичные</button>
        </div>
        <div id="dossiers-list">
    `;
    
    dossierData.forEach((entry, index) => {
        content += `
            <div class="dossier-entry" data-type="${entry.type}" style="border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <h4 style="margin: 0;">${entry.title}</h4>
                    <span style="background: ${entry.type === 'anonymous' ? '#ff6b6b' : '#28a745'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">
                        ${entry.type === 'anonymous' ? 'Анонимно' : 'Публично'}
                    </span>
                </div>
                <p style="margin-bottom: 10px; color: #666;">${entry.content}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <small style="color: #999;">${new Date(entry.timestamp).toLocaleDateString('ru-RU')}</small>
                    ${entry.files.length > 0 ? `<small style="color: #ff6b6b;"><i class="fas fa-paperclip"></i> ${entry.files.length} файл(ов)</small>` : ''}
                </div>
                ${entry.files.length > 0 ? `
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                        <strong>Файлы:</strong>
                        <ul style="margin: 5px 0; padding-left: 20px;">
                            ${entry.files.map(file => `<li>${file.name} (${(file.size / 1024).toFixed(1)} KB)</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    content += `
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 20px; cursor: pointer; color: #999;">×</button>
    `;
    
    modalContent.innerHTML = content;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add filter functionality
    window.filterDossiers = function(type) {
        const entries = modal.querySelectorAll('.dossier-entry');
        const filterBtns = modal.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        entries.forEach(entry => {
            if (type === 'all' || entry.dataset.type === type) {
                entry.style.display = 'block';
            } else {
                entry.style.display = 'none';
            }
        });
    };
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function exportDossierData(dossierData) {
    const exportData = {
        exportDate: new Date().toISOString(),
        totalEntries: dossierData.length,
        entries: dossierData.map(entry => ({
            title: entry.title,
            content: entry.content,
            type: entry.type,
            timestamp: entry.timestamp,
            filesCount: entry.files.length
        }))
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `gromover-dossiers-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Данные экспортированы успешно!', 'success');
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// Counter animation
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
`;
document.head.appendChild(notificationStyles);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search (if we add search functionality later)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Future search functionality
    }
    
    // Escape to close notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
    }
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll handling logic here if needed
}, 16);

window.addEventListener('scroll', debouncedScrollHandler); 