import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import "./index.css";
import { SessionProvider } from "./context/SessionContext";
import { Layout } from "./components/Layout";
import AnalyticsPage from "./pages/Analytics";
import ProfilePage from "./pages/Profile";
import AdminPage from "./pages/Admin";

// PUBLIC_INTERFACE
function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<AnalyticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
