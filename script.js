// ملف connector.js - يربط بين التطبيق الرئيسي ولوحة الإدارة
class SoshialConnector {
    constructor() {
        this.apiUrl = 'https://your-api-domain.com/api';
        this.adminUrl = 'https://your-admin-domain.com';
        this.isConnected = false;
    }

    // الاتصال بخادم الإدارة
    async connectToAdmin() {
        try {
            const response = await fetch(`${this.adminUrl}/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.getAdminToken()
                }
            });
            
            if (response.ok) {
                this.isConnected = true;
                console.log('✅ تم الاتصال بنجاح بلوحة الإدارة');
                return true;
            }
        } catch (error) {
            console.error('❌ فشل الاتصال بلوحة الإدارة:', error);
            return false;
        }
    }

    // مزامنة البيانات
    async syncData(dataType, data) {
        if (!this.isConnected) {
            await this.connectToAdmin();
        }

        try {
            const response = await fetch(`${this.adminUrl}/api/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.getAdminToken()
                },
                body: JSON.stringify({
                    type: dataType,
                    data: data,
                    timestamp: new Date().toISOString()
                })
            });

            return await response.json();
        } catch (error) {
            console.error('❌ فشل مزامنة البيانات:', error);
            return null;
        }
    }

    // إرسال إشعارات للإدارة
    async sendNotification(type, message, data = {}) {
        const notification = {
            type: type,
            message: message,
            data: data,
            timestamp: new Date().toISOString(),
            appVersion: '1.0.0'
        };

        return await this.syncData('notification', notification);
    }

    // الحصول على رمز الإدارة
    getAdminToken() {
        return localStorage.getItem('admin_token') || 'default-token';
    }

    // حفظ رمز الإدارة
    setAdminToken(token) {
        localStorage.setItem('admin_token', token);
    }

    // نظام العمولة 10%
    calculateCommission(amount) {
        const commission = amount * 0.10; // 10%
        const netAmount = amount - commission;
        
        return {
            original: amount,
            commission: commission,
            net: netAmount,
            percentage: 10
        };
    }

    // إرسال تقرير الدفع للإدارة
    async reportPayment(paymentData) {
        const commission = this.calculateCommission(paymentData.amount);
        
        const report = {
            paymentId: paymentData.id,
            userId: paymentData.userId,
            amount: paymentData.amount,
            commission: commission.commission,
            netAmount: commission.net,
            currency: paymentData.currency,
            timestamp: new Date().toISOString()
        };

        return await this.sendNotification('payment', 'دفعة جديدة', report);
    }

    // إدارة الحظر
    async banUser(userId, reason, duration = null) {
        const banData = {
            userId: userId,
            reason: reason,
            duration: duration,
            bannedBy: 'admin',
            timestamp: new Date().toISOString()
        };

        return await this.syncData('ban', banData);
    }

    async unbanUser(userId) {
        const unbanData = {
            userId: userId,
            unbannedBy: 'admin',
            timestamp: new Date().toISOString()
        };

        return await this.syncData('unban', unbanData);
    }

    // إدارة العملات
    async updateUserCoins(userId, coins, action, reason) {
        const coinsData = {
            userId: userId,
            coins: coins,
            action: action, // add, remove, set
            reason: reason,
            processedBy: 'admin',
            timestamp: new Date().toISOString()
        };

        return await this.syncData('coins', coinsData);
    }

    // إدارة الفيديوهات
    async manageVideo(videoId, action, data = {}) {
        const videoData = {
            videoId: videoId,
            action: action, // delete, hide, feature, etc.
            data: data,
            processedBy: 'admin',
            timestamp: new Date().toISOString()
        };

        return await this.syncData('video', videoData);
    }

    // نظام الهجمات (للأغراض الأمنية)
    async reportSecurityThreat(threatType, details, severity) {
        const threatData = {
            type: threatType,
            details: details,
            severity: severity,
            detectedAt: new Date().toISOString(),
            ip: await this.getUserIP()
        };

        return await this.sendNotification('security_threat', 'تهديد أمني', threatData);
    }

    // الحصول على IP المستخدم
    async getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    // تحديث الإحصائيات
    async updateStats(statsData) {
        return await this.syncData('stats', statsData);
    }

    // استقبال الأوامر من الإدارة
    setupCommandListener() {
        // محاكاة استقبال الأوامر من الإدارة
        window.addEventListener('message', (event) => {
            if (event.origin !== this.adminUrl) return;

            const command = event.data;
            this.executeAdminCommand(command);
        });
    }

    // تنفيذ أوامر الإدارة
    executeAdminCommand(command) {
        switch (command.action) {
            case 'refresh_data':
                this.refreshAppData();
                break;
            case 'update_user':
                this.updateUserData(command.data);
                break;
            case 'ban_user':
                this.banUser(command.userId, command.reason);
                break;
            case 'update_coins':
                this.updateUserCoins(command.userId, command.coins, command.action, command.reason);
                break;
            case 'system_message':
                this.showSystemMessage(command.message);
                break;
        }
    }

    // وظائف مساعدة
    refreshAppData() {
        window.location.reload();
    }

    updateUserData(userData) {
        // تحديث بيانات المستخدم في التطبيق
        if (window.currentUser && window.currentUser.id === userData.id) {
            window.currentUser = { ...window.currentUser, ...userData };
        }
    }

    showSystemMessage(message) {
        alert(`🔔 رسالة من الإدارة: ${message}`);
    }
}

// تهيئة الموصل
const soshialConnector = new SoshialConnector();

// دمج الموصل مع التطبيق الرئيسي
function integrateWithAdmin() {
    // الاتصال التلقائي عند تحميل التطبيق
    soshialConnector.connectToAdmin();
    
    // إعداد مستمع الأوامر
    soshialConnector.setupCommandListener();
    
    // إرسال إحصائيات أولية
    soshialConnector.updateStats({
        activeUsers: getActiveUsersCount(),
        totalVideos: getTotalVideosCount(),
        dailyIncome: getDailyIncome(),
        serverStatus: 'online'
    });
}

// وظائف افتراضية (يتم استبدالها بالوظائف الفعلية)
function getActiveUsersCount() {
    return document.querySelectorAll('.user-online').length;
}

function getTotalVideosCount() {
    return document.querySelectorAll('.video-item').length;
}

function getDailyIncome() {
    return 1250; // قيمة افتراضية
}

// تصدير الموصل للاستخدام العالمي
window.soshialConnector = soshialConnector;
window.integrateWithAdmin = integrateWithAdmin;
