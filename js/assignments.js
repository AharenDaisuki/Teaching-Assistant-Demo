// Assignments Grading JavaScript
class AssignmentsManager {
    constructor() {
        this.language = new CommonLanguage();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAssignments();
    }

    setupEventListeners() {
        // Modal event listeners
        const modal = document.getElementById('createAssignmentModal');
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

        // Assignment form submission
        const assignmentForm = document.querySelector('.assignment-form');
        if (assignmentForm) {
            assignmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateAssignment();
            });
        }

        // Assignment filter
        const assignmentFilter = document.querySelector('.assignment-filter');
        if (assignmentFilter) {
            assignmentFilter.addEventListener('change', (e) => {
                this.filterAssignments(e.target.value);
            });
        }

        // Assignment actions
        document.querySelectorAll('.assignment-actions .btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.gradeAssignment(e.target.closest('.assignment-card'));
            });
        });

        document.querySelectorAll('.assignment-actions .btn-outline').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.viewAssignmentDetails(e.target.closest('.assignment-card'));
            });
        });
    }

    showModal() {
        const modal = document.getElementById('createAssignmentModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    hideModal() {
        const modal = document.getElementById('createAssignmentModal');
        if (modal) {
            modal.style.display = 'none';
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.querySelector('.assignment-form');
        if (form) {
            form.reset();
        }
    }

    async handleCreateAssignment() {
        const form = document.querySelector('.assignment-form');
        const titleInput = form.querySelector('input[type="text"]');
        const courseSelect = form.querySelector('select');
        const dueDateInput = form.querySelector('input[type="date"]');
        const scoreInput = form.querySelector('input[type="number"]');
        
        if (!titleInput.value || !courseSelect.value || !dueDateInput.value || !scoreInput.value) {
            this.showNotification('请填写所有必填字段', 'error');
            return;
        }

        this.showNotification('正在创建作业...', 'info');

        try {
            // Simulate creation process
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulate successful creation
            this.showNotification('作业创建成功！', 'success');
            this.hideModal();
            this.loadAssignments(); // Reload assignments list
        } catch (error) {
            this.showNotification('创建失败，请重试', 'error');
            console.error('Create assignment error:', error);
        }
    }

    async loadAssignments() {
        try {
            const assignments = await this.getAssignmentsData();
            this.renderAssignments(assignments);
        } catch (error) {
            console.error('Error loading assignments:', error);
            this.showNotification('加载作业数据失败', 'error');
        }
    }

    async getAssignmentsData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        title: '数据结构作业 #1',
                        course: '数据结构与算法',
                        dueDate: '2024-03-15',
                        submissions: { total: 38, submitted: 35 },
                        progress: 60,
                        status: 'grading'
                    },
                    {
                        id: '2',
                        title: '计算机科学导论期末项目',
                        course: '计算机科学导论',
                        dueDate: '2024-04-20',
                        submissions: { total: 45, submitted: 42 },
                        progress: 20,
                        status: 'pending'
                    },
                    {
                        id: '3',
                        title: '人工智能期中测验',
                        course: '人工智能基础',
                        dueDate: '2024-03-10',
                        submissions: { total: 28, submitted: 28 },
                        progress: 100,
                        status: 'completed'
                    }
                ]);
            }, 500);
        });
    }

    renderAssignments(assignments) {
        const grid = document.querySelector('.assignments-grid');
        if (!grid) return;

        grid.innerHTML = assignments.map(assignment => `
            <div class="assignment-card" data-assignment-id="${assignment.id}">
                <div class="assignment-header">
                    <h3>${assignment.title}</h3>
                    <span class="due-date">截止: ${assignment.dueDate}</span>
                </div>
                <div class="assignment-info">
                    <div class="info-item">
                        <span class="label">课程:</span>
                        <span class="value">${assignment.course}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">提交数:</span>
                        <span class="value">${assignment.submissions.submitted}/${assignment.submissions.total}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">批改进度:</span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${assignment.progress}%"></div>
                        </div>
                        <span class="progress-text">${assignment.progress}%</span>
                    </div>
                </div>
                <div class="assignment-actions">
                    <button class="btn-primary">${this.getActionText(assignment.status)}</button>
                    <button class="btn-outline">查看详情</button>
                </div>
            </div>
        `).join('');

        this.setupEventListeners();
    }

    getActionText(status) {
        const actions = {
            'grading': '继续批改',
            'pending': '开始批改',
            'completed': '查看成绩'
        };
        return actions[status] || '处理作业';
    }

    filterAssignments(filter) {
        const cards = document.querySelectorAll('.assignment-card');
        
        cards.forEach(card => {
            const progress = parseInt(card.querySelector('.progress-text').textContent);
            let shouldShow = true;
            
            switch (filter) {
                case 'pending':
                    shouldShow = progress < 100;
                    break;
                case 'graded':
                    shouldShow = progress === 100;
                    break;
            }
            
            card.style.display = shouldShow ? '' : 'none';
        });
    }

    gradeAssignment(card) {
        const assignmentId = card.dataset.assignmentId;
        this.showNotification(`开始批改作业: ${assignmentId}`, 'info');
        // In a real app, navigate to grading interface
    }

    viewAssignmentDetails(card) {
        const assignmentId = card.dataset.assignmentId;
        this.showNotification(`查看作业详情: ${assignmentId}`, 'info');
        // In a real app, show assignment details modal
    }

    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Global function for creating assignments
function createAssignment() {
    const manager = new AssignmentsManager();
    manager.showModal();
}

// Global function to hide modal
function hideCreateAssignmentModal() {
    const manager = new AssignmentsManager();
    manager.hideModal();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AssignmentsManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AssignmentsManager, createAssignment };
}