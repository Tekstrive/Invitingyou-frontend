import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Templates } from "./pages/Templates";
import { Editor } from "./pages/Editor";
import { CreateEvent } from "./pages/CreateEvent";
import { EventDashboard } from "./pages/EventDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";
import { PublicRSVP } from "./pages/PublicRSVP";

import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();

  // Hide navbar on editor and event details pages
  const hideNavbar =
    location.pathname.startsWith("/editor") ||
    location.pathname.startsWith("/event/details") ||
    location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/rsvp/:eventId/:guestId" element={<PublicRSVP />} />
        <Route path="/rsvp/:eventId" element={<PublicRSVP />} />

        {/* Protected routes */}
        <Route
          path="/editor/:templateId"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/events/:eventId"
          element={
            <ProtectedRoute>
              <EventDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/details/:eventId"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
