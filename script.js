// ==============================
// CLASS: JobdeskManager
// ==============================
class JobdeskManager {
    constructor() {
        this.jobdesks = [];
        this.loadJobdesks();
    }

    loadJobdesks() {
        const saved = localStorage.getItem('jobdesks');
        this.jobdesks = saved ? JSON.parse(saved) : this.getDefaultJobdesks();
        this.saveJobdesks();
    }

    getDefaultJobdesks() {
        return [
            { id: 1, name: 'Operator', description: 'Operator produksi', color: '#4CAF50' },
            { id: 2, name: 'Quality Control', description: 'Penjamin kualitas', color: '#2196F3' },
            { id: 3, name: 'Maintenance', description: 'Pemeliharaan mesin', color: '#FF9800' },
            { id: 4, name: 'Packing', description: 'Pengemasan produk', color: '#9C27B0' },
            { id: 5, name: 'Gudang', description: 'Pengelolaan gudang', color: '#795548' },
            { id: 6, name: 'Logistik', description: 'Distribusi produk', color: '#607D8B' },
            { id: 7, name: 'Admin', description: 'Administrasi', color: '#E91E63' },
            { id: 8, name: 'Supervisor', description: 'Pengawas produksi', color: '#3F51B5' }
        ];
    }

    saveJobdesks() {
        localStorage.setItem('jobdesks', JSON.stringify(this.jobdesks));
    }

    getJobdeskSelectOptions() {
        return this.jobdesks.map(j => `<option value="${j.name}">${j.name}</option>`).join('');
    }

    addJobdesk(name, description, color) {
        const newJobdesk = {
            id: Date.now(),
            name: name,
            description: description,
            color: color
        };
        this.jobdesks.push(newJobdesk);
        this.saveJobdesks();
        return newJobdesk;
    }

    updateJobdesk(id, name, description, color) {
        const index = this.jobdesks.findIndex(j => j.id === id);
        if (index !== -1) {
            this.jobdesks[index] = { ...this.jobdesks[index], name, description, color };
            this.saveJobdesks();
            return true;
        }
        return false;
    }

    deleteJobdesk(id) {
        const index = this.jobdesks.findIndex(j => j.id === id);
        if (index !== -1) {
            this.jobdesks.splice(index, 1);
            this.saveJobdesks();
            return true;
        }
        return false;
    }
}

// ==============================
// CLASS: SettingsManager
// ==============================
class SettingsManager {
    constructor() {
        this.settings = {
            shiftStart: '05:00',
            shiftEnd: '14:00',
            nightShiftStart: '22:00',
            nightShiftEnd: '06:00',
            regularQuota: 4,
            mealQuota: 3,
            regularDuration: 15,
            mealDuration: 7,
            autoEndPermission: true,
            allowOvertime: false,
            maxOvertimeHours: 2
        };
        this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('systemSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        localStorage.setItem('systemSettings', JSON.stringify(this.settings));
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        return this.settings;
    }

    getSettings() {
        return this.settings;
    }

    validateShiftTime(shiftTime) {
        const [hours, minutes] = shiftTime.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }
}

// ==============================
// CLASS: StaffManager
// ==============================
class StaffManager {
    constructor() {
        this.users = [];
        this.loadUsers();
    }

    loadUsers() {
        const saved = localStorage.getItem('users');
        this.users = saved ? JSON.parse(saved) : this.getSampleUsers();
    }

    getSampleUsers() {
        return [
            {
                id: 1,
                username: 'staff1',
                password: 'staff123',
                name: 'Ahmad Rizki',
                shift: '05:00',
                quota: {
                    regular: 4,
                    meal: 3,
                    usedRegular: 0,
                    usedMeal: 0,
                    lastReset: new Date().toDateString()
                },
                permissions: [],
                isActive: false,
                lastLogin: null
            },
            {
                id: 2,
                username: 'staff2',
                password: 'staff123',
                name: 'Siti Nurhaliza',
                shift: '05:00',
                quota: {
                    regular: 4,
                    meal: 3,
                    usedRegular: 0,
                    usedMeal: 0,
                    lastReset: new Date().toDateString()
                },
                permissions: [],
                isActive: false,
                lastLogin: null
            },
            {
                id: 3,
                username: 'staff3',
                password: 'staff123',
                name: 'Budi Santoso',
                shift: '22:00',
                quota: {
                    regular: 4,
                    meal: 3,
                    usedRegular: 0,
                    usedMeal: 0,
                    lastReset: new Date().toDateString()
                },
                permissions: [],
                isActive: false,
                lastLogin: null
            }
        ];
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    authenticate(username, password) {
        return this.users.find(user => 
            user.username === username && user.password === password
        );
    }

    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    updateUser(id, updates) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            this.saveUsers();
            return this.users[index];
        }
        return null;
    }

    addUser(userData) {
        const newUser = {
            id: Date.now(),
            ...userData,
            quota: {
                regular: 4,
                meal: 3,
                usedRegular: 0,
                usedMeal: 0,
                lastReset: new Date().toDateString()
            },
            permissions: [],
            isActive: false,
            lastLogin: null
        };
        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            this.saveUsers();
            return true;
        }
        return false;
    }

    resetDailyQuotas() {
        const today = new Date().toDateString();
        this.users.forEach(user => {
            if (user.quota.lastReset !== today) {
                user.quota = {
                    regular: 4,
                    meal: 3,
                    usedRegular: 0,
                    usedMeal: 0,
                    lastReset: today
                };
            }
        });
        this.saveUsers();
    }
}

// ==============================
// CLASS: AdminManager
// ==============================
class AdminManager {
    constructor() {
        this.masterPassword = 'aa1234';
        this.isAdminMode = false;
        this.adminSessionTime = 30 * 60 * 1000; // 30 menit
        this.init();
    }

    init() {
        this.checkAdminSession();
        this.setupAdminEvents();
    }

    checkAdminSession() {
        const adminExpiry = localStorage.getItem('adminExpiry');
        if (adminExpiry && new Date().getTime() < parseInt(adminExpiry)) {
            this.isAdminMode = true;
            this.showAdminUI();
        } else {
            this.clearAdminSession();
        }
    }

