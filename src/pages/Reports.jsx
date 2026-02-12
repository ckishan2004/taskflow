import React, { useMemo } from "react";
import "../style/reports.css";
import { useTasks } from "../hooks/useTasks";

export default function Reports() {
  const { tasks } = useTasks();

  const report = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const priorityCount = { High: 0, Medium: 0, Low: 0 };
    tasks.forEach((t) => {
      const p = (t.priority || "").toLowerCase();
      if (p === "high") priorityCount.High++;
      if (p === "medium") priorityCount.Medium++;
      if (p === "low") priorityCount.Low++;
    });

    const now = new Date();
    const overdue = tasks
      .filter((t) => !t.completed && new Date(t.dueDate) < now)
      .map((t) => ({ title: t.title, dueDate: t.dueDate }));

    return { totalTasks, completedTasks, pendingTasks, completionRate, priorityCount, overdue };
  }, [tasks]);

  return (
    <div className="container">
      <h1>📊 Task Reports</h1>

      <section className="report-overview">
        <div className="card">Total Tasks: {report.totalTasks}</div>
        <div className="card">Completed: {report.completedTasks}</div>
        <div className="card">Pending: {report.pendingTasks}</div>
        <div className="card">Completion Rate: {report.completionRate}%</div>
      </section>

      <section className="report-breakdowns">
        <h2>Priority Breakdown</h2>
        <ul>
          {Object.entries(report.priorityCount).map(([k, v]) => (
            <li key={k}>{k}: {v}</li>
          ))}
        </ul>
      </section>

      <section className="report-overdue-upcoming">
        <h2>Upcoming &amp; Overdue Tasks</h2>
        <ul>
          {report.overdue.length === 0 ? <li>No overdue tasks 🎉</li> : null}
          {report.overdue.map((t, i) => (
            <li key={i}>{t.title} - Due: {t.dueDate}</li>
          ))}
        </ul>
      </section>

      <section className="report-task-list">
        <h2>All Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.priority}</td>
                <td>{t.completed ? "Completed" : "Pending"}</td>
                <td>{t.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
