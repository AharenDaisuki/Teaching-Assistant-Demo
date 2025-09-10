// Courses Management JavaScript
class CoursesManager {
    constructor() {
        this.language = new CommonLanguage();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCourses();
    }

    setupEventListeners() {
        // Modal event listeners
        const modal = document.getElementById('createCourseModal');
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

        // Course form submission
        const courseForm = document.querySelector('.course-form');
        if (courseForm) {
            courseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateCourse();
            });
        }

        // Course card actions
        document.querySelectorAll('.btn-secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.viewCourseDetails(e.target.closest('.course-card'));
            });
        });

        document.querySelectorAll('.btn-outline').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.editCourse(e.target.closest('.course-card'));
            });
        });
    }

    showModal() {
        const modal = document.getElementById('createCourseModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    hideModal() {
        const modal = document.getElementById('createCourseModal');
        if (modal) {
            modal.style.display = 'none';
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.querySelector('.course-form');
        if (form) {
            form.reset();
        }
    }

    async handleCreateCourse() {
        const form = document.querySelector('.course-form');
        const formData = new FormData(form);
        
        const courseData = {
            name: formData.get('name') || document.querySelector('input[type="text"]').value,
            code: formData.get('code') || document.querySelectorAll('input[type="text"]')[1].value,
            semester: formData.get('semester') || document.querySelector('select').value,
            description: formData.get('description') || document.querySelector('textarea').value
        };

        // Validation
        if (!courseData.name || !courseData.code || !courseData.semester) {
            this.showNotification(this.language.getText('fillAllFields'), 'error');
            return;
        }

        // Simulate API call
        this.showNotification(this.language.getText('creatingCourse'), 'info');

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Add to local storage or simulate success
            const courses = this.getStoredCourses();
            const newCourse = {
                id: Date.now().toString(),
                ...courseData,
                students: 0,
                activeAssignments: 0,
                status: 'active',
                createdAt: new Date().toISOString()
            };
            
            courses.push(newCourse);
            localStorage.setItem('courses', JSON.stringify(courses));
            
            this.showNotification(this.language.getText('courseCreated'), 'success');
            this.hideModal();
            this.loadCourses(); // Reload the courses list
        } catch (error) {
            this.showNotification(this.language.getText('createCourseFailed'), 'error');
            console.error('Error creating course:', error);
        }
    }

    getStoredCourses() {
        const stored = localStorage.getItem('courses');
        return stored ? JSON.parse(stored) : [];
    }

    loadCourses() {
        const courses = this.getStoredCourses();
        const coursesGrid = document.querySelector('.courses-grid');
        
        if (courses.length === 0) {
            // Show empty state
            coursesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>${this.language.getText('noCourses')}</h3>
                    <p>${this.language.getText('createFirstCourse')}</p>
                    <button class="btn-primary" onclick="showCreateCourseModal()">${this.language.getText('createCourse')}</button>
                </div>
            `;
            return;
        }

        // Render courses
        coursesGrid.innerHTML = courses.map(course => `
            <div class="course-card" data-course-id="${course.id}">
                <div class="course-header">
                    <h3>${course.name}</h3>
                    <span class="course-code">${course.code}</span>
                </div>
                <div class="course-info">
                    <div class="info-item">
                        <span class="label">${this.language.getText('students')}:</span>
                        <span class="value">${course.students}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">${this.language.getText('activeAssignments')}:</span>
                        <span class="value">${course.activeAssignments}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">${this.language.getText('status')}:</span>
                        <span class="status ${course.status}">${this.getStatusText(course.status)}</span>
                    </div>
                </div>
                <div class="course-actions">
                    <button class="btn-secondary">${this.language.getText('viewDetails')}</button>
                    <button class="btn-outline">${this.language.getText('edit')}</button>
                </div>
            </div>
        `).join('');

        // Reattach event listeners
        this.setupEventListeners();
    }

    getStatusText(status) {
        const statusMap = {
            'active': this.language.getText('active'),
            'completed': this.language.getText('completed'),
            'draft': this.language.getText('draft')
        };
        return statusMap[status] || status;
    }

    viewCourseDetails(courseCard) {
        const courseId = courseCard.dataset.courseId;
        const courses = this.getStoredCourses();
        const course = courses.find(c => c.id === courseId);
        
        if (course) {
            // Navigate to course details page or show modal
            this.showNotification(`${this.language.getText('viewCourse')}: ${course.name}`, 'info');
            // In a real app, you would navigate to the course details page
            console.log('Course details:', course);
        }
    }

    editCourse(courseCard) {
        const courseId = courseCard.dataset.courseId;
        const courses = this.getStoredCourses();
        const course = courses.find(c => c.id === courseId);
        
        if (course) {
            // Populate and show edit modal
            this.showNotification(`${this.language.getText('editCourse')}: ${course.name}`, 'info');
            // In a real app, you would show an edit modal with pre-filled data
            console.log('Edit course:', course);
        }
    }

    showNotification(message, type = 'info') {
        // Reuse the notification function from main.js or create a simple one
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Fallback simple notification
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Global functions for modal control
function showCreateCourseModal() {
    const coursesManager = new CoursesManager();
    coursesManager.showModal();
}

function hideCreateCourseModal() {
    const coursesManager = new CoursesManager();
    coursesManager.hideModal();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CoursesManager();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CoursesManager, showCreateCourseModal, hideCreateCourseModal };
}