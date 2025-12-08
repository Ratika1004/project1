import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./modules/auth/Login";
import Register from "./modules/auth/Register";
import VerifyOtp from "./modules/auth/VerifyOtp";

import DashboardPage from "./modules/dashboard/DashboardPage";
import GroupsPage from "./modules/groups/GroupsPage";
import GroupPage from "./modules/groups/GroupPage";

import ProtectedRoute from "./modules/shared/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <GroupsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:id"
        element={
          <ProtectedRoute>
            <GroupPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div style={{ padding: 20 }}>404 — Not found</div>} />
    </Routes>
  );
}

export default App;
