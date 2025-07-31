// Dossiers Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    loadDossiers();
    updateStats();
    
    // Event listeners
    setupEventListeners();
    
    // Load initial data
    displayDossiers(getDossiersData());
});

// Global variables
let currentFilter = 'all';
let currentSearch = '';
let allDossiers = [];

// Event listeners setup
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchInput.addEventListener('input', function() {
        currentSearch = this.value.toLowerCase();
        filterAndDisplayDossiers();
    });
    
    searchBtn.addEventListener('click', function() {
        currentSearch = searchInput.value.toLowerCase();
        filterAndDisplayDossiers();
    });
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterAndDisplayDossiers();
        });
    });
    
    // Add dossier button
    const addDossierBtn = document.getElementById('add-new-dossier');
    addDossierBtn.addEventListener('click', showAddDossierModal);
    
    // Export button
    const exportBtn = document.getElementById('export-all');
    exportBtn.addEventListener('click', exportAllDossiers);
    
    // Form submission
    const addDossierForm = document.getElementById('add-dossier-form');
    addDossierForm.addEventListener('submit', handleAddDossier);
    
    // File input
    const fileInput = document.getElementById('dossier-files');
    fileInput.addEventListener('change', handleFilePreview);
}

// Load dossiers from localStorage
function loadDossiers() {
    const data = localStorage.getItem('dossierData');
    allDossiers = data ? JSON.parse(data) : [];
}

// Get dossiers data
function getDossiersData() {
    return allDossiers;
}

// Update statistics
function updateStats() {
    const total = allDossiers.length;
    const anonymous = allDossiers.filter(d => d.type === 'anonymous').length;
    const publicCount = allDossiers.filter(d => d.type === 'public').length;
    
    document.getElementById('total-dossiers').textContent = total;
    document.getElementById('anonymous-dossiers').textContent = anonymous;
    document.getElementById('public-dossiers').textContent = publicCount;
}

// Filter and display dossiers
function filterAndDisplayDossiers() {
    let filtered = allDossiers;
    
    // Apply search filter
    if (currentSearch) {
        filtered = filtered.filter(dossier => 
            dossier.title.toLowerCase().includes(currentSearch) ||
            dossier.content.toLowerCase().includes(currentSearch) ||
            (dossier.tags && dossier.tags.some(tag => tag.toLowerCase().includes(currentSearch)))
        );
    }
    
    // Apply type filter
    switch (currentFilter) {
        case 'anonymous':
            filtered = filtered.filter(d => d.type === 'anonymous');
            break;
        case 'public':
            filtered = filtered.filter(d => d.type === 'public');
            break;
        case 'recent':
            filtered = filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            break;
        case 'with-files':
            filtered = filtered.filter(d => d.files && d.files.length > 0);
            break;
    }
    
    displayDossiers(filtered);
}

// Display dossiers in grid
function displayDossiers(dossiers) {
    const container = document.getElementById('dossiers-list');
    const noDossiers = document.getElementById('no-dossiers');
    
    if (dossiers.length === 0) {
        container.innerHTML = '';
        noDossiers.style.display = 'block';
        return;
    }
    
    noDossiers.style.display = 'none';
    
    const html = dossiers.map(dossier => createDossierCard(dossier)).join('');
    container.innerHTML = html;
    
    // Add click listeners to cards
    const cards = container.querySelectorAll('.dossier-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const dossierId = this.dataset.id;
            showDossierDetails(dossierId);
        });
    });
}

// Create dossier card HTML
function createDossierCard(dossier) {
    const tags = dossier.tags ? dossier.tags.join(', ') : '';
    const filesCount = dossier.files ? dossier.files.length : 0;
    const date = new Date(dossier.timestamp).toLocaleDateString('ru-RU');
    
    return `
        <div class="dossier-card" data-id="${dossier.id}">
            <div class="dossier-card-header">
                <h4>${dossier.title}</h4>
                <span class="dossier-type ${dossier.type}">
                    ${dossier.type === 'anonymous' ? 'Анонимно' : 'Публично'}
                </span>
            </div>
            <p class="dossier-content">${dossier.content.substring(0, 150)}${dossier.content.length > 150 ? '...' : ''}</p>
            <div class="dossier-meta">
                <span class="dossier-date">${date}</span>
                ${filesCount > 0 ? `<span class="dossier-files"><i class="fas fa-paperclip"></i> ${filesCount}</span>` : ''}
            </div>
            ${tags ? `<div class="dossier-tags">${tags}</div>` : ''}
        </div>
    `;
}

