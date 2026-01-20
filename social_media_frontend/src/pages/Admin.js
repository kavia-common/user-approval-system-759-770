import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Loader, ErrorBox, EmptyState, FormField } from "../components/UI";
import { useSession } from "../context/SessionContext";

// PUBLIC_INTERFACE
export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const { setSelectedUserId } = useSession();

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const list = await api.listUsers();
      setUsers(Array.isArray(list) ? list : list?.items || []);
    } catch (e) {
      setErr(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreateUser(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setCreating(true);
    setErr(null);
    try {
      await api.createUser({ username: data.username, email: data.email });
      e.currentTarget.reset();
      await refresh();
    } catch (e) {
      setErr(e.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  }

  async function onDeleteUser(id) {
    if (!window.confirm("Delete user?")) return;
    try {
      await api.deleteUser(id);
      await refresh();
    } catch (e) {
      setErr(e.message || "Failed to delete user");
    }
  }

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <ErrorBox error={err} />

      <section className="grid cols-2">
        <div className="card">
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Create User</div>
          <form onSubmit={onCreateUser} style={{ display: "grid", gap: 10 }}>
            <FormField label="Username">
              <input className="input" name="username" placeholder="janedoe" required />
            </FormField>
            <FormField label="Email">
              <input className="input" type="email" name="email" placeholder="jane@example.com" required />
            </FormField>
            <div>
              <button className="btn" type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
        <div className="card">
          <div className="kpi">
            <div className="icon">🛡️</div>
            <div>
              <div style={{ fontWeight: 800 }}>Admin Tools</div>
              <div className="helper">Manage users and link to Profiles</div>
            </div>
          </div>
          <div style={{ marginTop: 10 }} className="helper">
            Click "Manage" to jump to Profile page for that user.
          </div>
        </div>
      </section>

      <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontWeight: 800 }}>All Users</div>
          <div className="helper">Total: {users.length}</div>
        </div>
        {loading ? (
          <Loader label="Loading users" />
        ) : users.length === 0 ? (
          <EmptyState title="No users" subtitle="Create the first user above." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th style={{ width: 220 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn ghost" onClick={() => setSelectedUserId(u.id)}>
                          Select
                        </button>
                        <a className="btn ghost" href="/profile" onClick={() => setSelectedUserId(u.id)}>
                          Manage
                        </a>
                        <button className="btn" style={{ background: "var(--error)" }} onClick={() => onDeleteUser(u.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