    setupAdminEvents() {
        // Master password modal events
        document.addEventListener('click', (e) => {
            if (e.target.id === 'master-login-btn') {
                this.verifyMasterPassword();
            }
            if (e.target.id === 'admin-logout-btn') {
                this.logoutAdmin();
            }
            if (e.target.id === 'cancel-master-btn') {
                this.hideMasterModal();
            }
        });

        // Enter key for master password
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'master-password' && e.key === 'Enter') {
                this.verifyMasterPassword();
            }
        });
    }

    verifyMasterPassword() {
        const inputPassword = document.getElementById('master-password').value.trim();
        
        if (inputPassword === this.masterPassword) {
            this.isAdminMode = true;
            const expiryTime = new Date().getTime() + this.adminSessionTime;
            localStorage.setItem('adminExpiry', expiryTime.toString());
            
            this.showAdminUI();
            this.showNotification('success', 'Admin Access Granted', 'Welcome Master Administrator!');
            document.getElementById('master-password').value = '';
            this.hideMasterModal();
        } else {
            this.showNotification('error', 'Access Denied', 'Master password incorrect');
            document.getElementById('master-password').value = '';
            document.getElementById('master-password').focus();
        }
    }

    logoutAdmin() {
        this.isAdminMode = false;
        this.clearAdminSession();
        this.hideAdminUI();
        this.showNotification('info', 'Admin Logout', 'Admin session ended');
    }

    clearAdminSession() {
        localStorage.removeItem('adminExpiry');
    }

    showAdminUI() {
        // Tampilkan tombol admin di header
        const adminBtn = document.getElementById('admin-access-btn');
        if (adminBtn) {
            adminBtn.style.display = 'flex';
            adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin';
        }
        
        // Update settings button untuk admin
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.innerHTML = '<i class="fas fa-user-shield"></i>';
            settingsBtn.style.background = 'linear-gradient(45deg, #ff416c, #ff4b2b)';
            settingsBtn.title = 'Admin Settings';
        }
    }

    hideAdminUI() {
        const adminBtn = document.getElementById('admin-access-btn');
        if (adminBtn) adminBtn.style.display = 'none';
        
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
            settingsBtn.style.background = 'linear-gradient(45deg, var(--accent-blue), var(--primary-light))';
            settingsBtn.title = 'Settings';
        }
        
        // Tutup settings modal jika terbuka
        const settingsModal = document.getElementById('settings-overlay');
        if (settingsModal) settingsModal.style.display = 'none';
    }

    showMasterModal() {
        document.getElementById('master-modal').style.display = 'flex';
        document.getElementById('master-password').focus();
    }

    hideMasterModal() {
        document.getElementById('master-modal').style.display = 'none';
        document.getElementById('master-password').value = '';
    }

    showNotification(type, title, message) {
        if (window.staffSystem && window.staffSystem.showNotification) {
            window.staffSystem.showNotification(type, title, message);
        } else {
            alert(`${title}: ${message}`);
        }
    }

    requireAdmin(callback) {
        if (this.isAdminMode) {
            callback();
        } else {
            this.showMasterModal();
        }
    }
}

// ==============================
// CLASS: StaffPermissionSystem (MAIN CLASS)
// ==============================
class StaffPermissionSystem {
    constructor() {
        this.currentUser = null;
        this.activePermission = null;
        this.permissionTimer = null;
        this.dailyResetCheckDone = false;
        
        // Inisialisasi semua manager
        this.jobdeskManager = new JobdeskManager();
        this.settingsManager = new SettingsManager();
        this.staffManager = new StaffManager();
        this.adminManager = new AdminManager();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initClock();
        this.checkLoginStatus();
        this.checkDailyReset();
        this.initManagers();
        this.initAdminFeatures();
        
        // Update jobdesk select options
        this.updateJobdeskSelect();
    }
    
