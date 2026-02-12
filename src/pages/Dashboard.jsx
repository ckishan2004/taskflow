import React, { useMemo, useState } from "react";
import "../style/taskflow.css";
import { useTasks } from "../hooks/useTasks";

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default function Dashboard() {
  const { tasks, stats, addTask, updateTask, deleteTask, toggleComplete } = useTasks();

  const [filter, setFilter] = useState("all"); // all | pending | completed

  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    id: 0,
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
  });

  const [deleteId, setDeleteId] = useState(0);

  const filtered = useMemo(() => {
    if (filter === "pending") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [filtered]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  const onAdd = (e) => {
    e.preventDefault();
    const title = e.target.taskTitle.value.trim();
    const description = e.target.taskDescription.value.trim();
    const dueDate = e.target.dueDate.value;
    const priority = e.target.priority.value;

    addTask(title, description, dueDate, priority);
    e.target.reset();
    showToast("Task added successfully!", "success");
  };

  const openEdit = (task) => {
    setEditForm({
      id: task.id,
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate,
      priority: task.priority,
    });
    setEditOpen(true);
  };

  const submitEdit = (e) => {
    e.preventDefault();
    updateTask(editForm.id, {
      title: editForm.title,
      description: editForm.description,
      dueDate: editForm.dueDate,
      priority: editForm.priority,
    });
    setEditOpen(false);
    showToast("Task updated successfully!", "success");
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteTask(deleteId);
    setDeleteOpen(false);
    showToast("Task deleted successfully!", "success");
  };

  return (
    <>
      <main className="main">
        <div className="container">
          <div className="welcome-section">
            <h2>Welcome to TaskFlow</h2>
            <p>
              Organize your tasks efficiently with our intuitive task management system. Add, edit, and track your
              tasks with ease.
            </p>
          </div>

          <div className="dashboard">
            <div className="task-form">
              <h3>Add New Task</h3>
              <form id="taskForm" onSubmit={onAdd}>
                <div className="form-group">
                  <label htmlFor="taskTitle">Task Title</label>
                  <input type="text" id="taskTitle" name="taskTitle" className="form-control" placeholder="Enter task title" required />
                </div>

                <div className="form-group">
                  <label htmlFor="taskDescription">Description</label>
                  <textarea id="taskDescription" name="taskDescription" className="form-control" rows="3" placeholder="Enter task description"></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input type="date" id="dueDate" name="dueDate" className="form-control" required />
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select id="priority" name="priority" className="form-control" required defaultValue="low">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-plus"></i> Add Task
                </button>
              </form>
            </div>

            <div className="task-list">
              <h3>
                Your Tasks
                <div className="filter-options">
                  <button className={`filter-btn ${filter === "all" ? "active" : ""}`} data-filter="all" onClick={() => setFilter("all")}>
                    All
                  </button>
                  <button className={`filter-btn ${filter === "pending" ? "active" : ""}`} data-filter="pending" onClick={() => setFilter("pending")}>
                    Pending
                  </button>
                  <button className={`filter-btn ${filter === "completed" ? "active" : ""}`} data-filter="completed" onClick={() => setFilter("completed")}>
                    Completed
                  </button>
                </div>
              </h3>

              <ul className="task-items" id="taskItems">
                {sorted.map((task) => (
                  <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`} data-id={task.id}>
                    <div className="task-content">
                      <div className="task-title">
                        {task.title}
                        <span className={`task-priority priority-${task.priority}`}>{task.priority}</span>
                      </div>
                      <div className="task-description">{task.description || "No description"}</div>
                      <div className="task-date">
                        <i className="fas fa-calendar-alt"></i>
                        Due: {formatDate(task.dueDate)}
                      </div>
                    </div>

                    <div className="task-actions">
                      <button className="action-btn complete-btn" title={task.completed ? "Mark as pending" : "Mark as complete"} onClick={() => {
                        toggleComplete(task.id);
                        showToast(task.completed ? "Task marked as pending!" : "Task marked as completed!", "success");
                      }}>
                        <i className={`fas ${task.completed ? "fa-times-circle" : "fa-check-circle"}`}></i>
                      </button>

                      <button className="action-btn edit-btn" title="Edit task" onClick={() => openEdit(task)}>
                        <i className="fas fa-edit"></i>
                      </button>

                      <button className="action-btn delete-btn" title="Delete task" onClick={() => openDelete(task.id)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {sorted.length === 0 ? (
                <div className="empty-list" id="emptyList" style={{ display: "block" }}>
                  <i className="fas fa-clipboard fa-3x"></i>
                  <p>No tasks found. Add your first task!</p>
                </div>
              ) : (
                <div className="empty-list" id="emptyList" style={{ display: "none" }} />
              )}
            </div>
          </div>

          <div className="progress-section">
            <h3>Your Progress</h3>
            <div className="progress-container">
              <div className="progress-card">
                <h4>Total Tasks</h4>
                <div className="value total-tasks" id="totalTasks">{stats.total}</div>
              </div>
              <div className="progress-card">
                <h4>Completed</h4>
                <div className="value completed-tasks" id="completedTasks">{stats.completed}</div>
              </div>
              <div className="progress-card">
                <h4>Pending</h4>
                <div className="value pending-tasks" id="pendingTasks">{stats.pending}</div>
              </div>
              <div className="progress-card">
                <h4>Completion Rate</h4>
                <div className="value completion-rate" id="completionRate">{stats.completionRate}%</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <div className={`modal ${editOpen ? "show" : ""}`} id="editTaskModal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Edit Task</h2>
            <button className="close-modal" id="closeEditModal" onClick={() => setEditOpen(false)}>&times;</button>
          </div>

          <form id="editTaskForm" onSubmit={submitEdit}>
            <input type="hidden" id="editTaskId" value={editForm.id} readOnly />

            <div className="form-group">
              <label htmlFor="editTaskTitle">Task Title</label>
              <input
                type="text"
                id="editTaskTitle"
                className="form-control"
                placeholder="Enter task title"
                required
                value={editForm.title}
                onChange={(e) => setEditForm((s) => ({ ...s, title: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="editTaskDescription">Description</label>
              <textarea
                id="editTaskDescription"
                className="form-control"
                rows="3"
                placeholder="Enter task description"
                value={editForm.description}
                onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="editDueDate">Due Date</label>
              <input
                type="date"
                id="editDueDate"
                className="form-control"
                required
                value={editForm.dueDate}
                onChange={(e) => setEditForm((s) => ({ ...s, dueDate: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="editPriority">Priority</label>
              <select
                id="editPriority"
                className="form-control"
                required
                value={editForm.priority}
                onChange={(e) => setEditForm((s) => ({ ...s, priority: e.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" id="cancelEdit" onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Update Task</button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Modal */}
      <div className={`modal ${deleteOpen ? "show" : ""}`} id="deleteTaskModal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Delete Task</h2>
            <button className="close-modal" id="closeDeleteModal" onClick={() => setDeleteOpen(false)}>&times;</button>
          </div>

          <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          <input type="hidden" id="deleteTaskId" value={deleteId} readOnly />

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" id="cancelDelete" onClick={() => setDeleteOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" id="confirmDelete" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast toast-${toast.type} ${toast.show ? "show" : ""}`} id="toast">
        <div className="toast-icon">
          <i className={`fas ${toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
        </div>
        <div className="toast-message" id="toastMessage">{toast.message}</div>
      </div>
    </>
  );
}
