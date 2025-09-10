// Students Management JavaScript
class StudentsManager {
    constructor() {
        this.language = new CommonLanguage();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStudents();
    }

    setupEventListeners() {
        // Modal event listeners
        const modal = document.getElementById('importStudentsModal');
        const closeModal = document.querySelector('.close-modal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.hideModal();
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });

        // Import form submission
        const importForm = document.querySelector('.import-form');
        if (importForm) {
            importForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleImportStudents();
            });
        }

        // Course filter
        const courseFilter = document.querySelector('.course-filter');
        if (courseFilter) {
            courseFilter.addEventListener('change', (e) => {
                this.filterStudents(e.target.value);
            });
        }

        // Student actions
        document.querySelectorAll('.btn-secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.viewStudentDetails(e.target.closest('tr'));
            });
        });

        document.querySelectorAll('.btn-outline').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.messageStudent(e.target.closest('tr'));
            });
        });
    }

    showModal() {
        const modal = document.getElementById('importStudentsModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    hideModal() {
        const modal = document.getElementById('importStudentsModal');
        if (modal) {
            modal.style.display = 'none';
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.querySelector('.import-form');
        if (form) {
            form.reset();
        }
    }

    async handleImportStudents() {
        const form = document.querySelector('.import-form');
        const courseSelect = form.querySelector('select');
        const fileInput = form.querySelector('input[type="file"]');
        
        if (!courseSelect.value || !fileInput.files.length) {
            this.showNotification('请选择课程并上传文件', 'error');
            return;
        }

        this.showNotification('正在导入学生数据...', 'info');

        try {
            // Simulate import process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate successful import
            this.showNotification('学生导入成功！', 'success');
            this.hideModal();
            this.loadStudents(); // Reload students list
        } catch (error) {
            this.showNotification('导入失败，请重试', 'error');
            console.error('Import error:', error);
        }
    }

    async loadStudents() {
        // Simulate loading students data
        try {
            // In a real app, this would be an API call
            const students = await this.getStudentsData();
            this.renderStudents(students);
        } catch (error) {
            console.error('Error loading students:', error);
            this.showNotification('加载学生数据失败', 'error');
        }
    }

    async getStudentsData() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '12345678',
                        name: '李明',
                        course: '计算机科学导论',
                        email: 'liming@student.cityu.edu.hk',
                        status: 'active'
                    },
                    {
                        id: '12345679',
                        name: '王小红',
                        course: '数据结构与算法',
                        email: 'wangxh@student.cityu.edu.hk',
                        status: 'active'
                    },
                    {
                        id: '12345680',
                        name: '陈大文',
                        course: '计算机科学导论',
                        email: 'chendw@student.cityu.edu.hk',
                        status: 'inactive'
                    }
                ]);
            }, 500);
        });
    }

    renderStudents(students) {
        const tbody = document.querySelector('.students-table tbody');
        if (!tbody) return;

        tbody.innerHTML = students.map(student => `
            <tr data-student-id="${student.id}">
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.course}</td>
                <td>${student.email}</td>
                <td><span class="status ${student.status}">${this.getStatusText(student.status)}</span></td>
                <td>
                    <button class="btn-sm btn-secondary">详情</button>
                    <button class="btn-sm btn-outline">消息</button>
                </td>
            </tr>
        `).join('');

        // Reattach event listeners
        this.setupEventListeners();
    }

    filterStudents(courseCode) {
        const rows = document.querySelectorAll('.students-table tbody tr');
        
        rows.forEach(row => {
            const courseCell = row.querySelector('td:nth-child(3)');
            if (courseCell) {
                const course = courseCell.textContent;
                const shouldShow = !courseCode || 
                    (courseCode === 'cs1101' && course === '计算机科学导论') ||
                    (courseCode === 'cs2102' && course === '数据结构与算法');
                
                row.style.display = shouldShow ? '' : 'none';
            }
        });
    }

    getStatusText(status) {
        const statusMap = {
            'active': '活跃',
            'inactive': '未激活',
            'suspended': '停学'
        };
        return statusMap[status] || status;
    }

    viewStudentDetails(row) {
        const studentId = row.dataset.studentId;
        this.showNotification(`查看学生详情: ${studentId}`, 'info');
        // In a real app, navigate to student details page
    }

    messageStudent(row) {
        const studentId = row.dataset.studentId;
        const studentName = row.querySelector('td:nth-child(2)').textContent;
        this.showNotification(`发送消息给: ${studentName}`, 'info');
        // In a real app, open message modal
    }

    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Global function for import
function importStudents() {
    const studentsManager = new StudentsManager();
    studentsManager.showModal();
}

// Global function to hide modal
function hideImportStudentsModal() {
    const studentsManager = new StudentsManager();
    studentsManager.hideModal();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudentsManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StudentsManager, importStudents };
}