    initAdminFeatures() {
        // Setup admin event listeners
        const adminBtn = document.getElementById('admin-access-btn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                this.adminManager.requireAdmin(() => {
                    this.openSettings();
                });
            });
        }
        
        // Settings button untuk admin/staff
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                if (this.adminManager.isAdminMode) {
                    this.openSettings();
                } else if (this.currentUser) {
                    // Untuk staff biasa, hanya tampilkan info sederhana
                    this.showStaffInfoModal();
                } else {
                    this.showNotification('info', 'Login Required', 'Silakan login terlebih dahulu');
                }
            });
        }
    }
    
    initManagers() {
        // Load initial data if needed
        if (!localStorage.getItem('users')) {
            this.staffManager.saveUsers();
        }
        if (!localStorage.getItem('activePermissions')) {
            localStorage.setItem('activePermissions', JSON.stringify([]));
        }
    }
    
    showStaffInfoModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card">
                <h2><i class="fas fa-info-circle"></i> INFORMASI STAFF</h2>
                <div class="staff-info-content">
                    <p><i class="fas fa-user"></i> <strong>Nama:</strong> ${this.currentUser?.name || '-'}</p>
                    <p><i class="fas fa-clock"></i> <strong>Shift:</strong> ${this.currentUser?.shift || '-'}</p>
                    <p><i class="fas fa-stopwatch"></i> <strong>Kuota Izin:</strong> 
                        ${this.currentUser?.quota?.usedRegular || 0}/${this.currentUser?.quota?.regular || 4} regular, 
                        ${this.currentUser?.quota?.usedMeal || 0}/${this.currentUser?.quota?.meal || 3} makan
                    </p>
                    <p><i class="fas fa-history"></i> <strong>Total Izin:</strong> ${this.currentUser?.permissions?.length || 0} kali</p>
                </div>
                <button class="btn-primary close-modal">TUTUP</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    setupEventListeners() {
        // Login
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        
        // Permission
        document.getElementById('submit-permission').addEventListener('click', () => this.submitPermission());
        document.getElementById('end-permission').addEventListener('click', () => this.endPermission());
        
        // Permission type selection
        document.querySelectorAll('.permission-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.permission-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
        
        // History
        document.getElementById('refresh-history').addEventListener('click', () => this.loadHistory());
        
        // Enter key for login
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });
        
        // Close timer overlay
        document.getElementById('close-timer').addEventListener('click', () => {
            document.getElementById('timer-overlay').style.display = 'none';
        });
    }

    checkLoginStatus() {
        const user = localStorage.getItem('currentUser');
        const lastLogin = localStorage.getItem('lastLogin');
        
        if (user && lastLogin) {
            const now = new Date();
            const lastLoginDate = new Date(lastLogin);
            const hoursDiff = (now - lastLoginDate) / (1000 * 60 * 60);
            
            // Auto logout setelah 8 jam
            if (hoursDiff < 8) {
                this.currentUser = JSON.parse(user);
                this.showDashboard();
                this.loadUserData();
            } else {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('lastLogin');
                this.showNotification('info', 'Session Expired', 'Silakan login kembali');
            }
        }
    }

    checkDailyReset() {
        const today = new Date().toDateString();
        const lastReset = localStorage.getItem('lastDailyReset');
        
        if (lastReset !== today) {
            this.staffManager.resetDailyQuotas();
            localStorage.setItem('lastDailyReset', today);
            
            // Reset active permissions yang sudah lewat
            const activePerms = JSON.parse(localStorage.getItem('activePermissions') || '[]');
            const updatedPerms = activePerms.filter(perm => {
                const permDate = new Date(perm.startTime).toDateString();
                return permDate === today || !perm.ended;
            });
            localStorage.setItem('activePermissions', JSON.stringify(updatedPerms));
        }
    }

    updateJobdeskSelect() {
        const select = document.getElementById('jobdesk-select');
        if (select) {
            select.innerHTML = `
                <option value="">Pilih Jobdesk</option>
                ${this.jobdeskManager.getJobdeskSelectOptions()}
            `;
        }
    }

    login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            this.showNotification('error', 'Login Gagal', 'Username dan password harus diisi');
            return;
        }
        
        const user = this.staffManager.authenticate(username, password);
        
        if (!user) {
            this.showNotification('error', 'Login Gagal', 'Username atau password salah');
            return;
        }
        
        // Check shift time (2 jam dari waktu shift)
        const now = new Date();
        const shiftTime = new Date();
        const [shiftHour, shiftMinute] = user.shift.split(':').map(Number);
        
        shiftTime.setHours(shiftHour, shiftMinute, 0, 0);
        const shiftEnd = new Date(shiftTime.getTime() + (2 * 60 * 60 * 1000)); // +2 jam
        
        if (now < shiftTime || now > shiftEnd) {
            this.showNotification('warning', 'Waktu Login', `Hanya bisa login dari ${user.shift} sampai ${this.formatTime(shiftEnd)}`);
            return;
        }
        
        // Update user status
        this.currentUser = user;
        this.staffManager.updateUser(user.id, {
            isActive: true,
            lastLogin: new Date().toISOString()
        });
        
        // Save session
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        this.showDashboard();
        this.loadUserData();
        this.showNotification('success', 'Login Berhasil', `Selamat datang ${user.name}!`);
    }

    logout() {
        if (this.activePermission) {
            this.endPermission();
        }
        
        if (this.currentUser) {
            this.staffManager.updateUser(this.currentUser.id, { isActive: false });
        }
        
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lastLogin');
        this.currentUser = null;
        this.showLogin();
        this.showNotification('info', 'Logout', 'Anda telah logout dari sistem');
    }

    showDashboard() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
        document.getElementById('staff-name').textContent = this.currentUser.name;
    }

    showLogin() {
        document.getElementById('dashboard-screen').classList.remove('active');
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
    }

    loadUserData() {
        if (!this.currentUser) return;
        
        // Update user data from storage
        const updatedUser = this.staffManager.getUserById(this.currentUser.id);
        if (updatedUser) {
            this.currentUser = updatedUser;
        }
        
        // Update quota display
        const regularLeft = this.currentUser.quota.regular - this.currentUser.quota.usedRegular;
        const mealLeft = this.currentUser.quota.meal - this.currentUser.quota.usedMeal;
        
        document.getElementById('regular-left').textContent = Math.max(0, regularLeft);
        document.getElementById('meal-left').textContent = Math.max(0, mealLeft);
        
        // Update progress bars
        const regularPercent = (this.currentUser.quota.usedRegular / this.currentUser.quota.regular) * 100;
        const mealPercent = (this.currentUser.quota.usedMeal / this.currentUser.quota.meal) * 100;
        
        document.getElementById('regular-progress').style.width = `${regularPercent}%`;
        document.getElementById('meal-progress').style.width = `${mealPercent}%`;
        
        document.getElementById('regular-used').textContent = this.currentUser.quota.usedRegular;
        document.getElementById('meal-used').textContent = this.currentUser.quota.usedMeal;
        
        // Check if user has active permission
        const activePerms = JSON.parse(localStorage.getItem('activePermissions') || '[]');
        const userActivePerm = activePerms.find(p => p.userId === this.currentUser.id && !p.ended);
        
        if (userActivePerm) {
            this.activePermission = userActivePerm;
            this.startPermissionTimer(userActivePerm);
        } else {
            this.activePermission = null;
        }
        
        this.loadActiveStaff();
        this.loadHistory();
    }

    submitPermission() {
        if (!this.currentUser) {
            this.showNotification('error', 'Login Required', 'Silakan login terlebih dahulu');
            return;
        }
        
        const jobdesk = document.getElementById('jobdesk-select').value;
        const note = document.getElementById('permission-note').value.trim();
        const activeBtn = document.querySelector('.permission-btn.active');
        
        if (!jobdesk) {
            this.showNotification('warning', 'Perhatian', 'Pilih jobdesk terlebih dahulu');
            return;
        }
        
        if (!activeBtn) {
            this.showNotification('warning', 'Perhatian', 'Pilih jenis izin terlebih dahulu');
            return;
        }
        
        const type = activeBtn.dataset.type;
        const duration = parseInt(activeBtn.dataset.duration);
        
        // Check quota
        if (type === 'regular' && this.currentUser.quota.usedRegular >= this.currentUser.quota.regular) {
            this.showNotification('warning', 'Kuota Habis', 'Kuota izin regular sudah habis untuk hari ini');
            return;
        }
        
        if (type === 'meal' && this.currentUser.quota.usedMeal >= this.currentUser.quota.meal) {
            this.showNotification('warning', 'Kuota Habis', 'Kuota izin makan sudah habis untuk hari ini');
            return;
        }
        
        // Check if already has active permission
        if (this.activePermission) {
            this.showNotification('warning', 'Izin Aktif', 'Anda masih memiliki izin aktif');
            return;
        }
        
        // Check if same jobdesk has active permission from other user
        const activePerms = JSON.parse(localStorage.getItem('activePermissions') || '[]');
        const sameJobdeskActive = activePerms.find(p => p.jobdesk === jobdesk && !p.ended);
        
        if (sameJobdeskActive) {
            this.showNotification('warning', 'Jobdesk Sibuk', `Jobdesk ${jobdesk} sedang digunakan oleh staff lain`);
            return;
        }
        
        // Create permission
        const permission = {
            id: Date.now(),
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            type: type,
            jobdesk: jobdesk,
            note: note,
            duration: duration,
            startTime: new Date().toISOString(),
            endTime: null,
            ended: false
        };
        
        // Update quota
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            if (type === 'regular') {
                users[userIndex].quota.usedRegular += 1;
            } else if (type === 'meal') {
                users[userIndex].quota.usedMeal += 1;
            }
            
            // Save permission to user history
            if (!users[userIndex].permissions) {
                users[userIndex].permissions = [];
            }
            users[userIndex].permissions.push({
                ...permission,
                startTime: new Date().toLocaleString('id-ID'),
                endTime: null,
                ended: false
            });
            
            localStorage.setItem('users', JSON.stringify(users));
            this.currentUser = users[userIndex];
        }
        
        // Add to active permissions
        activePerms.push(permission);
        localStorage.setItem('activePermissions', JSON.stringify(activePerms));
        
        // Start timer
        this.activePermission = permission;
        this.startPermissionTimer(permission);
        
        // Update UI
        this.loadUserData();
        this.loadActiveStaff();
        
        // Reset form
        document.getElementById('jobdesk-select').value = '';
        document.getElementById('permission-note').value = '';
        document.querySelectorAll('.permission-btn').forEach(b => b.classList.remove('active'));
        
        this.showNotification('success', 'Izin Disetujui', `Izin ${type} dimulai untuk ${duration} menit`);
    }

    startPermissionTimer(permission) {
        const startTime = new Date(permission.startTime).getTime();
        const durationMs = permission.duration * 60 * 1000;
        const endTime = startTime + durationMs;
        
        this.updateTimerDisplay(endTime);
        document.getElementById('timer-jobdesk').textContent = permission.jobdesk;
        document.getElementById('timer-overlay').style.display = 'flex';
        
        // Update timer every second
        if (this.permissionTimer) clearInterval(this.permissionTimer);
        
        this.permissionTimer = setInterval(() => {
            this.updateTimerDisplay(endTime);
        }, 1000);
        
        // Auto-end when time is up
        setTimeout(() => {
            if (this.activePermission?.id === permission.id) {
                this.endPermission();
                this.showNotification('info', 'Waktu Habis', 'Waktu izin telah berakhir');
            }
        }, durationMs);
    }

    updateTimerDisplay(endTime) {
        const now = new Date().getTime();
        const remainingMs = Math.max(0, endTime - now);
        
        const minutes = Math.floor(remainingMs / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
        
        // Update text display
        document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0');
        document.getElementById('time-remaining').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Update circular progress
        const totalDuration = this.activePermission?.duration * 60 || 900;
        const elapsed = totalDuration - (minutes * 60 + seconds);
        const progress = (elapsed / totalDuration) * 283;
        
        const circle = document.querySelector('.timer-circle');
        if (circle) {
            circle.style.strokeDashoffset = 283 - progress;
        }
        
        // Update color based on remaining time
        if (minutes < 3) {
            circle.style.stroke = '#ff4444';
            document.getElementById('timer-minutes').style.color = '#ff4444';
            document.getElementById('timer-seconds').style.color = '#ff4444';
        } else if (minutes < 5) {
            circle.style.stroke = '#ffaa00';
            document.getElementById('timer-minutes').style.color = '#ffaa00';
            document.getElementById('timer-seconds').style.color = '#ffaa00';
        } else {
            circle.style.stroke = '#4CAF50';
            document.getElementById('timer-minutes').style.color = '#4CAF50';
            document.getElementById('timer-seconds').style.color = '#4CAF50';
        }
    }

    endPermission() {
        if (!this.activePermission) return;
        
        clearInterval(this.permissionTimer);
        
        // Update permission as ended
        const activePerms = JSON.parse(localStorage.getItem('activePermissions') || '[]');
        const permIndex = activePerms.findIndex(p => p.id === this.activePermission.id);
        
        if (permIndex !== -1) {
            activePerms[permIndex].ended = true;
            activePerms[permIndex].endTime = new Date().toISOString();
            localStorage.setItem('activePermissions', JSON.stringify(activePerms));
        }
        
        // Update user permission in history
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1 && users[userIndex].permissions) {
            const userPermIndex = users[userIndex].permissions.findIndex(
                p => p.id === this.activePermission.id
            );
            
            if (userPermIndex !== -1) {
                users[userIndex].permissions[userPermIndex].endTime = new Date().toLocaleString('id-ID');
                users[userIndex].permissions[userPermIndex].ended = true;
                localStorage.setItem('users', JSON.stringify(users));
                this.currentUser = users[userIndex];
            }
        }
        
        // Reset
        this.activePermission = null;
        document.getElementById('timer-overlay').style.display = 'none';
        
        // Update displays
        this.loadUserData();
        this.loadActiveStaff();
        
        this.showNotification('success', 'Izin Selesai', 'Izin telah diakhiri');
    }

    loadActiveStaff() {
        const activePerms = JSON.parse(localStorage.getItem('activePermissions') || '[]');
        const activeNow = activePerms.filter(p => !p.ended);
        
        const container = document.getElementById('active-staff-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (activeNow.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users-slash"></i>
                    <p>Tidak ada staff yang sedang izin</p>
                </div>
            `;
            return;
        }
        
        activeNow.forEach(perm => {
            const startTime = new Date(perm.startTime);
            const now = new Date();
            const elapsedMs = now - startTime;
            const elapsedMin = Math.floor(elapsedMs / (1000 * 60));
            const elapsedSec = Math.floor((elapsedMs % (1000 * 60)) / 1000);
            
            const item = document.createElement('div');
            item.className = 'active-staff-item';
            item.innerHTML = `
                <div class="staff-avatar" style="background: ${this.getJobdeskColor(perm.jobdesk)}">
                    ${perm.userName.charAt(0)}
                </div>
                <div class="staff-details">
                    <h4>${perm.userName}</h4>
                    <p>${perm.jobdesk} • ${perm.type === 'regular' ? 'Izin' : 'Makan'}</p>
                    <small>${perm.note || 'Tanpa keterangan'}</small>
                </div>
                <div class="permission-time">
                    ${elapsedMin}:${elapsedSec.toString().padStart(2, '0')}
                </div>
            `;
            container.appendChild(item);
        });
    }

    getJobdeskColor(jobdeskName) {
        const jobdesk = this.jobdeskManager.jobdesks.find(j => j.name === jobdeskName);
        return jobdesk ? jobdesk.color : '#607D8B';
    }

    loadHistory() {
        if (!this.currentUser) return;
        
        const date = document.getElementById('history-date').value;
        const userHistory = this.currentUser.permissions || [];
        
        // Filter by date if selected
        const filteredHistory = userHistory.filter(perm => {
            if (!date) return true;
            const permDate = new Date(perm.startTime).toISOString().split('T')[0];
            return permDate === date;
        }).sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Show latest first
        
        const container = document.getElementById('history-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (filteredHistory.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>Tidak ada riwayat izin</p>
                </div>
            `;
            return;
        }
        
        filteredHistory.forEach(perm => {
            const typeClass = perm.type === 'regular' ? 'regular' : 'meal';
            const typeText = perm.type === 'regular' ? 'Izin 15m' : 'Makan 7m';
            const startTime = new Date(perm.startTime).toLocaleString('id-ID');
            const endTime = perm.endTime ? new Date(perm.endTime).toLocaleString('id-ID') : 'Masih aktif';
            
            const item = document.createElement('div');
            item.className = `history-item ${typeClass}`;
            item.innerHTML = `
                <div class="history-header">
                    <span class="history-type ${typeClass}">${typeText}</span>
                    <span class="history-time">${startTime}</span>
                </div>
                <div class="history-details">
                    <p><strong>Jobdesk:</strong> ${perm.jobdesk}</p>
                    ${perm.note ? `<p><strong>Keterangan:</strong> ${perm.note}</p>` : ''}
                    <p><strong>Waktu Selesai:</strong> ${endTime}</p>
                    <small>Status: ${perm.ended ? 'Selesai' : 'Aktif'} • Durasi: ${perm.duration} menit</small>
                </div>
            `;
            container.appendChild(item);
        });
    }

    initClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('id-ID', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const dateString = now.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const clockElement = document.getElementById('live-clock');
            const dateElement = document.getElementById('live-date');
            
            if (clockElement) {
                clockElement.textContent = timeString;
            }
            if (dateElement) {
                dateElement.textContent = dateString;
            }
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }

    openSettings() {
        this.adminManager.requireAdmin(() => {
            // Buat modal settings
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.id = 'settings-overlay';
            
            modal.innerHTML = `
                <div class="modal-card" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-user-shield"></i> ADMIN SETTINGS</h2>
                        <button class="close-btn" id="close-settings">&times;</button>
                    </div>
                    
                    <div class="settings-tabs">
                        <button class="tab-btn active" data-tab="system">System</button>
                        <button class="tab-btn" data-tab="staff">Staff</button>
                        <button class="tab-btn" data-tab="jobdesk">Jobdesk</button>
                        <button class="tab-btn" data-tab="logs">Logs</button>
                    </div>
                    
                    <div class="settings-content">
                        <div id="system-tab" class="tab-content active">
                            ${this.renderSystemSettings()}
                        </div>
                        <div id="staff-tab" class="tab-content">
                            ${this.renderStaffSettings()}
                        </div>
                        <div id="jobdesk-tab" class="tab-content">
                            ${this.renderJobdeskSettings()}
                        </div>
                        <div id="logs-tab" class="tab-content">
                            ${this.renderLogsSettings()}
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn-secondary" id="close-settings-btn">Close</button>
                        <button class="btn-primary" id="save-settings">Save Changes</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Setup tab functionality
            modal.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tabName = e.target.dataset.tab;
                    
                    // Update active tab
                    modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // Show corresponding content
                    modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    modal.querySelector(`#${tabName}-tab`).classList.add('active');
                });
            });
            
            // Close buttons
            modal.querySelector('#close-settings').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            modal.querySelector('#close-settings-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
            
            // Save settings
            modal.querySelector('#save-settings').addEventListener('click', () => {
                this.saveSystemSettings();
                document.body.removeChild(modal);
                this.showNotification('success', 'Settings Saved', 'System settings updated successfully');
            });
            
            // Setup staff management events
            this.setupStaffManagementEvents(modal);
            this.setupJobdeskManagementEvents(modal);
        });
    }
    
    renderSystemSettings() {
        const settings = this.settingsManager.getSettings();
        return `
            <div class="form-group">
                <label><i class="fas fa-clock"></i> Shift Pagi (Mulai - Selesai)</label>
                <div class="input-group">
                    <input type="time" id="shift-start" value="${settings.shiftStart}">
                    <input type="time" id="shift-end" value="${settings.shiftEnd}">
                </div>
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-moon"></i> Shift Malam (Mulai - Selesai)</label>
                <div class="input-group">
                    <input type="time" id="night-shift-start" value="${settings.nightShiftStart}">
                    <input type="time" id="night-shift-end" value="${settings.nightShiftEnd}">
                </div>
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-chart-bar"></i> Kuota Harian</label>
                <div class="input-group">
                    <div class="input-with-label">
                        <label>Izin Regular</label>
                        <input type="number" id="regular-quota" value="${settings.regularQuota}" min="1" max="10">
                    </div>
                    <div class="input-with-label">
                        <label>Izin Makan</label>
                        <input type="number" id="meal-quota" value="${settings.mealQuota}" min="1" max="10">
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-hourglass-half"></i> Durasi Izin (menit)</label>
                <div class="input-group">
                    <div class="input-with-label">
                        <label>Regular</label>
                        <input type="number" id="regular-duration" value="${settings.regularDuration}" min="1" max="60">
                    </div>
                    <div class="input-with-label">
                        <label>Makan</label>
                        <input type="number" id="meal-duration" value="${settings.mealDuration}" min="1" max="60">
                    </div>
                </div>
            </div>
            
            <div class="form-group checkbox-group">
                <label>
                    <input type="checkbox" id="auto-end-permission" ${settings.autoEndPermission ? 'checked' : ''}>
                    <span>Otomatis akhiri izin ketika waktu habis</span>
                </label>
            </div>
            
            <div class="form-group checkbox-group">
                <label>
                    <input type="checkbox" id="allow-overtime" ${settings.allowOvertime ? 'checked' : ''}>
                    <span>Izinkan login overtime</span>
                </label>
            </div>
            
            <div class="form-group" id="overtime-settings" style="${settings.allowOvertime ? '' : 'display: none;'}">
                <label><i class="fas fa-business-time"></i> Maksimal Overtime (jam)</label>
                <input type="number" id="max-overtime" value="${settings.maxOvertimeHours}" min="1" max="8">
            </div>
            
            <script>
                document.getElementById('allow-overtime').addEventListener('change', function() {
                    document.getElementById('overtime-settings').style.display = this.checked ? 'block' : 'none';
                });
            </script>
        `;
    }
    
    renderStaffSettings() {
        const staffList = this.staffManager.users;
        return `
            <div class="section-header">
                <h3><i class="fas fa-users"></i> Staff Management</h3>
                <button class="btn-small btn-primary" id="add-staff-btn">
                    <i class="fas fa-plus"></i> Add Staff
                </button>
            </div>
            
            <div class="staff-list">
                ${staffList.map(staff => `
                    <div class="staff-item" data-id="${staff.id}">
                        <div class="staff-info">
                            <div class="staff-avatar-small">${staff.name.charAt(0)}</div>
                            <div>
                                <h4>${staff.name}</h4>
                                <p>${staff.username} • Shift: ${staff.shift}</p>
                                <small>Kuota: ${staff.quota.usedRegular}/${staff.quota.regular} regular, ${staff.quota.usedMeal}/${staff.quota.meal} makan</small>
                            </div>
                        </div>
                        <div class="staff-actions">
                            <button class="btn-icon edit-staff" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete-staff" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderJobdeskSettings() {
        const jobdesks = this.jobdeskManager.jobdesks;
        return `
            <div class="section-header">
                <h3><i class="fas fa-tasks"></i> Jobdesk Management</h3>
                <button class="btn-small btn-primary" id="add-jobdesk-btn">
                    <i class="fas fa-plus"></i> Add Jobdesk
                </button>
            </div>
            
            <div class="jobdesk-list">
                ${jobdesks.map(jobdesk => `
                    <div class="jobdesk-item" data-id="${jobdesk.id}" style="border-left: 4px solid ${jobdesk.color};">
                        <div class="jobdesk-info">
                            <h4>${jobdesk.name}</h4>
                            <p>${jobdesk.description}</p>
                        </div>
                        <div class="jobdesk-actions">
                            <button class="btn-icon edit-jobdesk" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete-jobdesk" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderLogsSettings() {
        const allUsers = this.staffManager.users;
        let allPermissions = [];
        
        allUsers.forEach(user => {
            if (user.permissions && user.permissions.length > 0) {
                user.permissions.forEach(perm => {
                    allPermissions.push({
                        ...perm,
                        userName: user.name
                    });
                });
            }
        });
        
        // Sort by date (newest first)
        allPermissions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        
        return `
            <div class="section-header">
                <h3><i class="fas fa-clipboard-list"></i> System Logs</h3>
                <button class="btn-small btn-secondary" id="export-logs">
                    <i class="fas fa-download"></i> Export CSV
                </button>
            </div>
            
            <div class="logs-list">
                ${allPermissions.length > 0 ? allPermissions.slice(0, 50).map(log => `
                    <div class="log-item ${log.type}">
                        <div class="log-header">
                            <span class="log-user">${log.userName}</span>
                            <span class="log-time">${new Date(log.startTime).toLocaleString('id-ID')}</span>
                        </div>
                        <div class="log-details">
                            <span class="log-type ${log.type}">${log.type === 'regular' ? 'IZIN' : 'MAKAN'}</span>
                            <span class="log-jobdesk">${log.jobdesk}</span>
                            <span class="log-status ${log.ended ? 'completed' : 'active'}">
                                ${log.ended ? 'SELESAI' : 'AKTIF'}
                            </span>
                        </div>
                        ${log.note ? `<p class="log-note">${log.note}</p>` : ''}
                    </div>
                `).join('') : '<p class="empty-state">No logs available</p>'}
            </div>
        `;
    }
    
    setupStaffManagementEvents(modal) {
        // Add staff button
        modal.querySelector('#add-staff-btn')?.addEventListener('click', () => {
            this.showAddStaffModal();
        });
        
        // Edit staff buttons
        modal.querySelectorAll('.edit-staff').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const staffId = parseInt(e.target.closest('.staff-item').dataset.id);
                this.showEditStaffModal(staffId);
            });
        });
        
        // Delete staff buttons
        modal.querySelectorAll('.delete-staff').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const staffId = parseInt(e.target.closest('.staff-item').dataset.id);
                const staff = this.staffManager.getUserById(staffId);
                
                if (staff && confirm(`Delete staff ${staff.name}? This action cannot be undone.`)) {
                    this.staffManager.deleteUser(staffId);
                    this.showNotification('success', 'Staff Deleted', `${staff.name} has been removed`);
                    // Refresh staff list
                    const staffTab = modal.querySelector('#staff-tab');
                    if (staffTab) {
                        staffTab.innerHTML = this.renderStaffSettings();
                        this.setupStaffManagementEvents(modal);
                    }
                }
            });
        });
    }
    
    setupJobdeskManagementEvents(modal) {
        // Add jobdesk button
        modal.querySelector('#add-jobdesk-btn')?.addEventListener('click', () => {
            this.showAddJobdeskModal();
        });
        
        // Edit jobdesk buttons
        modal.querySelectorAll('.edit-jobdesk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobdeskId = parseInt(e.target.closest('.jobdesk-item').dataset.id);
                this.showEditJobdeskModal(jobdeskId);
            });
        });
        
        // Delete jobdesk buttons
        modal.querySelectorAll('.delete-jobdesk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobdeskId = parseInt(e.target.closest('.jobdesk-item').dataset.id);
                const jobdesk = this.jobdeskManager.jobdesks.find(j => j.id === jobdeskId);
                
                if (jobdesk && confirm(`Delete jobdesk ${jobdesk.name}? This action cannot be undone.`)) {
                    this.jobdeskManager.deleteJobdesk(jobdeskId);
                    this.updateJobdeskSelect();
                    this.showNotification('success', 'Jobdesk Deleted', `${jobdesk.name} has been removed`);
                    // Refresh jobdesk list
                    const jobdeskTab = modal.querySelector('#jobdesk-tab');
                    if (jobdeskTab) {
                        jobdeskTab.innerHTML = this.renderJobdeskSettings();
                        this.setupJobdeskManagementEvents(modal);
                    }
                }
            });
        });
    }
    
    showAddStaffModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width: 500px;">
                <h2><i class="fas fa-user-plus"></i> Add New Staff</h2>
                
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="new-staff-name" placeholder="Enter full name" required>
                </div>
                
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="new-staff-username" placeholder="Enter username" required>
                </div>
                
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="new-staff-password" placeholder="Enter password" required>
                </div>
                
                <div class="form-group">
                    <label>Shift Time</label>
                    <select id="new-staff-shift">
                        <option value="05:00">Pagi (05:00)</option>
                        <option value="22:00">Malam (22:00)</option>
                        <option value="08:00">Siang (08:00)</option>
                        <option value="14:00">Sore (14:00)</option>
                    </select>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancel-add-staff">Cancel</button>
                    <button class="btn-primary" id="save-new-staff">Save Staff</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#cancel-add-staff').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#save-new-staff').addEventListener('click', () => {
            const name = modal.querySelector('#new-staff-name').value.trim();
            const username = modal.querySelector('#new-staff-username').value.trim();
            const password = modal.querySelector('#new-staff-password').value.trim();
            const shift = modal.querySelector('#new-staff-shift').value;
            
            if (!name || !username || !password) {
                this.showNotification('error', 'Validation Error', 'All fields are required');
                return;
            }
            
            // Check if username already exists
            if (this.staffManager.users.some(u => u.username === username)) {
                this.showNotification('error', 'Duplicate Username', 'Username already exists');
                return;
            }
            
            const newStaff = this.staffManager.addUser({
                name: name,
                username: username,
                password: password,
                shift: shift
            });
            
            this.showNotification('success', 'Staff Added', `${name} has been added to the system`);
            document.body.removeChild(modal);
            
            // Refresh settings modal if open
            const settingsModal = document.querySelector('#settings-overlay');
            if (settingsModal) {
                const staffTab = settingsModal.querySelector('#staff-tab');
                if (staffTab) {
                    staffTab.innerHTML = this.renderStaffSettings();
                    this.setupStaffManagementEvents(settingsModal);
                }
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    showEditStaffModal(staffId) {
        const staff = this.staffManager.getUserById(staffId);
        if (!staff) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width: 500px;">
                <h2><i class="fas fa-user-edit"></i> Edit Staff</h2>
                
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="edit-staff-name" value="${staff.name}" required>
                </div>
                
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="edit-staff-username" value="${staff.username}" required>
                </div>
                
                <div class="form-group">
                    <label>Password (leave blank to keep current)</label>
                    <input type="password" id="edit-staff-password" placeholder="Enter new password">
                </div>
                
                <div class="form-group">
                    <label>Shift Time</label>
                    <select id="edit-staff-shift">
                        <option value="05:00" ${staff.shift === '05:00' ? 'selected' : ''}>Pagi (05:00)</option>
                        <option value="22:00" ${staff.shift === '22:00' ? 'selected' : ''}>Malam (22:00)</option>
                        <option value="08:00" ${staff.shift === '08:00' ? 'selected' : ''}>Siang (08:00)</option>
                        <option value="14:00" ${staff.shift === '14:00' ? 'selected' : ''}>Sore (14:00)</option>
                    </select>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancel-edit-staff">Cancel</button>
                    <button class="btn-primary" id="save-edit-staff">Update Staff</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#cancel-edit-staff').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#save-edit-staff').addEventListener('click', () => {
            const name = modal.querySelector('#edit-staff-name').value.trim();
            const username = modal.querySelector('#edit-staff-username').value.trim();
            const password = modal.querySelector('#edit-staff-password').value.trim();
            const shift = modal.querySelector('#edit-staff-shift').value;
            
            if (!name || !username) {
                this.showNotification('error', 'Validation Error', 'Name and username are required');
                return;
            }
            
            // Check if username already exists (excluding current user)
            if (this.staffManager.users.some(u => u.username === username && u.id !== staffId)) {
                this.showNotification('error', 'Duplicate Username', 'Username already exists');
                return;
            }
            
            const updates = {
                name: name,
                username: username,
                shift: shift
            };
            
            if (password) {
                updates.password = password;
            }
            
            this.staffManager.updateUser(staffId, updates);
            
            // Update current user if it's the same user
            if (this.currentUser && this.currentUser.id === staffId) {
                this.currentUser = { ...this.currentUser, ...updates };
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.loadUserData();
            }
            
            this.showNotification('success', 'Staff Updated', `${name} has been updated`);
            document.body.removeChild(modal);
            
            // Refresh settings modal if open
            const settingsModal = document.querySelector('#settings-overlay');
            if (settingsModal) {
                const staffTab = settingsModal.querySelector('#staff-tab');
                if (staffTab) {
                    staffTab.innerHTML = this.renderStaffSettings();
                    this.setupStaffManagementEvents(settingsModal);
                }
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    showAddJobdeskModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width: 500px;">
                <h2><i class="fas fa-tasks"></i> Add New Jobdesk</h2>
                
                <div class="form-group">
                    <label>Jobdesk Name</label>
                    <input type="text" id="new-jobdesk-name" placeholder="Enter jobdesk name" required>
                </div>
                
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="new-jobdesk-desc" placeholder="Enter description" rows="3"></textarea>
                </div>
                
                <div class="form-group">
                    <label>Color</label>
                    <input type="color" id="new-jobdesk-color" value="#4CAF50">
                </div>
                
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancel-add-jobdesk">Cancel</button>
                    <button class="btn-primary" id="save-new-jobdesk">Save Jobdesk</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#cancel-add-jobdesk').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#save-new-jobdesk').addEventListener('click', () => {
            const name = modal.querySelector('#new-jobdesk-name').value.trim();
            const description = modal.querySelector('#new-jobdesk-desc').value.trim();
            const color = modal.querySelector('#new-jobdesk-color').value;
            
            if (!name) {
                this.showNotification('error', 'Validation Error', 'Jobdesk name is required');
                return;
            }
            
            // Check if jobdesk already exists
            if (this.jobdeskManager.jobdesks.some(j => j.name === name)) {
                this.showNotification('error', 'Duplicate Jobdesk', 'Jobdesk already exists');
                return;
            }
            
            this.jobdeskManager.addJobdesk(name, description, color);
            this.updateJobdeskSelect();
            
            this.showNotification('success', 'Jobdesk Added', `${name} has been added to jobdesks`);
            document.body.removeChild(modal);
            
            // Refresh settings modal if open
            const settingsModal = document.querySelector('#settings-overlay');
            if (settingsModal) {
                const jobdeskTab = settingsModal.querySelector('#jobdesk-tab');
                if (jobdeskTab) {
                    jobdeskTab.innerHTML = this.renderJobdeskSettings();
                    this.setupJobdeskManagementEvents(settingsModal);
                }
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    showEditJobdeskModal(jobdeskId) {
        const jobdesk = this.jobdeskManager.jobdesks.find(j => j.id === jobdeskId);
        if (!jobdesk) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width: 500px;">
                <h2><i class="fas fa-tasks"></i> Edit Jobdesk</h2>
                
                <div class="form-group">
                    <label>Jobdesk Name</label>
                    <input type="text" id="edit-jobdesk-name" value="${jobdesk.name}" required>
                </div>
                
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="edit-jobdesk-desc" placeholder="Enter description" rows="3">${jobdesk.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Color</label>
                    <input type="color" id="edit-jobdesk-color" value="${jobdesk.color || '#4CAF50'}">
                </div>
                
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancel-edit-jobdesk">Cancel</button>
                    <button class="btn-primary" id="save-edit-jobdesk">Update Jobdesk</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#cancel-edit-jobdesk').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#save-edit-jobdesk').addEventListener('click', () => {
            const name = modal.querySelector('#edit-jobdesk-name').value.trim();
            const description = modal.querySelector('#edit-jobdesk-desc').value.trim();
            const color = modal.querySelector('#edit-jobdesk-color').value;
            
            if (!name) {
                this.showNotification('error', 'Validation Error', 'Jobdesk name is required');
                return;
            }
            
            // Check if jobdesk already exists (excluding current)
            if (this.jobdeskManager.jobdesks.some(j => j.name === name && j.id !== jobdeskId)) {
                this.showNotification('error', 'Duplicate Jobdesk', 'Jobdesk already exists');
                return;
            }
            
            this.jobdeskManager.updateJobdesk(jobdeskId, name, description, color);
            this.updateJobdeskSelect();
            
            this.showNotification('success', 'Jobdesk Updated', `${name} has been updated`);
            document.body.removeChild(modal);
            
            // Refresh settings modal if open
            const settingsModal = document.querySelector('#settings-overlay');
            if (settingsModal) {
                const jobdeskTab = settingsModal.querySelector('#jobdesk-tab');
                if (jobdeskTab) {
                    jobdeskTab.innerHTML = this.renderJobdeskSettings();
                    this.setupJobdeskManagementEvents(settingsModal);
                }
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    saveSystemSettings() {
        const settings = {
            shiftStart: document.getElementById('shift-start')?.value || '05:00',
            shiftEnd: document.getElementById('shift-end')?.value || '14:00',
            nightShiftStart: document.getElementById('night-shift-start')?.value || '22:00',
            nightShiftEnd: document.getElementById('night-shift-end')?.value || '06:00',
            regularQuota: parseInt(document.getElementById('regular-quota')?.value) || 4,
            mealQuota: parseInt(document.getElementById('meal-quota')?.value) || 3,
            regularDuration: parseInt(document.getElementById('regular-duration')?.value) || 15,
            mealDuration: parseInt(document.getElementById('meal-duration')?.value) || 7,
            autoEndPermission: document.getElementById('auto-end-permission')?.checked || true,
            allowOvertime: document.getElementById('allow-overtime')?.checked || false,
            maxOvertimeHours: parseInt(document.getElementById('max-overtime')?.value) || 2
        };
        
        this.settingsManager.updateSettings(settings);
        
        // Update duration buttons if they exist
        const regularBtn = document.querySelector('.permission-btn[data-type="regular"]');
        const mealBtn = document.querySelector('.permission-btn[data-type="meal"]');
        
        if (regularBtn) {
            regularBtn.dataset.duration = settings.regularDuration;
            regularBtn.querySelector('.duration').textContent = `${settings.regularDuration}m`;
        }
        
        if (mealBtn) {
            mealBtn.dataset.duration = settings.mealDuration;
            mealBtn.querySelector('.duration').textContent = `${settings.mealDuration}m`;
        }
    }

    showNotification(type, title, message) {
        const container = document.getElementById('notification-container');
        if (!container) {
            // Create notification container if it doesn't exist
            const newContainer = document.createElement('div');
            newContainer.id = 'notification-container';
            document.body.appendChild(newContainer);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'fas fa-info-circle';
        if (type === 'success') icon = 'fas fa-check-circle';
        if (type === 'error') icon = 'fas fa-exclamation-circle';
        if (type === 'warning') icon = 'fas fa-exclamation-triangle';
        if (type === 'info') icon = 'fas fa-info-circle';
        
        notification.innerHTML = `
            <i class="${icon}"></i>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    formatTime(date) {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.staffSystem = new StaffPermissionSystem();
});
