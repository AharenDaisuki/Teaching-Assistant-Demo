class AppManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('cityu_current_user') || 'null');
        this.currentLanguage = localStorage.getItem('preferred_language') || 'zh-CN';
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.updateUserDisplay();
        this.setupNavigation();
    }

    checkAuthStatus() {
        // Always check localStorage for current user to ensure fresh data
        try {
            const userData = localStorage.getItem('cityu_current_user') || 
                           sessionStorage.getItem('cityu_current_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
        
        if (!this.currentUser && !window.location.pathname.includes('auth.html')) {
            window.location.href = 'auth.html';
        }
    }

    updateUserDisplay() {
        if (!this.currentUser) return;
        
        // Update welcome message
        const welcomeEl = document.querySelector('.welcome-message');
        if (welcomeEl) {
            const translations = {
                'en': `Welcome back, ${this.currentUser.displayName || this.currentUser.name}`,
                'zh-CN': `欢迎回来，${this.currentUser.chineseName || this.currentUser.displayName || this.currentUser.name}`,
                'zh-TW': `歡迎回來，${this.currentUser.chineseName || this.currentUser.displayName || this.currentUser.name}`
            };
            welcomeEl.textContent = translations[this.currentUser.language || 'zh-CN'];
        }

        // Update user dropdown info
        const userInfoEl = document.querySelector('.user-info');
        if (userInfoEl) {
            userInfoEl.innerHTML = `
                <strong>${this.currentUser.displayName || this.currentUser.name}</strong>
                <small>${this.currentUser.email}</small>
                <small>${this.currentUser.department || '未设置院系'}</small>
                ${this.currentUser.title ? `<small>职称: ${this.currentUser.title}</small>` : ''}
            `;
        }
    }

    setupEventListeners() {
        // Language switcher
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchLanguage(e.target.dataset.lang);
            });
        });

        // User avatar click handler for dropdown
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.hideUserDropdown();
        });
    }

    setupNavigation() {
        // Handle navigation links - allow normal link behavior
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Allow normal navigation for all links
                // Browser will handle page transitions naturally
            });
        });
    }

    navigateTo(section) {
        // Smooth scroll to section
        const target = document.querySelector(section);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('preferred_language', lang);
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
        
        this.updateUserDisplay();
        this.updateUIText();
    }

    updateUIText() {
        // Update all UI text based on current language
        const translations = {
            'en': {
                'welcome': `Welcome back, ${this.currentUser.displayName || this.currentUser.name}`,
                'courseDesign': 'Course Management',
                'studentManagement': 'Student Management',
                'assignmentGrading': 'Assignment Grading',
                'aiAssistant': 'AI Assistant',
                'dashboard': 'Dashboard',
            },
            'zh-CN': {
                'welcome': `欢迎回来，${this.currentUser.chineseName || this.currentUser.name}`,
                'courseDesign': '课程管理',
                'studentManagement': '学生管理',
                'assignmentGrading': '作业批改',
                'aiAssistant': '智能答疑',
                'dashboard': '仪表盘',
            },
            'zh-TW': {
                'welcome': `歡迎回來，${this.currentUser.chineseName || this.currentUser.name}`,
                'courseDesign': '課程管理',
                'studentManagement': '學生管理',
                'assignmentGrading': '作業批改',
                'aiAssistant': '智能答疑',
                'dashboard': '儀表板',
            }
        };

        const langData = translations[this.currentLanguage] || translations['zh-CN'];
        
        // Update navigation links with data attributes for proper language switching
        document.querySelectorAll('.nav-link').forEach(link => {
            const key = link.getAttribute('data-translate');
            if (key && langData[key]) {
                link.textContent = langData[key];
            }
        });

        // Update welcome message
        const welcomeEl = document.querySelector('.welcome-message');
        if (welcomeEl) welcomeEl.textContent = langData.welcome;
    }

    // User dropdown functionality
    toggleUserDropdown() {
        const dropdown = document.querySelector('.user-dropdown');
        if (!dropdown) {
            this.createUserDropdown();
        } else {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    }

    createUserDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="user-info">
                <div class="user-name">${this.currentUser.displayName || this.currentUser.name}</div>
                ${this.currentUser.title ? `<div class="user-title">${this.currentUser.title}</div>` : ''}
                ${this.currentUser.department ? `<div class="user-department">${this.currentUser.department}</div>` : ''}
                <div class="user-email">${this.currentUser.email}</div>
            </div>
            <div class="dropdown-divider"></div>
            <button class="logout-btn-icon" onclick="logout()" title="退出登录">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            </button>
        `;
        
        const userSection = document.querySelector('.user-section');
        userSection.appendChild(dropdown);
        dropdown.style.display = 'block';
        
        // Prevent dropdown from closing when clicking inside
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    hideUserDropdown() {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
}

// Global logout function
function logout() {
    if (confirm('确定要退出登录吗？')) {
        if (window.authManager) {
            window.authManager.logout();
        } else {
            localStorage.removeItem('cityu_current_user');
            sessionStorage.removeItem('cityu_current_user');
            window.location.href = 'auth.html';
        }
    }
}

// Initialize app
const app = new AppManager();