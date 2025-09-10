// Common language functionality for all pages
class CommonLanguage {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferred_language') || 'zh-CN';
        this.translations = {
            'en': {
                'courseDesign': 'Course Management',
                'studentManagement': 'Student Management',
                'assignmentGrading': 'Assignment Grading',
                'aiAssistant': 'AI Assistant',
                'dashboard': 'Dashboard',
                'createCourse': 'Create Course',
                'viewDetails': 'View Details',
                'edit': 'Edit',
                'students': 'Students',
                'activeAssignments': 'Active Assignments',
                'status': 'Status',
                'active': 'Active',
                'completed': 'Completed',
                'draft': 'Draft',
                'noCourses': 'No courses yet',
                'createFirstCourse': 'Create your first course to start teaching',
                'name': 'Name',
                'code': 'Code',
                'semester': 'Semester',
                'description': 'Description',
                'create': 'Create',
                'cancel': 'Cancel',
                'fillAllFields': 'Please fill all required fields',
                'creatingCourse': 'Creating course...',
                'courseCreated': 'Course created successfully!',
                'createCourseFailed': 'Failed to create course',
                'viewCourse': 'View course',
                'editCourse': 'Edit course'
            },
            'zh-CN': {
                'courseDesign': '课程管理',
                'studentManagement': '学生管理',
                'assignmentGrading': '作业批改',
                'aiAssistant': '智能答疑',
                'dashboard': '仪表板',
                'createCourse': '创建课程',
                'viewDetails': '查看详情',
                'edit': '编辑',
                'students': '学生数',
                'activeAssignments': '进行中作业',
                'status': '状态',
                'active': '进行中',
                'completed': '已结束',
                'draft': '草稿',
                'noCourses': '暂无课程',
                'createFirstCourse': '创建您的第一个课程开始教学',
                'name': '课程名称',
                'code': '课程代码',
                'semester': '学期',
                'description': '课程描述',
                'create': '创建',
                'cancel': '取消',
                'fillAllFields': '请填写所有必填字段',
                'creatingCourse': '创建课程中...',
                'courseCreated': '课程创建成功！',
                'createCourseFailed': '创建课程失败',
                'viewCourse': '查看课程',
                'editCourse': '编辑课程'
            },
            'zh-TW': {
                'courseDesign': '課程管理',
                'studentManagement': '學生管理',
                'assignmentGrading': '作業批改',
                'aiAssistant': '智能答疑',
                'dashboard': '儀表板',
                'createCourse': '創建課程',
                'viewDetails': '查看詳情',
                'edit': '編輯',
                'students': '學生數',
                'activeAssignments': '進行中作業',
                'status': '狀態',
                'active': '進行中',
                'completed': '已結束',
                'draft': '草稿',
                'noCourses': '暫無課程',
                'createFirstCourse': '創建您的第一個課程開始教學',
                'name': '課程名稱',
                'code': '課程代碼',
                'semester': '學期',
                'description': '課程描述',
                'create': '創建',
                'cancel': '取消',
                'fillAllFields': '請填寫所有必填字段',
                'creatingCourse': '創建課程中...',
                'courseCreated': '課程創建成功！',
                'createCourseFailed': '創建課程失敗',
                'viewCourse': '查看課程',
                'editCourse': '編輯課程'
            }
        };
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('preferred_language', lang);
            this.updateUI();
            this.updateActiveButton(lang);
        }
    }

    updateActiveButton(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
    }

    updateUI() {
        // Update navigation links
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (this.translations[this.currentLanguage][key]) {
                el.textContent = this.translations[this.currentLanguage][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            if (this.translations[this.currentLanguage][key]) {
                el.setAttribute('placeholder', this.translations[this.currentLanguage][key]);
            }
        });

        // Update labels
        document.querySelectorAll('[data-translate-label]').forEach(el => {
            const key = el.getAttribute('data-translate-label');
            if (this.translations[this.currentLanguage][key]) {
                el.textContent = this.translations[this.currentLanguage][key];
            }
        });
    }

    setupLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if (lang) {
                    this.setLanguage(lang);
                }
            });
        });
    }

    getText(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
}

// Initialize common language functionality
const commonLanguage = new CommonLanguage();

// Setup language switcher when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    commonLanguage.setupLanguageSwitcher();
    commonLanguage.updateUI();
    commonLanguage.updateActiveButton(commonLanguage.currentLanguage);
});