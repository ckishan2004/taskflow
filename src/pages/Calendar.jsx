import React, { useMemo, useState } from "react";
import "../style/celender.css";
import { useLocalStorage } from "../hooks/useLocalStorage";

function monthName(i) {
  return ["January","February","March","April","May","June","July","August","September","October","November","December"][i];
}

function toISODate(d) {
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export default function Calendar() {
  const [calendarTasks, setCalendarTasks] = useLocalStorage("calendarTasks", []);
  const [current, setCurrent] = useState(() => new Date());
  const [view, setView] = useState("month"); // month/week/day (week/day placeholders like your html)
  const [selectedDate, setSelectedDate] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", date: toISODate(new Date()), category: "", description: "" });

  const year = current.getFullYear();
  const month = current.getMonth();

  const tasksForDay = (day) => {
    const d = new Date(year, month, day);
    const iso = toISODate(d);
    return calendarTasks.filter((t) => t.date === iso);
  };

  const grid = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const startingDay = first.getDay(); // 0 Sun

    const cells = [];

    // prev month fill
    const prevLast = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
      cells.push({ type: "other", day: prevLast - startingDay + i + 1, monthOffset: -1 });
    }

    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ type: "current", day: d, monthOffset: 0 });
    }

    // next month fill to complete rows like original
    while (cells.length % 7 !== 0) {
      cells.push({ type: "other", day: cells.length - (startingDay + daysInMonth) + 1, monthOffset: +1 });
    }

    return cells;
  }, [year, month]);

  const changeMonth = (dir) => {
    const next = new Date(year, month + (dir === "prev" ? -1 : 1), 1);
    setCurrent(next);
  };

  const goToday = () => setCurrent(new Date());

  const openAdd = () => {
    const base = selectedDate ? selectedDate : new Date(year, month, new Date().getDate());
    setForm({ title: "", date: toISODate(base), category: "", description: "" });
    setModalOpen(true);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.category) {
      alert("Please fill in all required fields");
      return;
    }
    setCalendarTasks([
      ...calendarTasks,
      { id: Date.now(), title: form.title.trim(), date: form.date, category: form.category, description: form.description.trim() },
    ]);
    setModalOpen(false);
  };

  const today = new Date();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-title">
          <i className="fas fa-calendar-alt"></i>
          <span>{monthName(month)} {year}</span>
        </div>

        <div className="calendar-views">
          <button className={`view-btn ${view === "month" ? "active" : ""}`} data-view="month" onClick={() => setView("month")}>Month</button>
          <button className={`view-btn ${view === "week" ? "active" : ""}`} data-view="week" onClick={() => setView("week")}>Week</button>
          <button className={`view-btn ${view === "day" ? "active" : ""}`} data-view="day" onClick={() => setView("day")}>Day</button>
        </div>

        <div className="calendar-nav">
          <button className="calendar-nav-btn prev-month" onClick={() => changeMonth("prev")}><i className="fas fa-chevron-left"></i></button>
          <button className="today-btn" onClick={goToday}>Today</button>
          <button className="calendar-nav-btn next-month" onClick={() => changeMonth("next")}><i className="fas fa-chevron-right"></i></button>
          <button className="calendar-nav-btn add-task" style={{ marginLeft: "1rem" }} onClick={openAdd}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      {/* Placeholders for week/day like your HTML */}
      <div className="calendar-week-header calendar-grid" style={{ display: view === "week" ? "grid" : "none" }} />
      <div className="calendar-day-view" style={{ display: view === "day" ? "block" : "none" }} />

      <div className="calendar-month-view" style={{ display: view === "month" ? "block" : "none" }}>
        <div className="calendar-grid">
          {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((d) => (
            <div key={d} className="day-header">{d}</div>
          ))}

          {grid.map((cell, idx) => {
            const isToday =
              cell.type === "current" &&
              cell.day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            const dayTasks = cell.type === "current" ? tasksForDay(cell.day) : [];

            return (
              <div
                key={idx}
                className="calendar-day"
                onClick={() => {
                  if (cell.type !== "current") return;
                  setSelectedDate(new Date(year, month, cell.day));
                }}
              >
                <div className={`day-number ${cell.type !== "current" ? "other-month" : ""} ${isToday ? "today" : ""}`}>
                  {cell.day}
                </div>

                {cell.type === "current" && dayTasks.length > 0 ? (
                  <>
                    <div className="day-tasks">
                      {dayTasks.slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          className={`task-item task-${t.category}`}
                          title={t.description || t.title}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Task: ${t.title}\nDate: ${t.date}\nCategory: ${t.category}\nDescription: ${t.description || "-"}`);
                          }}
                        >
                          <span className="task-indicator"></span>
                          {t.title}
                        </div>
                      ))}
                    </div>

                    {dayTasks.length > 3 ? (
                      <div className="day-events-count">+{dayTasks.length - 3} more</div>
                    ) : null}
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <div className={`task-modal ${modalOpen ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Add New Task</h3>
            <button className="close-btn" onClick={() => setModalOpen(false)}><i className="fas fa-times"></i></button>
          </div>

          <form id="task-form" onSubmit={addTask}>
            <div className="task-form-group">
              <label htmlFor="task-title" className="task-form-label">Task Title</label>
              <input
                type="text"
                id="task-title"
                className="task-form-input"
                placeholder="Enter task title"
                required
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              />
            </div>

            <div className="task-form-group">
              <label htmlFor="task-date" className="task-form-label">Date</label>
              <input
                type="date"
                id="task-date"
                className="task-form-input"
                required
                value={form.date}
                onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
              />
            </div>

            <div className="task-form-group">
              <label htmlFor="task-category" className="task-form-label">Category</label>
              <select
                id="task-category"
                className="task-form-select"
                required
                value={form.category}
                onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              >
                <option value="">Select category</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>

            <div className="task-form-group">
              <label htmlFor="task-description" className="task-form-label">Description</label>
              <textarea
                id="task-description"
                className="task-form-textarea"
                placeholder="Enter task description"
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary cancel-btn" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Task</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
