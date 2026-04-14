import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Layout() {
  const { user, logout, isAuthenticated, loading } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/projects" className="brand">
          GitTogether
        </Link>
        <nav className="site-nav" aria-label="Main">
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }
            end
          >
            Projects
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/projects/new"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              New project
            </NavLink>
          )}
        </nav>
        <div className="site-auth">
          {loading ? (
            <span className="text-muted">…</span>
          ) : isAuthenticated ? (
            <>
              <span className="user-chip" title={user?.email || ""}>
                {user?.username}
              </span>
              <button type="button" className="btn btn--ghost" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link--active" : "nav-link"
                }
              >
                Log in
              </NavLink>
              <Link to="/register" className="btn btn--primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}
