// Authentication JavaScript
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.currentLang = localStorage.getItem('preferredLang') || 'zh-HK';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupTabSwitching();
        this.setupLanguageSwitcher();
        this.updateLanguage();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Password validation
        const passwordInput = document.getElementById('register-password');
        const confirmInput = document.getElementById('register-confirm');
        
        if (passwordInput && confirmInput) {
            confirmInput.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
        }
    }

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const forms = document.querySelectorAll('.auth-form');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                
                // Update active tab
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Show corresponding form
                forms.forEach(form => form.classList.remove('active'));
                document.getElementById(`${tab}-form`).classList.add('active');
            });
        });
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Basic validation
        if (!email || !password) {
            this.showError('请填写所有必填字段');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call
            const user = await this.authenticateUser(email, password);
            
            if (user) {
                this.setCurrentUser(user, rememberMe);
                this.showSuccess('登录成功！');
                
                // Redirect to main app after short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                this.showError('邮箱或密码错误');
            }
        } catch (error) {
            this.showError('登录失败，请稍后重试');
            console.error('Login error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        const department = document.getElementById('register-department').value;
        const title = document.getElementById('register-title').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        // Validation
        if (!name || !email || !password || !confirm || !department) {
            this.showError('请填写所有必填字段');
            return;
        }

        if (password !== confirm) {
            this.showError('密码确认不匹配');
            return;
        }

        if (password.length < 8) {
            this.showError('密码至少需要8个字符');
            return;
        }

        if (!agreeTerms) {
            this.showError('请同意服务条款');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call
            const user = await this.registerUser({
                name,
                email,
                password,
                department,
                title,
                displayName: title ? `${title} ${name.split(' ')[0]}` : name,
                chineseName: title ? `${name.split(' ')[0]}教授` : name
            });

            // Show success message
            alert('注册成功，请登录');
            
            // Redirect to login page
            window.location.href = 'auth.html';

        } catch (error) {
            this.showError('注册失败，请稍后重试');
            console.error('Register error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    validatePasswordMatch() {
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        const confirmGroup = document.getElementById('register-confirm').closest('.form-group');

        if (confirm && password !== confirm) {
            confirmGroup.classList.add('error');
        } else {
            confirmGroup.classList.remove('error');
        }
    }

    async authenticateUser(email, password) {
        // Simulate API authentication
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock user data - in real app, this would come from API
                const users = this.getStoredUsers();
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    resolve({ 
                        ...user, 
                        password: undefined, // Remove password from returned object
                        displayName: user.title ? `${user.title} ${user.name.split(' ')[0]}` : user.name,
                        chineseName: user.title ? `${user.name.split(' ')[0]}教授` : user.name
                    });
                } else {
                    resolve(null);
                }
            }, 1000);
        });
    }

    async registerUser(userData) {
        // Simulate API registration
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const users = this.getStoredUsers();
                    
                    // Check if email already exists
                    if (users.some(u => u.email === userData.email)) {
                        reject(new Error('邮箱已被注册'));
                        return;
                    }

                    // Create new user with proper display names
                    const newUser = {
                        id: Date.now().toString(),
                        name: userData.name,
                        email: userData.email,
                        password: userData.password, // In real app, this should be hashed
                        department: userData.department,
                        title: userData.title,
                        displayName: userData.title ? `${userData.title} ${userData.name.split(' ')[0]}` : userData.name,
                        chineseName: userData.title ? `${userData.name.split(' ')[0]}教授` : userData.name,
                        createdAt: new Date().toISOString()
                    };

                    // Save user
                    users.push(newUser);
                    localStorage.setItem('cityu_users', JSON.stringify(users));

                    resolve({ ...newUser, password: undefined });
                } catch (error) {
                    reject(error);
                }
            }, 1000);
        });
    }

    getStoredUsers() {
        try {
            return JSON.parse(localStorage.getItem('cityu_users') || '[]');
        } catch {
            return [];
        }
    }

    setCurrentUser(user, remember = true) {
        this.currentUser = user;
        
        if (remember) {
            localStorage.setItem('cityu_current_user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('cityu_current_user', JSON.stringify(user));
        }
    }

    checkAuthStatus() {
        try {
            const userData = localStorage.getItem('cityu_current_user') || 
                           sessionStorage.getItem('cityu_current_user');
            
            if (userData) {
                const user = JSON.parse(userData);
                this.currentUser = user;
                // If on auth page but already logged in, redirect to main app
                if (window.location.pathname.includes('auth.html') && user) {
                    window.location.href = 'index.html';
                }
            } else if (!window.location.pathname.includes('auth.html')) {
                // If not on auth page and not logged in, redirect to login
                window.location.href = 'auth.html';
            }
        } catch (error) {
            console.error('Auth check error:', error);
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('cityu_current_user');
        sessionStorage.removeItem('cityu_current_user');
        window.location.href = 'auth.html';
    }

    setLoadingState(loading) {
        const buttons = document.querySelectorAll('.auth-btn');
        buttons.forEach(btn => {
            if (loading) {
                btn.classList.add('loading');
                btn.disabled = true;
            } else {
                btn.classList.remove('loading');
                btn.disabled = false;
            }
        });
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());

        const messageEl = document.createElement('div');
        messageEl.className = type === 'error' ? 'error-message' : 'success-message';
        messageEl.textContent = message;

        // Insert after forms
        const forms = document.querySelector('.auth-form.active');
        if (forms) {
            forms.appendChild(messageEl);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// Global auth instance
window.authManager = new AuthManager();

// Global logout function
function logout() {
    if (window.authManager) {
        window.authManager.logout();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, logout };
}