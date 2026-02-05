import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  User,
  Tenant,
  Project,
  Unit,
  Owner,
  AuditLog,
  Lead,
  LeadStatus,
  ProjectDocument,
  DocumentLog,
} from '@/types'
import {
  mockUsers,
  mockTenants,
  mockProjects,
  mockUnits,
  mockOwners,
  mockAuditLogs,
  mockLeads,
  mockDocuments,
  mockDocumentLogs,
} from '@/data/mockData'

interface AppState {
  user: User | null
  tenants: Tenant[]
  projects: Project[]
  units: Unit[]
  owners: Owner[]
  auditLogs: AuditLog[]
  leads: Lead[]
  documents: ProjectDocument[]
  documentLogs: DocumentLog[]
  login: (email: string, password?: string) => Promise<boolean>
  logout: () => void
  addTenant: (tenant: Tenant) => void
  addProject: (project: Project) => void
  addUnit: (unit: Unit) => void
  updateUnitStatus: (
    id: string,
    status: Unit['status'],
    ownerId?: string,
  ) => void
  updateUnit: (unit: Unit) => void
  deleteUnit: (id: string) => void
  addOwner: (owner: Owner) => void
  addAuditLog: (log: AuditLog) => void
  getFilteredProjects: () => Project[]
  getFilteredUnits: () => Unit[]
  addLead: (lead: Lead) => void
  updateLeadStatus: (id: string, status: LeadStatus) => void
  approveLead: (id: string) => void
  // Document Management
  addDocument: (doc: ProjectDocument) => void
  updateDocumentVisibility: (id: string, isVisible: boolean) => void
  logDocumentAction: (log: DocumentLog) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [units, setUnits] = useState<Unit[]>(mockUnits)
  const [owners, setOwners] = useState<Owner[]>(mockOwners)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [documents, setDocuments] = useState<ProjectDocument[]>(mockDocuments)
  const [documentLogs, setDocumentLogs] =
    useState<DocumentLog[]>(mockDocumentLogs)

  const addAuditLog = (log: AuditLog) => {
    setAuditLogs((prev) => [log, ...prev])
  }

  const login = async (email: string, password?: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email)

    // In a real app, we would check password here.
    // For this mock, we accept any password if user exists.
    if (foundUser) {
      setUser(foundUser)
      addAuditLog({
        id: Math.random().toString(),
        userId: foundUser.id,
        userName: foundUser.name,
        action: 'LOGIN',
        entityType: 'AUTH',
        entityId: foundUser.id,
        details: 'User logged in successfully',
        timestamp: new Date().toISOString(),
      })
      return true
    } else {
      addAuditLog({
        id: Math.random().toString(),
        userId: 'sys',
        userName: 'System',
        action: 'LOGIN_FAILED',
        entityType: 'AUTH',
        entityId: email,
        details: `Failed login attempt for ${email}`,
        timestamp: new Date().toISOString(),
      })
      return false
    }
  }

  const logout = () => {
    if (user) {
      addAuditLog({
        id: Math.random().toString(),
        userId: user.id,
        userName: user.name,
        action: 'LOGOUT',
        entityType: 'AUTH',
        entityId: user.id,
        details: 'User logged out',
        timestamp: new Date().toISOString(),
      })
    }
    setUser(null)
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

  const updateUnit = (unit: Unit) => {
    setUnits((prev) => prev.map((u) => (u.id === unit.id ? unit : u)))
    addAuditLog({
      id: Math.random().toString(),
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      action: 'UPDATE',
      entityType: 'UNIT',
      entityId: unit.id,
      details: `Updated unit ${unit.number} details`,
      timestamp: new Date().toISOString(),
    })
  }

  const deleteUnit = (id: string) => {
    const unit = units.find((u) => u.id === id)
    setUnits((prev) => prev.filter((u) => u.id !== id))
    addAuditLog({
      id: Math.random().toString(),
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      action: 'DELETE',
      entityType: 'UNIT',
      entityId: id,
      details: `Deleted unit ${unit?.number || id}`,
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

  const addLead = (lead: Lead) => {
    setLeads([lead, ...leads])
    addAuditLog({
      id: Math.random().toString(),
      userId: 'sys',
      userName: 'System (Public)',
      action: 'CREATE',
      entityType: 'LEAD',
      entityId: lead.id,
      details: `New lead captured: ${lead.businessName}`,
      timestamp: new Date().toISOString(),
    })
  }

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    addAuditLog({
      id: Math.random().toString(),
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      action: 'UPDATE',
      entityType: 'LEAD',
      entityId: id,
      details: `Lead status updated to ${status}`,
      timestamp: new Date().toISOString(),
    })
  }

  const approveLead = (id: string) => {
    const lead = leads.find((l) => l.id === id)
    if (!lead) return

    if (lead.status === 'APPROVED') return

    const newTenant: Tenant = {
      id: Math.random().toString(),
      name: lead.businessName,
      cnpj: lead.cnpj,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      projectCount: 0,
      logoUrl: `https://img.usecurling.com/i?q=building&color=black`,
      primaryColor: '#000000',
    }

    addTenant(newTenant)
    updateLeadStatus(id, 'APPROVED')
  }

  const getFilteredProjects = () => {
    if (!user) return []
    if (user.role === 'MASTER') return projects
    if (user.role === 'ADMIN')
      return projects.filter((p) => p.tenantId === user.tenantId)
    return projects // For owners, usually we filter by ownership but keeping this simple
  }

  const getFilteredUnits = () => {
    if (!user) return []
    const visibleProjects = getFilteredProjects().map((p) => p.id)
    return units.filter((u) => visibleProjects.includes(u.projectId))
  }

  // Document Management Methods
  const addDocument = (doc: ProjectDocument) => {
    setDocuments((prev) => [doc, ...prev])
    logDocumentAction({
      id: Math.random().toString(),
      documentId: doc.id,
      action: 'UPLOAD',
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      timestamp: new Date().toISOString(),
      details: `Version ${doc.version} uploaded`,
    })
  }

  const updateDocumentVisibility = (id: string, isVisible: boolean) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, isVisibleToOwners: isVisible } : doc,
      ),
    )
    logDocumentAction({
      id: Math.random().toString(),
      documentId: id,
      action: 'PERMISSION_CHANGE',
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      timestamp: new Date().toISOString(),
      details: `Visibility changed to ${isVisible ? 'Visible' : 'Hidden'}`,
    })
  }

  const logDocumentAction = (log: DocumentLog) => {
    setDocumentLogs((prev) => [log, ...prev])
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
        leads,
        documents,
        documentLogs,
        login,
        logout,
        addTenant,
        addProject,
        addUnit,
        updateUnitStatus,
        updateUnit,
        deleteUnit,
        addOwner,
        addAuditLog,
        getFilteredProjects,
        getFilteredUnits,
        addLead,
        updateLeadStatus,
        approveLead,
        addDocument,
        updateDocumentVisibility,
        logDocumentAction,
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
