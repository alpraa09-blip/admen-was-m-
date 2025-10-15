// admin-database.js - نظام قاعدة البيانات الحقيقي
class AdminDatabase {
    constructor() {
        this.init();
    }

    init() {
        // تهيئة التخزين إذا لم يكن موجوداً
        if (!localStorage.getItem('soshial_users')) {
            this.generateInitialData();
        }
        this.loadAllData();
    }

    generateInitialData() {
        // بيانات مستخدمين حقيقية عشوائية
        const initialUsers = [
            {
                id: 1,
                username: 'ahmed_ali',
                email: 'ahmed.ali@example.com',
                password: '123456',
                coins: 1500,
                status: 'active',
                avatar: 'https://i.pravatar.cc/150?img=1',
                registeredAt: new Date('2024-01-01').toISOString(),
                lastLogin: new Date().toISOString()
            },
            {
                id: 2,
                username: 'sara_mohamed',
                email: 'sara.m@example.com',
                password: '123456',
                coins: 3200,
                status: 'active',
                avatar: 'https://i.pravatar.cc/150?img=2',
                registeredAt: new Date('2024-01-05').toISOString(),
                lastLogin: new Date().toISOString()
            },
            {
                id: 3,
                username: 'mohamed_taha',
                email: 'm.taha@example.com',
                password: '123456',
                coins: 800,
                status: 'banned',
                avatar: 'https://i.pravatar.cc/150?img=3',
                registeredAt: new Date('2024-01-10').toISOString(),
                lastLogin: new Date('2024-01-15').toISOString()
            }
        ];

        const initialVideos = [
            {
                id: 1,
                title: 'رحلة إلى جبال الألب السويسرية 🏔️',
                description: 'مغامرة رائعة في جبال الألب مع الأصدقاء',
                userId: 1,
                username: 'ahmed_ali',
                videoUrl: 'https://example.com/video1.mp4',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
                views: 12500,
                likes: 2340,
                comments: 156,
                duration: '2:45',
                status: 'active',
                createdAt: new Date('2024-01-12').toISOString()
            },
            {
                id: 2,
                title: 'وصفة كيك الشوكولاتة اللذيذة 🍫',
                description: 'طريقة عمل ألذ كيك شوكولاتة في المنزل',
                userId: 2,
                username: 'sara_mohamed',
                videoUrl: 'https://example.com/video2.mp4',
                thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
                views: 8900,
                likes: 2100,
                comments: 89,
                duration: '4:20',
                status: 'active',
                createdAt: new Date('2024-01-14').toISOString()
            }
        ];

        const initialPayments = [
            {
                id: 1,
                userId: 1,
                username: 'ahmed_ali',
                amount: 50,
                coins: 5000,
                status: 'completed',
                method: 'whatsapp',
                transactionId: 'TX_001',
                createdAt: new Date('2024-01-15').toISOString()
            },
            {
                id: 2,
                userId: 2,
                username: 'sara_mohamed',
                amount: 10,
                coins: 1000,
                status: 'completed',
                method: 'whatsapp',
                transactionId: 'TX_002',
                createdAt: new Date('2024-01-14').toISOString()
            }
        ];

        localStorage.setItem('soshial_users', JSON.stringify(initialUsers));
        localStorage.setItem('soshial_videos', JSON.stringify(initialVideos));
        localStorage.setItem('soshial_payments', JSON.stringify(initialPayments));
        localStorage.setItem('soshial_live_streams', JSON.stringify([]));
        localStorage.setItem('soshial_reports', JSON.stringify([]));
        localStorage.setItem('soshial_settings', JSON.stringify({
            commission_rate: 10,
            min_coins_purchase: 500,
            max_video_size: 100,
            site_name: 'Soshial M'
        }));
    }

    loadAllData() {
        this.users = JSON.parse(localStorage.getItem('soshial_users') || '[]');
        this.videos = JSON.parse(localStorage.getItem('soshial_videos') || '[]');
        this.payments = JSON.parse(localStorage.getItem('soshial_payments') || '[]');
        this.liveStreams = JSON.parse(localStorage.getItem('soshial_live_streams') || '[]');
        this.reports = JSON.parse(localStorage.getItem('soshial_reports') || '[]');
        this.settings = JSON.parse(localStorage.getItem('soshial_settings') || '{}');
    }

    saveAllData() {
        localStorage.setItem('soshial_users', JSON.stringify(this.users));
        localStorage.setItem('soshial_videos', JSON.stringify(this.videos));
        localStorage.setItem('soshial_payments', JSON.stringify(this.payments));
        localStorage.setItem('soshial_live_streams', JSON.stringify(this.liveStreams));
        localStorage.setItem('soshial_reports', JSON.stringify(this.reports));
        localStorage.setItem('soshial_settings', JSON.stringify(this.settings));
    }

