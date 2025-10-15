// admin-script.js - الوظائف الحقيقية للوحة الإدارة
let currentTab = 'dashboard';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initAdminPanel();
    loadDashboardData();
    setupEventListeners();
});

function initAdminPanel() {
    // تحميل البيانات الأولية
    updateStatistics();
    loadUsersTable();
    loadVideosTable();
    loadPaymentsTable();
    
    // تحديث البيانات كل 30 ثانية
    setInterval(updateLiveData, 30000);
}

function setupEventListeners() {
    // التنقل بين التبويبات
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            if (tab) {
                showTab(tab);
            }
        });
    });

    // البحث في الوقت الحقيقي
    document.getElementById('userSearch')?.addEventListener('input', searchUsers);
    document.getElementById('videoSearch')?.addEventListener('input', searchVideos);
}

function showTab(tabName) {
    currentTab = tabName;
    
    // إخفاء جميع المحتويات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // إزالة النشط من القائمة
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // عرض المحتوى المطلوب
    const targetTab = document.getElementById(tabName);
    const targetNav = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (targetTab) targetTab.classList.add('active');
    if (targetNav) targetNav.classList.add('active');
    
    updatePageTitle(tabName);
    
    // تحميل بيانات التبويب إذا لزم الأمر
    switch(tabName) {
        case 'users':
            loadUsersTable();
            break;
        case 'videos':
            loadVideosTable();
            break;
        case 'payments':
            loadPaymentsTable();
            break;
        case 'coins':
            loadCoinsData();
            break;
    }
}

function updatePageTitle(tabName) {
    const titles = {
        'dashboard': 'لوحة التحكم',
        'users': 'إدارة المستخدمين',
        'videos': 'إدارة الفيديوهات',
        'coins': 'إدارة العملات',
        'payments': 'المدفوعات',
        'live': 'البث المباشر',
        'reports': 'التقارير',
        'settings': 'الإعدادات'
    };
    
    document.getElementById('pageTitle').textContent = titles[tabName] || 'لوحة التحكم';
}

// تحديث الإحصائيات الحية
function updateStatistics() {
    const stats = adminDB.getStatistics();
    
    document.getElementById('totalUsers').textContent = stats.totalUsers.toLocaleString();
    document.getElementById('totalVideos').textContent = stats.totalVideos.toLocaleString();
    document.getElementById('totalCoins').textContent = stats.totalCoins.toLocaleString();
    document.getElementById('totalIncome').textContent = `$${stats.totalIncome.toLocaleString()}`;
    
    // تحديث العداد في الشريط الجانبي
    document.getElementById('usersCount').textContent = stats.totalUsers;
    document.getElementById('videosCount').textContent = stats.totalVideos;
    document.getElementById('paymentsCount').textContent = adminDB.getAllPayments().length;
    document.getElementById('liveCount').textContent = adminDB.getAllLiveStreams().filter(s => s.status === 'live').length;
}

function updateLiveData() {
    updateStatistics();
    
    if (currentTab === 'dashboard') {
        loadRecentActivity();
    }
}

// إدارة المستخدمين
function loadUsersTable() {
    const users = adminDB.getAllUsers();
    const tbody = document.getElementById('usersTable');
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>
                <img src="${user.avatar}" alt="${user.username}" class="user-avatar" style="width: 40px; height: 40px; border-radius: 50%;">
            </td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.coins.toLocaleString()} 💎</td>
            <td>
                <span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-banned'}">
                    ${user.status === 'active' ? 'نشط' : 'محظور'}
                </span>
            </td>
            <td>${new Date(user.registeredAt).toLocaleDateString('ar-EG')}</td>
            <td class="ban-controls">
                <button class="btn btn-${user.status === 'active' ? 'danger' : 'success'} btn-sm" 
                        onclick="toggleUserBan(${user.id})">
                    ${user.status === 'active' ? 'حظر' : 'فك الحظر'}
                </button>
                <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">
                    تعديل
                </button>
                <button class="btn btn-warning btn-sm" onclick="resetUserPassword(${user.id})">
                    إعادة تعيين
                </button>
                <button class="btn btn-info btn-sm" onclick="viewUserDetails(${user.id})">
                    تفاصيل
                </button>
            </td>
        </tr>
    `).join('');
}

function searchUsers() {
    const query = document.getElementById('userSearch').value;
    const filteredUsers = adminDB.searchUsers(query);
    const tbody = document.getElementById('usersTable');
    
    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>
                <img src="${user.avatar}" alt="${user.username}" class="user-avatar" style="width: 40px; height: 40px; border-radius: 50%;">
            </td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.coins.toLocaleString()} 💎</td>
            <td>
                <span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-banned'}">
                    ${user.status === 'active' ? 'نشط' : 'محظور'}
                </span>
            </td>
            <td>${new Date(user.registeredAt).toLocaleDateString('ar-EG')}</td>
            <td class="ban-controls">
                <button class="btn btn-${user.status === 'active' ? 'danger' : 'success'} btn-sm" 
                        onclick="toggleUserBan(${user.id})">
                    ${user.status === 'active' ? 'حظر' : 'فك الحظر'}
                </button>
                <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">
                    تعديل
                </button>
                <button class="btn btn-info btn-sm" onclick="viewUserDetails(${user.id})">
                    تفاصيل
                </button>
            </td>
        </tr>
    `).join('');
}

