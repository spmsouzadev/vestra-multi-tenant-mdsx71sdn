import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User, Tenant, Project, Unit, Owner, AuditLog } from '@/types'
import {
  mockUsers,
  mockTenants,
  mockProjects,
  mockUnits,
  mockOwners,
  mockAuditLogs,
} from '@/data/mockData'

interface AppState {
  user: User | null
  tenants: Tenant[]
  projects: Project[]
  units: Unit[]
  owners: Owner[]
  auditLogs: AuditLog[]
  login: (email: string) => void
  logout: () => void
  addTenant: (tenant: Tenant) => void
  addProject: (project: Project) => void
  addUnit: (unit: Unit) => void
  updateUnitStatus: (
    id: string,
    status: Unit['status'],
    ownerId?: string,
  ) => void
  addOwner: (owner: Owner) => void
  addAuditLog: (log: AuditLog) => void
  getFilteredProjects: () => Project[]
  getFilteredUnits: () => Unit[]
}

const AppContext = createContext<AppState | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [units, setUnits] = useState<Unit[]>(mockUnits)
  const [owners, setOwners] = useState<Owner[]>(mockOwners)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)

  const login = (email: string) => {
    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser) {
      setUser(foundUser)
    }
  }

  const logout = () => {
    setUser(null)
  }

  const addAuditLog = (log: AuditLog) => {
    setAuditLogs((prev) => [log, ...prev])
  }

  const addTenant = (tenant: Tenant) => {
    setTenants([...tenants, tenant])
    addAuditLog({
      id: Math.random().toString(),
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      action: 'CREATE',
      entityType: 'TENANT',
      entityId: tenant.id,
      details: `Created tenant ${tenant.name}`,
      timestamp: new Date().toISOString(),
    })
  }

  const addProject = (project: Project) => {
    setProjects([...projects, project])
    addAuditLog({
      id: Math.random().toString(),
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      action: 'CREATE',
      entityType: 'PROJECT',
      entityId: project.id,
      details: `Created project ${project.name}`,
      timestamp: new Date().toISOString(),
    })
  }

  const addUnit = (unit: Unit) => {
    setUnits([...units, unit])
  }

  const updateUnitStatus = (
    id: string,
    status: Unit['status'],
    ownerId?: string,
  ) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status, ownerId: ownerId || u.ownerId } : u,
      ),
    )
    addAuditLog({
      id: Math.random().toString(),
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      action: 'UPDATE',
      entityType: 'UNIT',
      entityId: id,
      details: `Updated unit status to ${status}`,
      timestamp: new Date().toISOString(),
    })
  }

  const addOwner = (owner: Owner) => {
    setOwners([...owners, owner])
    addAuditLog({
      id: Math.random().toString(),
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      action: 'CREATE',
      entityType: 'OWNER',
      entityId: owner.id,
      details: `Registered owner ${owner.name}`,
      timestamp: new Date().toISOString(),
    })
  }

  const getFilteredProjects = () => {
    if (!user) return []
    if (user.role === 'MASTER') return projects
    if (user.role === 'ADMIN')
      return projects.filter((p) => p.tenantId === user.tenantId)
    // Owner logic implies seeing units, but if we list projects, maybe only relevant ones
    return projects
  }

  const getFilteredUnits = () => {
    if (!user) return []
    const visibleProjects = getFilteredProjects().map((p) => p.id)
    return units.filter((u) => visibleProjects.includes(u.projectId))
  }

  return (
    <AppContext.Provider
      value={{
        user,
        tenants,
        projects,
        units,
        owners,
        auditLogs,
        login,
        logout,
        addTenant,
        addProject,
        addUnit,
        updateUnitStatus,
        addOwner,
        addAuditLog,
        getFilteredProjects,
        getFilteredUnits,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}
