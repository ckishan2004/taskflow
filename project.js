document.addEventListener('DOMContentLoaded', function() {
    // Task class
    class Task {
        constructor(id, title, description, dueDate, priority, completed = false) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.priority = priority;
            this.completed = completed;
            this.createdAt = new Date();
        }
    }

    showToast(message, type = 'success') 
    {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon i');

    // Set message and icon
    toastMessage.textContent = message;
    toast.className = `toast toast-${type} show`;

    toastIcon.className = type === 'success'
        ? 'fas fa-check-circle'
        : 'fas fa-exclamation-circle';

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


    // Task Manager class
    class TaskManager {
        constructor() {
            this.tasks = [];
            this.loadTasks();
            this.currentFilter = 'all';
        }

        loadTasks() {
            // Attempt to load from localStorage
            const savedTasks = localStorage.getItem('tasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            } else {
                // Sample tasks for demonstration
                this.tasks = [
                    new Task(1, "Complete Project Proposal", "Finalize the project proposal for client meeting", "2025-04-25", "high"),
                    new Task(2, "Schedule Team Meeting", "Discuss upcoming project milestones", "2025-04-22", "medium", true),
                    new Task(3, "Research New Technologies", "Look into React and Node.js for future projects", "2025-04-30", "low")
                ];
                this.saveTasks();
            }
        }

        saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            
            // If user is logged in, also save to server
            if (this.isLoggedIn()) {
                this.saveTasksToServer();
            }
        }
        
        isLoggedIn() {
            return localStorage.getItem('user') !== null;
        }
        
        saveTasksToServer() {
            // Make AJAX call to PHP backend
            fetch('api/tasks.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'saveTasks',
                    tasks: this.tasks
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Tasks saved to server:', data);
            })
            .catch(error => {
                console.error('Error saving tasks to server:', error);
            });
        }

        addTask(title, description, dueDate, priority) {
            const id = this.tasks.length ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1;
            const newTask = new Task(id, title, description, dueDate, priority);
            this.tasks.push(newTask);
            this.saveTasks();
            return newTask;
        }

        deleteTask(id) {
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                this.tasks.splice(taskIndex, 1);
                this.saveTasks();
                return true;
            }
            return false;
        }

        updateTask(id, title, description, dueDate, priority) {
            const task = this.tasks.find(task => task.id === id);
            if (task) {
                task.title = title;
                task.description = description;
                task.dueDate = dueDate;
                task.priority = priority;
                this.saveTasks();
                return task;
            }
            return null;
        }

        getTask(id) {
            return this.tasks.find(task => task.id === parseInt(id));
        }

        toggleComplete(id) {
            const task = this.tasks.find(task => task.id === id);
            if (task) {
                task.completed = !task.completed;
                this.saveTasks();
                return task;
            }
            return null;
        }

        filterTasks(filter) {
            this.currentFilter = filter;
            if (filter === 'all') {
                return this.tasks;
            } else if (filter === 'pending') {
                return this.tasks.filter(task => !task.completed);
            } else if (filter === 'completed') {
                return this.tasks.filter(task => task.completed);
            }
        }

        getStats() {
            const total = this.tasks.length;
            const completed = this.tasks.filter(task => task.completed).length;
            const pending = total - completed;
            const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                total,
                completed,
                pending,
                completionRate
            };
        }
    }

    // UI class
    class UI {
        constructor(taskManager) {
            this.taskManager = taskManager;
            this.taskForm = document.getElementById('taskForm');
            this.taskItems = document.getElementById('taskItems');
            this.emptyList = document.getElementById('emptyList');
            this.editTaskModal = document.getElementById('editTaskModal');
            this.deleteTaskModal = document.getElementById('deleteTaskModal');
            this.toast = document.getElementById('toast');
            this.filterButtons = document.querySelectorAll('.filter-btn');
            
            this.totalTasksElement = document.getElementById('totalTasks');
            this.completedTasksElement = document.getElementById('completedTasks');
            this.pendingTasksElement = document.getElementById('pendingTasks');
            this.completionRateElement = document.getElementById('completionRate');

            // Initialize event listeners
            this.initEventListeners();
            
            // Display tasks initially
            this.displayTasks();
            this.updateStats();
            
            // Check login status
            this.checkLoginStatus();
        }

        initEventListeners() {
            // Add task form submission
            if (this.taskForm) {
                this.taskForm.addEventListener('submit', this.handleAddTask.bind(this));
            }
            
            // Filter tasks
            this.filterButtons.forEach(button => {
                button.addEventListener('click', this.handleFilterTasks.bind(this));
            });
            
            // Task actions delegation
            if (this.taskItems) {
                this.taskItems.addEventListener('click', this.handleTaskActions.bind(this));
            }
            
            // Edit modal events
            const closeEditModal = document.getElementById('closeEditModal');
            const cancelEdit = document.getElementById('cancelEdit');
            const editTaskForm = document.getElementById('editTaskForm');
            
            if (closeEditModal) {
                closeEditModal.addEventListener('click', () => this.closeModal(this.editTaskModal));
            }
            
            if (cancelEdit) {
                cancelEdit.addEventListener('click', () => this.closeModal(this.editTaskModal));
            }
            
            if (editTaskForm) {
                editTaskForm.addEventListener('submit', this.handleEditTask.bind(this));
            }
            
            // Delete modal events
            const closeDeleteModal = document.getElementById('closeDeleteModal');
            const cancelDelete = document.getElementById('cancelDelete');
            const confirmDelete = document.getElementById('confirmDelete');
            
            if (closeDeleteModal) {
                closeDeleteModal.addEventListener('click', () => this.closeModal(this.deleteTaskModal));
            }
            
            if (cancelDelete) {
                cancelDelete.addEventListener('click', () => this.closeModal(this.deleteTaskModal));
            }
            
            if (confirmDelete) {
                confirmDelete.addEventListener('click', this.handleDeleteConfirm.bind(this));
            }
        }

        checkLoginStatus() {
            const loginStatus = document.getElementById('loginStatus');
            if (loginStatus) {
                if (this.taskManager.isLoggedIn()) {
                    const user = JSON.parse(localStorage.getItem('user'));
                    loginStatus.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
                    loginStatus.href = "logout.php";
                } else {
                    loginStatus.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
                    loginStatus.href = "login.php";
                }
            }
        }

        handleAddTask(e) {
            e.preventDefault();
            
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const dueDate = document.getElementById('dueDate').value;
            const priority = document.getElementById('priority').value;
            
            // Save the task
            const newTask = this.taskManager.addTask(title, description, dueDate, priority);
            
            // Clear the form
            this.taskForm.reset();
            
            // Update UI
            this.displayTasks();
            this.updateStats();
            this.showToast('Task added successfully!', 'success');
            
            // Simulate server request
            this.simulateServerRequest('add', newTask);
        }

        handleFilterTasks(e) {
            const filter = e.target.dataset.filter;
            
            // Update active button
            this.filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Filter and display tasks
            this.displayTasks(filter);
        }

        handleTaskActions(e) {
            const target = e.target;
            
            // Find the task ID
            const taskEl = target.closest('.task-item');
            if (!taskEl) return;
            
            const taskId = parseInt(taskEl.dataset.id);
            
            // Handle complete action
            if (target.classList.contains('complete-btn') || target.closest('.complete-btn')) {
                this.toggleTaskComplete(taskId);
            }
            
            // Handle edit action
            if (target.classList.contains('edit-btn') || target.closest('.edit-btn')) {
                this.openEditModal(taskId);
            }
            
            // Handle delete action
            if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
                this.openDeleteModal(taskId);
            }
        }

        handleEditTask(e) {
            e.preventDefault();
            
            const id = parseInt(document.getElementById('editTaskId').value);
            const title = document.getElementById('editTaskTitle').value;
            const description = document.getElementById('editTaskDescription').value;
            const dueDate = document.getElementById('editDueDate').value;
            const priority = document.getElementById('editPriority').value;
            
            // Update task
            const updatedTask = this.taskManager.updateTask(id, title, description, dueDate, priority);
            
            // Close modal
            this.closeModal(this.editTaskModal);
            
            // Update UI
            this.displayTasks();
            this.showToast('Task updated successfully!', 'success');
            
            // Simulate server request
            this.simulateServerRequest('update', updatedTask);
        }

        handleDeleteConfirm() {
            const id = parseInt(document.getElementById('deleteTaskId').value);
            
            // Delete task
            const success = this.taskManager.deleteTask(id);
            
            // Close modal
            this.closeModal(this.deleteTaskModal);
            
            if (success) {
                // Update UI
                this.displayTasks();
                this.updateStats();
                this.showToast('Task deleted successfully!', 'success');
                
                // Simulate server request
                this.simulateServerRequest('delete', { id });
            }
        }

        toggleTaskComplete(id) {
            // Toggle task's completed status
            const task = this.taskManager.toggleComplete(id);
            
            if (task) {
                // Update UI
                this.displayTasks();
                this.updateStats();
                const message = task.completed ? 'Task marked as completed!' : 'Task marked as pending!';
                this.showToast(message, 'success');
                
                // Simulate server request
                this.simulateServerRequest('update', task);
            }
        }

        openEditModal(id) {
            const task = this.taskManager.getTask(id);
            
            if (task) {
                // Populate form fields
                document.getElementById('editTaskId').value = task.id;
                document.getElementById('editTaskTitle').value = task.title;
                document.getElementById('editTaskDescription').value = task.description;
                document.getElementById('editDueDate').value = task.dueDate;
                document.getElementById('editPriority').value = task.priority;
                
                // Show modal
                this.openModal(this.editTaskModal);
            }
        }

        openDeleteModal(id) {
            document.getElementById('deleteTaskId').value = id;
            this.openModal(this.deleteTaskModal);
        }

        openModal(modal) {
            if (modal) {
                modal.classList.add('show');
            }
        }

        closeModal(modal) {
            if (modal) {
                modal.classList.remove('show');
            }
        }

        formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }

        displayTasks(filter = null) {
            if (!this.taskItems) return;
            
            // Get filtered tasks
            const tasks = filter ? this.taskManager.filterTasks(filter) : this.taskManager.filterTasks(this.taskManager.currentFilter);
            
            // Check if empty
            if (tasks.length === 0) {
                this.taskItems.innerHTML = '';
                this.emptyList.style.display = 'block';
                return;
            }
            
            // Hide empty message
            this.emptyList.style.display = 'none';
            
            // Sort tasks by due date, with newest first
            const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            
            // Create HTML for task items
            let html = '';
            sortedTasks.forEach(task => {
                html += `
                    <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                        <div class="task-content">
                            <div class="task-title">${task.title}
                                <span class="task-priority priority-${task.priority}">${task.priority}</span>
                            </div>
                            <div class="task-description">${task.description || 'No description'}</div>
                            <div class="task-date">
                                <i class="fas fa-calendar-alt"></i>
                                Due: ${this.formatDate(task.dueDate)}
                            </div>
                        </div>
                        <div class="task-actions">
                            <button class="action-btn complete-btn" title="${task.completed ? 'Mark as pending' : 'Mark as complete'}">
                                <i class="fas ${task.completed ? 'fa-times-circle' : 'fa-check-circle'}"></i>
                            </button>
                            <button class="action-btn edit-btn" title="Edit task">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" title="Delete task">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </li>
                `;
            });
            
            this.taskItems.innerHTML = html;
        }

        updateStats() {
            if (!this.totalTasksElement) return;
            
            const stats = this.taskManager.getStats();
            
            this.totalTasksElement.textContent = stats.total;
            this.completedTasksElement.textContent = stats.completed;
            this.pendingTasksElement.textContent = stats.pending;
            this.completionRateElement.textContent = `${stats.completionRate}%`;
        }

        showToast(message, type = 'success') {
            const toastMessage = document.getElementById('toastMessage');
            const toastIcon = this.toast.querySelector('.toast-icon i');
            
            // Set message
            toastMessage.textContent = message;
            
            // Set type
            this.toast.className = `toast toast-${type}`;
            
            // Set icon
            if (type === 'success') {
                toastIcon.className = 'fas fa-check-circle';
            } else {
                toastIcon.className = 'fas fa-exclamation-circle';
            }
            
            // Show toast
            this.toast.classList.add('show');
            
            // Auto hide after 3 seconds
            setTimeout(() => {
                this.toast.classList.remove('show');
            }, 3000);
        }

        simulateServerRequest(action, data) {
            // Simulate server interaction
            console.log(`${action} action:`, data);
            
            // In a real application, this would be an AJAX call to a PHP endpoint
            if (this.taskManager.isLoggedIn()) {
                fetch('api/tasks.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: action,
                        data: data
                    })
                })
                .then(response => response.json())
                .then(result => {
                    console.log('Server response:', result);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    }

    // Initialize app
    const taskManager = new TaskManager();
    const ui = new UI(taskManager);
});