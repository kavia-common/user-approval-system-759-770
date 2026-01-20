import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Loader, ErrorBox, EmptyState } from "../components/UI";

// PUBLIC_INTERFACE
export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const s = await api.getAnalytics();
        if (!ignore) setSummary(s);
      } catch (e) {
        if (!ignore) setError(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadPosts() {
      setLoadingPosts(true);
      try {
        const p = await api.listPosts({ limit: 10 });
        if (!ignore) setPosts(Array.isArray(p) ? p : p?.items || []);
      } catch (e) {
        // show posts error inline below
      } finally {
        if (!ignore) setLoadingPosts(false);
      }
    }
    loadPosts();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <Loader label="Loading analytics" />;
  if (error) return <ErrorBox error={error} />;

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <section className="grid cols-3">
        <div className="card">
          <div className="kpi">
            <div className="icon">👥</div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>
                {summary?.total_followers ?? 0}
              </div>
              <div className="helper">Total Followers</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="kpi">
            <div className="icon">❤️</div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>
                {summary?.total_likes ?? 0}
              </div>
              <div className="helper">Total Likes</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="kpi">
            <div className="icon">💬</div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>
                {summary?.total_comments ?? 0}
              </div>
              <div className="helper">Total Comments</div>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontWeight: 800 }}>Recent Posts</div>
          <div className="helper">Last 10 items</div>
        </div>
        {loadingPosts ? (
          <Loader label="Loading posts" />
        ) : posts.length === 0 ? (
          <EmptyState title="No posts yet" subtitle="Create your first post from Profile page." />
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
                    <td>{p.title || p.content?.slice(0, 32) || "Untitled"}</td>
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
    </div>
  );
}
