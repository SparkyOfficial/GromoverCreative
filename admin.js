// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    loadModerationList();
    updateAdminStats();
});

// Load admin data
function loadAdminData() {
    const dossierData = JSON.parse(localStorage.getItem('dossierData') || '[]');
    const blacklistedIPs = JSON.parse(localStorage.getItem('blacklistedIPs') || '[]');
    
    // Update stats
    document.getElementById('total-dossiers').textContent = dossierData.length;
    document.getElementById('pending-moderation').textContent = dossierData.filter(d => d.status === 'pending').length;
    document.getElementById('blacklisted-ips').textContent = blacklistedIPs.length;
    
    // Simulate visits (in real app this would come from server)
    document.getElementById('total-visits').textContent = Math.floor(Math.random() * 100) + 50;
}

// Load moderation list
function loadModerationList() {
    const dossierData = JSON.parse(localStorage.getItem('dossierData') || '[]');
    const moderationList = document.getElementById('moderation-list');
    
    moderationList.innerHTML = '';
    
    dossierData.forEach(dossier => {
        const moderationItem = document.createElement('div');
        moderationItem.className = `moderation-item ${dossier.status}`;
        moderationItem.innerHTML = `
            <div class="moderation-header">
                <strong>${dossier.title}</strong>
                <span style="font-size: 0.8rem; opacity: 0.7;">${new Date(dossier.timestamp).toLocaleString()}</span>
            </div>
            <div class="moderation-content">
                <p>${dossier.content.substring(0, 100)}${dossier.content.length > 100 ? '...' : ''}</p>
                <small>IP: ${dossier.clientIP || 'unknown'} | Тип: ${dossier.type}</small>
            </div>
            ${dossier.status === 'pending' ? `
                <div class="moderation-actions">
                    <button class="btn-approve" onclick="approveDossier(${dossier.id})">
                        <i class="fas fa-check"></i> Одобрить
                    </button>
                    <button class="btn-reject" onclick="rejectDossier(${dossier.id})">
                        <i class="fas fa-times"></i> Отклонить
                    </button>
                </div>
            ` : `
                <div class="moderation-status">
                    <span style="color: ${dossier.status === 'approved' ? '#28a745' : '#dc3545'};">
                        ${dossier.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                    </span>
                </div>
            `}
        `;
        
        moderationList.appendChild(moderationItem);
    });
    
    if (dossierData.length === 0) {
        moderationList.innerHTML = '<p style="text-align: center; opacity: 0.7;">Нет досье для модерации</p>';
    }
}

// Approve dossier
function approveDossier(id) {
    const dossierData = JSON.parse(localStorage.getItem('dossierData') || '[]');
    const dossierIndex = dossierData.findIndex(d => d.id === id);
    
    if (dossierIndex !== -1) {
        dossierData[dossierIndex].status = 'approved';
        localStorage.setItem('dossierData', JSON.stringify(dossierData));
        loadModerationList();
        updateAdminStats();
        showAdminNotification('Досье одобрено', 'success');
    }
}

// Reject dossier
function rejectDossier(id) {
    const dossierData = JSON.parse(localStorage.getItem('dossierData') || '[]');
    const dossierIndex = dossierData.findIndex(d => d.id === id);
    
    if (dossierIndex !== -1) {
        dossierData[dossierIndex].status = 'rejected';
        localStorage.setItem('dossierData', JSON.stringify(dossierData));
        loadModerationList();
        updateAdminStats();
        showAdminNotification('Досье отклонено', 'error');
    }
}

// Add blacklisted IP
function addBlacklistedIP() {
    const newIP = document.getElementById('new-ip').value.trim();
    
    if (newIP && isValidIP(newIP)) {
        const blacklistedIPs = JSON.parse(localStorage.getItem('blacklistedIPs') || '[]');
        
        if (!blacklistedIPs.includes(newIP)) {
            blacklistedIPs.push(newIP);
            localStorage.setItem('blacklistedIPs', JSON.stringify(blacklistedIPs));
            loadBlacklistedIPs();
            updateAdminStats();
            showAdminNotification(`IP ${newIP} добавлен в черный список`, 'success');
        } else {
            showAdminNotification('IP уже в черном списке', 'warning');
        }
    } else {
        showAdminNotification('Введите корректный IP-адрес', 'error');
    }
    
    document.getElementById('new-ip').value = '';
}

// Remove blacklisted IP
function removeIP(ip) {
    const blacklistedIPs = JSON.parse(localStorage.getItem('blacklistedIPs') || '[]');
    const filteredIPs = blacklistedIPs.filter(ipAddr => ipAddr !== ip);
    
    localStorage.setItem('blacklistedIPs', JSON.stringify(filteredIPs));
    loadBlacklistedIPs();
    updateAdminStats();
    showAdminNotification(`IP ${ip} удален из черного списка`, 'success');
}

// Load blacklisted IPs
function loadBlacklistedIPs() {
    const blacklistedIPs = JSON.parse(localStorage.getItem('blacklistedIPs') || '[]');
    const ipList = document.getElementById('blacklist-ips');
    
    ipList.innerHTML = '';
    
    blacklistedIPs.forEach(ip => {
        const ipItem = document.createElement('div');
        ipItem.className = 'ip-item';
        ipItem.innerHTML = `
            <span>${ip}</span>
            <button class="btn-remove" onclick="removeIP('${ip}')">Удалить</button>
        `;
        ipList.appendChild(ipItem);
    });
}

// Validate IP address
function isValidIP(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

// Export all data
function exportAllData() {
    const dossierData = JSON.parse(localStorage.getItem('dossierData') || '[]');
    const blacklistedIPs = JSON.parse(localStorage.getItem('blacklistedIPs') || '[]');
    
    const exportData = {
        dossiers: dossierData,
        blacklistedIPs: blacklistedIPs,
        exportDate: new Date().toISOString(),
        totalDossiers: dossierData.length,
        pendingModeration: dossierData.filter(d => d.status === 'pending').length
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `gromover-admin-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showAdminNotification('Данные экспортированы', 'success');
}

// Update admin stats
function updateAdminStats() {
    const dossierData = JSON.parse(localStorage.getItem('dossierData') || '[]');
    const blacklistedIPs = JSON.parse(localStorage.getItem('blacklistedIPs') || '[]');
    
    document.getElementById('total-dossiers').textContent = dossierData.length;
    document.getElementById('pending-moderation').textContent = dossierData.filter(d => d.status === 'pending').length;
    document.getElementById('blacklisted-ips').textContent = blacklistedIPs.length;
}

// Show admin notification
function showAdminNotification(message, type = 'info') {
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

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// Back to main page
function backToMain() {
    window.location.href = 'index.html';
}

// Initialize on load
loadBlacklistedIPs(); 