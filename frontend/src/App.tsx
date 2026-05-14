import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import WorkInProgress from "./components/WorkInProgress";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<WorkInProgress pageName="Login" />} />
          <Route
            path="/register"
            element={<WorkInProgress pageName="Register" />}
          />
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
