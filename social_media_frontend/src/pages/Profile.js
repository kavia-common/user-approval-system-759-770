import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useSession } from "../context/SessionContext";
import { Loader, ErrorBox, EmptyState, FormField } from "../components/UI";

// PUBLIC_INTERFACE
export default function ProfilePage() {
  const { selectedUserId, setSelectedUserId, profile, loadingProfile, error, refreshProfile } =
    useSession();

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [creatingPost, setCreatingPost] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [screenError, setScreenError] = useState(null);

  const hasProfile = useMemo(() => Boolean(profile && selectedUserId), [profile, selectedUserId]);

  useEffect(() => {
    let ignore = false;
    async function loadUsers() {
      try {
        const list = await api.listUsers();
        if (!ignore) setUsers(Array.isArray(list) ? list : list?.items || []);
      } catch (e) {
        if (!ignore) setScreenError(e.message || "Failed to load users");
      }
    }
    loadUsers();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    async function syncForm() {
      if (!profile) return;
      setForm({
        name: profile.name ?? "",
        bio: profile.bio ?? "",
      });
    }
    syncForm();
    return () => {
      ignore = true;
    };
  }, [profile]);

  useEffect(() => {
    let ignore = false;
    async function loadPosts() {
      if (!selectedUserId) {
        setPosts([]);
        return;
      }
      try {
        const p = await api.listPosts({ userId: selectedUserId });
        if (!ignore) setPosts(Array.isArray(p) ? p : p?.items || []);
      } catch (e) {
        // ignore
      }
    }
    loadPosts();
    return () => {
      ignore = true;
    };
  }, [selectedUserId]);

  async function onSaveProfile(e) {
    e.preventDefault();
    if (!selectedUserId) return;
    setSaving(true);
    setScreenError(null);
    try {
      await api.updateProfile(selectedUserId, form);
      await refreshProfile();
    } catch (e) {
      setScreenError(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function onCreatePost(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!selectedUserId) {
      setScreenError("Select a user first");
      return;
    }
    setCreatingPost(true);
    try {
      await api.createPost({ user_id: selectedUserId, title: data.title, content: data.content });
      const p = await api.listPosts({ userId: selectedUserId });
      setPosts(Array.isArray(p) ? p : p?.items || []);
      e.currentTarget.reset();
    } catch (e) {
      setScreenError(e.message || "Failed to create post");
    } finally {
      setCreatingPost(false);
    }
  }

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <ErrorBox error={screenError || error} />

      <div className="card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          style={{ display: "grid", gap: 12 }}
        >
          <div className="grid cols-2">
            <FormField label="Select User">
              <select
                className="select"
                value={selectedUserId || ""}
                onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">— Choose —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username || u.email || `User ${u.id}`}
                  </option>
                ))}
              </select>
            </FormField>
            <div />
          </div>
        </form>
      </div>

      {loadingProfile ? (
        <Loader label="Loading profile" />
      ) : !hasProfile ? (
        <EmptyState
          title="No profile selected"
          subtitle="Choose a user to manage profile and posts."
        />
      ) : (
        <>
          <section className="grid cols-2">
            <div className="card">
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Profile</div>
              <form onSubmit={onSaveProfile} style={{ display: "grid", gap: 10 }}>
                <FormField label="Name">
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Display name"
                  />
                </FormField>
                <FormField label="Bio">
                  <textarea
                    className="textarea"
                    rows={4}
                    value={form.bio}
                    onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))}
                    placeholder="A short bio..."
                  />
                </FormField>
                <div>
                  <button className="btn" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>

            <div className="card">
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Create Post</div>
              <form onSubmit={onCreatePost} style={{ display: "grid", gap: 10 }}>
                <FormField label="Title">
                  <input className="input" name="title" placeholder="Post title" required />
                </FormField>
                <FormField label="Content">
                  <textarea className="textarea" name="content" rows={4} placeholder="Write something..." required />
                </FormField>
                <div>
                  <button className="btn secondary" type="submit" disabled={creatingPost}>
                    {creatingPost ? "Creating..." : "Publish"}
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontWeight: 800 }}>Posts by user</div>
              <div className="helper">User ID: {selectedUserId}</div>
            </div>
            {posts.length === 0 ? (
              <EmptyState title="No posts" subtitle="Create the first post above." />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.title || p.content?.slice(0, 32)}</td>
                        <td>{p.likes ?? 0}</td>
                        <td>{p.comments ?? 0}</td>
                        <td>{p.created_at ? new Date(p.created_at).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
