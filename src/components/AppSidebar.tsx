import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Building2,
  Users,
  HardHat,
  FileText,
  Settings,
  LogOut,
  Building,
} from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const { user, logout } = useAppStore()
  const location = useLocation()
  const { toggleSidebar, isMobile } = useSidebar()

  if (!user) return null

  const isActive = (path: string) => location.pathname === path

  const masterLinks = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Construtoras', icon: Building2, path: '/tenants' },
    { title: 'Auditoria', icon: FileText, path: '/audit' },
    { title: 'Configurações', icon: Settings, path: '/settings' },
  ]

  const adminLinks = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Projetos', icon: Building, path: '/projects' },
    { title: 'Unidades', icon: HardHat, path: '/units' }, // Will redirect to project details generally, but good for direct access
    { title: 'Proprietários', icon: Users, path: '/owners' },
    { title: 'Configurações', icon: Settings, path: '/settings' },
  ]

  const ownerLinks = [
    { title: 'Meu Painel', icon: LayoutDashboard, path: '/' },
    { title: 'Documentos', icon: FileText, path: '/documents' },
    { title: 'Suporte', icon: Users, path: '/support' },
  ]

  const links =
    user.role === 'MASTER'
      ? masterLinks
      : user.role === 'ADMIN'
        ? adminLinks
        : ownerLinks

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 font-bold text-xl px-4 w-full">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap overflow-hidden">
            SaaS Construtora
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {links.map((link) => (
            <SidebarMenuItem key={link.path}>
              <SidebarMenuButton
                asChild
                isActive={isActive(link.path)}
                tooltip={link.title}
                onClick={() => isMobile && toggleSidebar()}
              >
                <Link to={link.path}>
                  <link.icon className="h-5 w-5" />
                  <span>{link.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              variant="outline"
              className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="group-data-[collapsible=icon]:hidden">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
