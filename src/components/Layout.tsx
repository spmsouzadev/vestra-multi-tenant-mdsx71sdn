import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'
import useAppStore from '@/stores/useAppStore'

export default function Layout() {
  const { user } = useAppStore()
  const location = useLocation()

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If authenticated and trying to access /login, redirect to /dashboard
  // (Note: This logic is also usually handled in the Login page itself)
  if (user && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6 md:p-8 pt-6 max-w-[1600px] w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  )
}
