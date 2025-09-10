// AI Assistant JavaScript
class AIAssistant {
    constructor() {
        this.language = new CommonLanguage();
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialMessage();
    }

    setupEventListeners() {
        // Send message
        const sendBtn = document.querySelector('.send-btn');
        const textarea = document.querySelector('.chat-input textarea');
        
        if (sendBtn && textarea) {
            sendBtn.addEventListener('click', () => {
                this.handleSendMessage();
            });

            textarea.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });
        }

        // Quick question templates
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                this.useTemplateQuestion(question);
            });
        });

        // Course selection
        const courseSelect = document.querySelector('.course-select');
        if (courseSelect) {
            courseSelect.addEventListener('change', (e) => {
                this.filterByCourse(e.target.value);
            });
        }
    }

    async handleSendMessage() {
        const textarea = document.querySelector('.chat-input textarea');
        const message = textarea.value.trim();
        
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        textarea.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Get AI response
        try {
            const response = await this.getAIResponse(message);
            this.removeTypingIndicator();
            this.addMessage(response, 'ai');
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('抱歉，暂时无法处理您的请求。请稍后再试。', 'ai');
            console.error('AI response error:', error);
        }
    }

    async getAIResponse(message) {
        // Simulate AI API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const responses = {
                    '如何解释数据结构中的链表概念？': `链表是一种线性数据结构，由一系列节点组成，每个节点包含数据和指向下一个节点的指针。

主要特点：
• 动态内存分配
• 插入删除效率高
• 不需要连续内存空间

教学建议：
1. 使用图示说明节点结构
2. 演示插入删除操作
3. 比较数组和链表的区别
4. 提供实际编程练习`,

                    '请为计算机科学导论设计一个课堂练习': `课堂练习：基础编程概念理解

题目：学生信息管理系统
要求：
1. 使用结构体存储学生信息（学号、姓名、成绩）
2. 实现添加、删除、查询功能
3. 计算平均成绩和最高分

学习目标：
• 掌握结构体使用
• 理解数组操作
• 练习基本算法

时间：45分钟
难度：初级`,

                    '如何评估学生的编程作业？': `编程作业评估标准：

1. 正确性 (40%)
   - 程序能否正常运行
   - 输出结果是否正确
   - 边界情况处理

2. 代码质量 (30%)
   - 代码可读性
   - 变量命名规范
   - 注释完整性

3. 算法效率 (20%)
   - 时间空间复杂度
   - 优化程度

4. 创新性 (10%)
   - 独特解决方案
   - 额外功能实现`,

                    '生成一个关于人工智能的测验题目': `人工智能基础测验

题目一：选择题
以下哪项不是机器学习的主要类型？
A) 监督学习
B) 无监督学习
C) 强化学习
D) 手动学习

题目二：简答题
解释过拟合(Overfitting)现象及其解决方法。

题目三：编程题
使用Python实现一个简单的线性回归模型，预测房价。

评分标准：
• 选择题：概念理解
• 简答题：理论掌握
• 编程题：实践能力`
                };

                const response = responses[message] || 
                    `感谢您的提问！关于"${message}"，我可以提供以下帮助：

1. 概念解释和教学建议
2. 作业设计和评估标准
3. 学生学习情况分析
4. 课程材料生成

请告诉我您需要更详细的信息关于哪个方面？`;

                resolve(response);
            }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
        });
    }

    addMessage(content, type) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${type === 'ai' ? 'AI' : '您'}</div>
            <div class="message-content">
                ${content.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({ type, content, timestamp: new Date() });
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.querySelector('.chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">AI</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    useTemplateQuestion(question) {
        const textarea = document.querySelector('.chat-input textarea');
        textarea.value = question;
        textarea.focus();
    }

    filterByCourse(courseCode) {
        // In a real app, this would filter conversations by course
        this.showNotification(`筛选课程: ${courseCode || '所有课程'}`, 'info');
    }

    loadInitialMessage() {
        // Initial message is already in HTML, just store it
        const initialMessage = document.querySelector('.ai-message');
        if (initialMessage) {
            const content = initialMessage.querySelector('.message-content').textContent;
            this.messages.push({
                type: 'ai',
                content: content,
                timestamp: new Date()
            });
        }
    }

    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIAssistant };
}