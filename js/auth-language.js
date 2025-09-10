class AuthLanguage {
    constructor() {
        this.currentLang = 'zh-CN';
        this.translations = {
            'en': {
                'name': 'Name',
                'email': 'Email',
                'password': 'Password',
                'confirmPassword': 'Confirm Password',
                'department': 'Department',
                'selectDepartment': 'Select Department',
                'csDept': 'Computer Science',
                'eeDept': 'Electrical Engineering',
                'mathDept': 'Mathematics',
                'physicsDept': 'Physics',
                'businessDept': 'Business School',
                'title': 'Title',
                'selectTitle': 'Select Title',
                'professor': 'Professor',
                'associateProfessor': 'Associate Professor',
                'assistantProfessor': 'Assistant Professor',
                'lecturer': 'Lecturer',
                'namePlaceholder': 'Enter your name',
                'emailPlaceholder': 'Enter your email',
                'passwordPlaceholder': 'Enter password (min 8 chars)',
                'confirmPasswordPlaceholder': 'Re-enter password',
                'login': 'Login',
                'register': 'Register',
                'rememberMe': 'Remember me',
                'forgotPassword': 'Forgot password?',
                'noAccount': 'Don\'t have an account?',
                'haveAccount': 'Already have an account?',
                'agreeTerms': 'I agree to the Terms of Service and Privacy Policy'
            },
            'zh-CN': {
                'name': '姓名',
                'email': '邮箱地址',
                'password': '密码',
                'confirmPassword': '确认密码',
                'department': '院系',
                'selectDepartment': '请选择院系',
                'csDept': '计算机科学系',
                'eeDept': '电子工程系',
                'mathDept': '数学系',
                'physicsDept': '物理系',
                'businessDept': '商学院',
                'title': '职称',
                'selectTitle': '请选择职称',
                'professor': '教授',
                'associateProfessor': '副教授',
                'assistantProfessor': '助理教授',
                'lecturer': '讲师',
                'namePlaceholder': '请输入姓名',
                'emailPlaceholder': '请输入邮箱地址',
                'passwordPlaceholder': '请输入密码（至少8位）',
                'confirmPasswordPlaceholder': '请再次输入密码',
                'login': '登录',
                'register': '注册',
                'rememberMe': '记住我',
                'forgotPassword': '忘记密码？',
                'noAccount': '没有账号？',
                'haveAccount': '已有账号？',
                'agreeTerms': '我同意服务条款和隐私政策'
            },
            'zh-TW': {
                'name': '姓名',
                'email': '郵箱地址',
                'password': '密碼',
                'confirmPassword': '確認密碼',
                'department': '院系',
                'selectDepartment': '請選擇院系',
                'csDept': '計算機科學系',
                'eeDept': '電子工程系',
                'mathDept': '數學系',
                'physicsDept': '物理系',
                'businessDept': '商學院',
                'title': '職稱',
                'selectTitle': '請選擇職稱',
                'professor': '教授',
                'associateProfessor': '副教授',
                'assistantProfessor': '助理教授',
                'lecturer': '講師',
                'namePlaceholder': '請輸入姓名',
                'emailPlaceholder': '請輸入郵箱地址',
                'passwordPlaceholder': '請輸入密碼（至少8位）',
                'confirmPasswordPlaceholder': '請再次輸入密碼',
                'login': '登錄',
                'register': '註冊',
                'rememberMe': '記住我',
                'forgotPassword': '忘記密碼？',
                'noAccount': '沒有賬號？',
                'haveAccount': '已有賬號？',
                'agreeTerms': '我同意服務條款和隱私政策'
            }
        };
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.updateUI();
        }
    }

    updateUI() {
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (this.translations[this.currentLang][key]) {
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.setAttribute('placeholder', this.translations[this.currentLang][key]);
                } else {
                    el.textContent = this.translations[this.currentLang][key];
                }
            }
        });

        // Update select options
        document.querySelectorAll('option[data-translate]').forEach(option => {
            const key = option.getAttribute('data-translate');
            if (this.translations[this.currentLang][key]) {
                option.textContent = this.translations[this.currentLang][key];
            }
        });
    }
}

// Initialize language system
const authLanguage = new AuthLanguage();
document.addEventListener('DOMContentLoaded', () => {
    authLanguage.updateUI();
    
    // Language switcher event - fix for button clicks
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.dataset.lang;
            if (lang) {
                // Update active button
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Set language
                authLanguage.setLanguage(lang);
            }
        });
    });
});