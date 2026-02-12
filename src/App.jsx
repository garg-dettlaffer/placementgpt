import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import PrepPlans from './pages/PrepPlans';
import PrepPlanDetails from './pages/PrepPlanDetails';
import Problems from './pages/Problems';
import CodingWorkspace from './pages/CodingWorkspace';
import CodeEditor from './pages/CodeEditor';
import MockInterview from './pages/MockInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />

              {/* Protected Routes */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
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
                path="/prep-plans"
                element={
                  <ProtectedRoute>
                    <PrepPlans />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/prep-plan/:slug"
                element={
                  <ProtectedRoute>
                    <PrepPlanDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/problems"
                element={
                  <ProtectedRoute>
                    <Problems />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/problem/:slug"
                element={
                  <ProtectedRoute>
                    <CodingWorkspace />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/code/:slug"
                element={
                  <ProtectedRoute>
                    <CodeEditor />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/mock-interview"
                element={
                  <ProtectedRoute>
                    <MockInterview />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/resume-analyzer"
                element={
                  <ProtectedRoute>
                    <ResumeAnalyzer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile/:username"
                element={<Profile />}
              />

              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <Achievements />
                  </ProtectedRoute>
                }
              />

              {/* Catch All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  borderRadius: '0.5rem'
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff'
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff'
                  }
                }
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