function addNewUser(event) {
    event.preventDefault();
    
    const userData = {
        username: document.getElementById('newUsername').value,
        email: document.getElementById('newEmail').value,
        password: document.getElementById('newPassword').value,
        coins: parseInt(document.getElementById('initialCoins').value) || 100
    };
    
    const newUser = adminDB.addUser(userData);
    
    if (newUser) {
        showAlert('تم إضافة المستخدم بنجاح', 'success');
        closeModal('addUserModal');
        document.getElementById('addUserForm').reset();
        loadUsersTable();
        updateStatistics();
    } else {
        showAlert('حدث خطأ أثناء إضافة المستخدم', 'error');
    }
}

function toggleUserBan(userId) {
    const user = adminDB.getUserById(userId);
    if (user) {
        const newStatus = user.status === 'active' ? 'banned' : 'active';
        adminDB.updateUser(userId, { status: newStatus });
        
        showAlert(`تم ${newStatus === 'active' ? 'فك حظر' : 'حظر'} المستخدم ${user.username}`, 'success');
        loadUsersTable();
    }
}

function editUser(userId) {
    const user = adminDB.getUserById(userId);
    if (user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editCoins').value = user.coins;
        document.getElementById('editStatus').value = user.status;
        
        showModal('editUserModal');
    }
}

function updateUserData(event) {
    event.preventDefault();
    
    const userId = document.getElementById('editUserId').value;
    const updates = {
        username: document.getElementById('editUsername').value,
        email: document.getElementById('editEmail').value,
        coins: parseInt(document.getElementById('editCoins').value),
        status: document.getElementById('editStatus').value
    };
    
    const updatedUser = adminDB.updateUser(parseInt(userId), updates);
    
    if (updatedUser) {
        showAlert('تم تحديث بيانات المستخدم بنجاح', 'success');
        closeModal('editUserModal');
        loadUsersTable();
        updateStatistics();
    } else {
        showAlert('حدث خطأ أثناء تحديث البيانات', 'error');
    }
}

function resetUserPassword(userId) {
    const user = adminDB.getUserById(userId);
    if (user && confirm(`هل أنت متأكد من إعادة تعيين كلمة مرور ${user.username}؟`)) {
        adminDB.updateUser(userId, { password: '123456' });
        showAlert(`تم إعادة تعيين كلمة المرور للمستخدم ${user.username} إلى 123456`, 'success');
    }
}

function viewUserDetails(userId) {
    const user = adminDB.getUserById(userId);
    if (user) {
        const userVideos = adminDB.getVideosByUser(userId);
        const userPayments = adminDB.getAllPayments().filter(p => p.userId === userId);
        
        alert(`
معلومات المستخدم:
--------------
👤 الاسم: ${user.username}
📧 البريد: ${user.email}
💎 العملات: ${user.coins.toLocaleString()}
📊 الحالة: ${user.status === 'active' ? 'نشط' : 'محظور'}
📅 مسجل منذ: ${new Date(user.registeredAt).toLocaleDateString('ar-EG')}

إحصائيات:
--------
🎬 عدد الفيديوهات: ${userVideos.length}
💰 عدد المعاملات: ${userPayments.length}
        `);
    }
}

