import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/useAppStore'

import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'
import Tenants from './pages/Tenants'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Owners from './pages/Owners'
import AuditTrail from './pages/AuditTrail'
import Leads from './pages/Leads'
import NotFound from './pages/NotFound'

const App = () => (
  <AppProvider>
    <BrowserRouter
      future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/audit" element={<AuditTrail />} />
            <Route
              path="/units"
              element={<Navigate to="/projects" replace />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App
