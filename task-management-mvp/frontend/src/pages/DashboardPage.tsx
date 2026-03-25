import { Link } from "react-router-dom";

export const DashboardPage = () => {
  return (
    <section className="page">
      <h2>Dashboard</h2>
      <p>Use the quick links below to manage tasks and reports.</p>
      <div style={{ display: "flex", gap: "12px" }}>
        <Link to="/tasks">Open Tasks</Link>
        <Link to="/tasks/new">Create Task</Link>
        <Link to="/reports">View Reports</Link>
      </div>
    </section>
  );
};
