import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import WorkInProgress from "./components/WorkInProgress";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/mfa/setup"
            element={<WorkInProgress pageName="MFA Setup" />}
          />
          <Route
            path="/mfa/verify"
            element={<WorkInProgress pageName="MFA Verify" />}
          />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <WorkInProgress pageName="Home / Dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <WorkInProgress pageName="Profile" />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<WorkInProgress pageName="404 — Page Not Found" />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
