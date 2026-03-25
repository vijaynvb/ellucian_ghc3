import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const AppLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Task Management MVP</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/reports">Reports</Link>
        </nav>
        <div>
          <span>{user?.email}</span>
          <button onClick={() => void logout()}>Logout</button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