    // إدارة المستخدمين
    getAllUsers() {
        return this.users;
    }

    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    getUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    addUser(userData) {
        const newUser = {
            id: this.generateId('user'),
            ...userData,
            coins: userData.coins || 100,
            status: 'active',
            avatar: userData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
            registeredAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveAllData();
        return newUser;
    }

    updateUser(id, updates) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            this.saveAllData();
            return this.users[userIndex];
        }
        return null;
    }

    deleteUser(id) {
        this.users = this.users.filter(user => user.id !== id);
        this.saveAllData();
    }

    // إدارة الفيديوهات
    getAllVideos() {
        return this.videos;
    }

    getVideosByUser(userId) {
        return this.videos.filter(video => video.userId === userId);
    }

    addVideo(videoData) {
        const newVideo = {
            id: this.generateId('video'),
            ...videoData,
            views: 0,
            likes: 0,
            comments: 0,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        this.videos.push(newVideo);
        this.saveAllData();
        return newVideo;
    }

    updateVideo(id, updates) {
        const videoIndex = this.videos.findIndex(video => video.id === id);
        if (videoIndex !== -1) {
            this.videos[videoIndex] = { ...this.videos[videoIndex], ...updates };
            this.saveAllData();
            return this.videos[videoIndex];
        }
        return null;
    }

    deleteVideo(id) {
        this.videos = this.videos.filter(video => video.id !== id);
        this.saveAllData();
    }

    // إدارة المدفوعات
    getAllPayments() {
        return this.payments;
    }

    addPayment(paymentData) {
        const newPayment = {
            id: this.generateId('payment'),
            ...paymentData,
            createdAt: new Date().toISOString()
        };
        
        this.payments.push(newPayment);
        this.saveAllData();
        return newPayment;
    }

    // البث المباشر
    getAllLiveStreams() {
        return this.liveStreams;
    }

    startLiveStream(streamData) {
        const newStream = {
            id: this.generateId('live'),
            ...streamData,
            viewers: 0,
            status: 'live',
            startedAt: new Date().toISOString()
        };
        
        this.liveStreams.push(newStream);
        this.saveAllData();
        return newStream;
    }

    endLiveStream(streamId) {
        const stream = this.liveStreams.find(s => s.id === streamId);
        if (stream) {
            stream.status = 'ended';
            stream.endedAt = new Date().toISOString();
            this.saveAllData();
        }
    }

    // التقارير
    getAllReports() {
        return this.reports;
    }

    addReport(reportData) {
        const newReport = {
            id: this.generateId('report'),
            ...reportData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        this.reports.push(newReport);
        this.saveAllData();
        return newReport;
    }

    // الإحصائيات
    getStatistics() {
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(user => user.status === 'active').length;
        const totalVideos = this.videos.length;
        const totalCoins = this.users.reduce((sum, user) => sum + user.coins, 0);
        const totalIncome = this.payments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
        
        const today = new Date().toDateString();
        const newUsersToday = this.users.filter(user => 
            new Date(user.registeredAt).toDateString() === today
        ).length;

        const newVideosToday = this.videos.filter(video => 
            new Date(video.createdAt).toDateString() === today
        ).length;

        return {
            totalUsers,
            activeUsers,
            totalVideos,
            totalCoins,
            totalIncome,
            newUsersToday,
            newVideosToday
        };
    }

    // وظائف مساعدة
    generateId(prefix) {
        return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    searchUsers(query) {
        const searchTerm = query.toLowerCase();
        return this.users.filter(user => 
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }

    searchVideos(query) {
        const searchTerm = query.toLowerCase();
        return this.videos.filter(video => 
            video.title.toLowerCase().includes(searchTerm) ||
            video.description.toLowerCase().includes(searchTerm) ||
            video.username.toLowerCase().includes(searchTerm)
        );
    }

    // العملات
    addCoinsToUser(userId, coins, reason = '') {
        const user = this.getUserById(userId);
        if (user) {
            user.coins += coins;
            this.saveAllData();
            
            // تسجيل العملية
            this.logTransaction(userId, 'add', coins, reason);
            return user;
        }
        return null;
    }

    removeCoinsFromUser(userId, coins, reason = '') {
        const user = this.getUserById(userId);
        if (user && user.coins >= coins) {
            user.coins -= coins;
            this.saveAllData();
            
            // تسجيل العملية
            this.logTransaction(userId, 'remove', coins, reason);
            return user;
        }
        return null;
    }

    logTransaction(userId, type, amount, reason) {
        const transactions = JSON.parse(localStorage.getItem('soshial_transactions') || '[]');
        const transaction = {
            id: this.generateId('tx'),
            userId,
            type,
            amount,
            reason,
            timestamp: new Date().toISOString()
        };
        
        transactions.push(transaction);
        localStorage.setItem('soshial_transactions', JSON.stringify(transactions));
    }

    getTransactions(userId = null) {
        const transactions = JSON.parse(localStorage.getItem('soshial_transactions') || '[]');
        if (userId) {
            return transactions.filter(tx => tx.userId === userId);
        }
        return transactions;
    }
}

// إنشاء نسخة عالمية من قاعدة البيانات
const adminDB = new AdminDatabase();
