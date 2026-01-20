import React from "react";

// PUBLIC_INTERFACE
export function Loader({ label = "Loading..." }) {
  return (
    <div className="card" role="status" aria-live="polite">
      <div className="kpi">
        <div className="icon">⏳</div>
        <div>
          <div style={{ fontWeight: 700 }}>{label}</div>
          <div className="helper">Please wait</div>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function ErrorBox({ error }) {
  if (!error) return null;
  return (
    <div
      className="card"
      style={{
        borderColor: "#fecaca",
        background: "#fef2f2",
        color: "#991b1b",
      }}
      role="alert"
    >
      <div className="kpi">
        <div className="icon" style={{ background: "rgba(239,68,68,.15)" }}>
          ❌
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>Something went wrong</div>
          <div className="helper">{String(error)}</div>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function EmptyState({ title = "No data", subtitle = "Try creating something." }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>🗂️</div>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div className="helper">{subtitle}</div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function FormField({ label, children, helper }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{label}</label>
      {children}
      {helper && <div className="helper">{helper}</div>}
    </div>
  );
}