// إدارة الفيديوهات (بنفس النمط)
function loadVideosTable() {
    const videos = adminDB.getAllVideos();
    const tbody = document.getElementById('videosTable');
    
    tbody.innerHTML = videos.map(video => `
        <tr>
            <td>${video.id}</td>
            <td>
                <img src="${video.thumbnail}" alt="${video.title}" style="width: 60px; height: 40px; border-radius: 4px; object-fit: cover;">
            </td>
            <td>
                <strong>${video.title}</strong>
                <br>
                <small style="color: #666;">${video.description}</small>
            </td>
            <td>${video.username}</td>
            <td>${video.views.toLocaleString()}</td>
            <td>${video.likes.toLocaleString()}</td>
            <td>${video.comments}</td>
            <td>
                <span class="status-badge ${video.status === 'active' ? 'status-active' : 'status-banned'}">
                    ${video.status === 'active' ? 'نشط' : 'مخفي'}
                </span>
            </td>
            <td>
                <button class="btn btn-${video.status === 'active' ? 'danger' : 'success'} btn-sm" 
                        onclick="toggleVideoStatus(${video.id})">
                    ${video.status === 'active' ? 'إخفاء' : 'إظهار'}
                </button>
                <button class="btn btn-warning btn-sm" onclick="deleteVideo(${video.id})">
                    حذف
                </button>
            </td>
        </tr>
    `).join('');
}

function searchVideos() {
    const query = document.getElementById('videoSearch').value;
    const filteredVideos = adminDB.searchVideos(query);
    const tbody = document.getElementById('videosTable');
    
    tbody.innerHTML = filteredVideos.map(video => `
        <tr>
            <td>${video.id}</td>
            <td>
                <img src="${video.thumbnail}" alt="${video.title}" style="width: 60px; height: 40px; border-radius: 4px; object-fit: cover;">
            </td>
            <td>
                <strong>${video.title}</strong>
                <br>
                <small style="color: #666;">${video.description}</small>
            </td>
            <td>${video.username}</td>
            <td>${video.views.toLocaleString()}</td>
            <td>${video.likes.toLocaleString()}</td>
            <td>${video.comments}</td>
            <td>
                <span class="status-badge ${video.status === 'active' ? 'status-active' : 'status-banned'}">
                    ${video.status === 'active' ? 'نشط' : 'مخفي'}
                </span>
            </td>
            <td>
                <button class="btn btn-${video.status === 'active' ? 'danger' : 'success'} btn-sm" 
                        onclick="toggleVideoStatus(${video.id})">
                    ${video.status === 'active' ? 'إخفاء' : 'إظهار'}
                </button>
                <button class="btn btn-warning btn-sm" onclick="deleteVideo(${video.id})">
                    حذف
                </button>
            </td>
        </tr>
    `).join('');
}

function toggleVideoStatus(videoId) {
    const video = adminDB.getAllVideos().find(v => v.id === videoId);
    if (video) {
        const newStatus = video.status === 'active' ? 'hidden' : 'active';
        adminDB.updateVideo(videoId, { status: newStatus });
        
        showAlert(`تم ${newStatus === 'active' ? 'إظهار' : 'إخفاء'} الفيديو`, 'success');
        loadVideosTable();
    }
}

function deleteVideo(videoId) {
    if (confirm('هل أنت متأكد من حذف هذا الفيديو؟ لا يمكن التراجع عن هذا الإجراء.')) {
        adminDB.deleteVideo(videoId);
        showAlert('تم حذف الفيديو بنجاح', 'success');
        loadVideosTable();
        updateStatistics();
    }
}

// باقي الوظائف (المدفوعات، البث المباشر، إلخ)
function loadPaymentsTable() {
    const payments = adminDB.getAllPayments();
    // تنفيذ مشابه لجدول المستخدمين
}

function loadDashboardData() {
    updateStatistics();
    loadRecentActivity();
}

function loadRecentActivity() {
    const activities = [
        { user: 'ahmed_ali', action: 'رفع فيديو جديد', time: 'منذ 5 دقائق', status: 'success' },
        { user: 'sara_mohamed', action: 'شراء عملات', time: 'منذ 15 دقيقة', status: 'success' },
        { user: 'system', action: 'نسخة احتياطية', time: 'منذ ساعة', status: 'info' }
    ];
    
    const tbody = document.getElementById('recentActivity');
    tbody.innerHTML = activities.map(activity => `
        <tr>
            <td>${activity.user}</td>
            <td>${activity.action}</td>
            <td>${activity.time}</td>
            <td>
                <span class="status-badge status-${activity.status}">
                    ${activity.status === 'success' ? 'مكتمل' : 'معلومات'}
                </span>
            </td>
        </tr>
    `).join('');
}

// وظائف مساعدة
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        ${message}
        <button onclick="this.parentElement.remove()" style="background: none; border: none; float: left; cursor: pointer;">×</button>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('expanded');
}

function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        localStorage.removeItem('admin_token');
        window.location.href = 'login.html';
    }
}

function showNotifications() {
    // تنفيذ عرض الإشعارات
    showModal('notificationsModal');
}

// إغلاق النماذج بالضغط خارجها
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