// Show add dossier modal
function showAddDossierModal() {
    document.getElementById('add-dossier-modal').style.display = 'flex';
}

// Close add dossier modal
function closeAddDossierModal() {
    document.getElementById('add-dossier-modal').style.display = 'none';
    document.getElementById('add-dossier-form').reset();
    document.getElementById('file-preview').innerHTML = '';
}

// Handle file preview
function handleFilePreview(event) {
    const files = event.target.files;
    const preview = document.getElementById('file-preview');
    
    if (files.length === 0) {
        preview.innerHTML = '';
        return;
    }
    
    let html = '<div class="file-list">';
    Array.from(files).forEach(file => {
        html += `
            <div class="file-item">
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <small>${(file.size / 1024).toFixed(1)} KB</small>
            </div>
        `;
    });
    html += '</div>';
    preview.innerHTML = html;
}

// Handle add dossier form submission
function handleAddDossier(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const title = document.getElementById('dossier-title').value.trim();
    const content = document.getElementById('dossier-content').value.trim();
    const tags = document.getElementById('dossier-tags').value.trim();
    const type = document.getElementById('dossier-type').value;
    const files = document.getElementById('dossier-files').files;
    
    if (!title || !content) {
        showNotification('Пожалуйста, заполните обязательные поля', 'error');
        return;
    }
    
    const dossier = {
        id: Date.now(),
        title: title,
        content: content,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        type: type,
        timestamp: new Date().toISOString(),
        files: []
    };
    
    // Handle files
    if (files.length > 0) {
        const filePromises = Array.from(files).map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: e.target.result
                    });
                };
                reader.readAsDataURL(file);
            });
        });
        
        Promise.all(filePromises).then(fileData => {
            dossier.files = fileData;
            saveDossier(dossier);
        });
    } else {
        saveDossier(dossier);
    }
}

// Save dossier
function saveDossier(dossier) {
    allDossiers.push(dossier);
    localStorage.setItem('dossierData', JSON.stringify(allDossiers));
    
    updateStats();
    filterAndDisplayDossiers();
    closeAddDossierModal();
    
    showNotification('Досье успешно добавлено!', 'success');
}

// Show dossier details
function showDossierDetails(dossierId) {
    const dossier = allDossiers.find(d => d.id == dossierId);
    if (!dossier) return;
    
    const modal = document.getElementById('dossier-details-modal');
    const title = document.getElementById('modal-dossier-title');
    const content = document.getElementById('modal-dossier-content');
    
    title.textContent = dossier.title;
    
    let html = `
        <div class="dossier-details">
            <div class="dossier-info">
                <p><strong>Тип:</strong> ${dossier.type === 'anonymous' ? 'Анонимное' : 'Публичное'}</p>
                <p><strong>Дата:</strong> ${new Date(dossier.timestamp).toLocaleDateString('ru-RU')}</p>
                ${dossier.tags && dossier.tags.length > 0 ? `<p><strong>Теги:</strong> ${dossier.tags.join(', ')}</p>` : ''}
            </div>
            <div class="dossier-content-full">
                <h4>Описание:</h4>
                <p>${dossier.content}</p>
            </div>
    `;
    
    if (dossier.files && dossier.files.length > 0) {
        html += `
            <div class="dossier-files-section">
                <h4>Прикрепленные файлы:</h4>
                <div class="files-list">
                    ${dossier.files.map(file => `
                        <div class="file-item">
                            <i class="fas fa-file"></i>
                            <span>${file.name}</span>
                            <small>${(file.size / 1024).toFixed(1)} KB</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    content.innerHTML = html;
    
    modal.style.display = 'flex';
}

// Close dossier details modal
function closeDossierDetailsModal() {
    document.getElementById('dossier-details-modal').style.display = 'none';
}

// Export all dossiers
function exportAllDossiers() {
    const exportData = {
        exportDate: new Date().toISOString(),
        totalDossiers: allDossiers.length,
        dossiers: allDossiers.map(d => ({
            title: d.title,
            content: d.content,
            type: d.type,
            tags: d.tags,
            timestamp: d.timestamp,
            filesCount: d.files ? d.files.length : 0
        }))
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `gromover-dossiers-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Все досье экспортированы!', 'success');
}

// Notification system
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

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

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

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

// Global functions for onclick handlers
window.showAddDossierModal = showAddDossierModal;
window.closeAddDossierModal = closeAddDossierModal;
window.closeDossierDetailsModal = closeDossierDetailsModal; 