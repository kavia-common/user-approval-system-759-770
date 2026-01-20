import React from "react";
import { NavLink } from "react-router-dom";
import { useSession } from "../context/SessionContext";

// PUBLIC_INTERFACE
export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="dot" />
        Social Dashboard
      </div>
      <nav className="nav">
        <NavLink to="/" end>
          Analytics
        </NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
      <div style={{ marginTop: "auto", fontSize: 12, color: "var(--muted)" }}>
        <div>Theme: light</div>
        <div>v0.1</div>
      </div>
    </aside>
  );
}

// PUBLIC_INTERFACE
export function Topbar() {
  const { selectedUserId } = useSession();
  return (
    <header className="topbar">
      <div className="badge">
        <span>📈</span> Engagement Insights
      </div>
      <div className="top-actions">
        <span className="helper">User: {selectedUserId ?? "None selected"}</span>
      </div>
    </header>
  );
}

// PUBLIC_INTERFACE
export function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <Topbar />
      <main className="content">{children}</main>
    </div>
  );
}
