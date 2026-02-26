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
import { consentService } from '@/services/consentService'

export interface Consents {
  termsOfUse: boolean
  analytics: boolean
  marketing: boolean
}

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
  // Consent State
  consents: Consents
  consentResolved: boolean
  updateConsents: (newConsents: Partial<Consents>) => Promise<void>
  // Methods
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
  addDocument: (doc: ProjectDocument) => void
  updateDocumentVisibility: (id: string, isVisible: boolean) => void
  logDocumentAction: (log: DocumentLog) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

const getInitialConsents = (): Consents => {
  try {
    const saved = localStorage.getItem('vestra_consents')
    if (saved) return JSON.parse(saved)
  } catch (e) {
    // Ignore parse errors
  }
  return { termsOfUse: true, analytics: false, marketing: false }
}

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

  // Consent State Initialization
  const [consents, setConsents] = useState<Consents>(getInitialConsents)
  const [consentResolved, setConsentResolved] = useState<boolean>(() => {
    return localStorage.getItem('vestra_consent_resolved') === 'true'
  })

  const addAuditLog = (log: AuditLog) => {
    setAuditLogs((prev) => [log, ...prev])
  }

  const updateConsents = async (newConsents: Partial<Consents>) => {
    const updated = { ...consents, ...newConsents, termsOfUse: true } // termsOfUse is always true
    setConsents(updated)
    setConsentResolved(true)

    localStorage.setItem('vestra_consents', JSON.stringify(updated))
    localStorage.setItem('vestra_consent_resolved', 'true')

    if (user) {
      try {
        await Promise.all([
          consentService.upsertConsent(
            user.id,
            'Termos de Uso',
            updated.termsOfUse,
          ),
          consentService.upsertConsent(
            user.id,
            'Cookies Analíticos',
            updated.analytics,
          ),
          consentService.upsertConsent(user.id, 'Marketing', updated.marketing),
        ])
        addAuditLog({
          id: Math.random().toString(),
          userId: user.id,
          userName: user.name,
          action: 'CONSENT_UPDATE',
          entityType: 'USER',
          entityId: user.id,
          details: `Consents updated: Analytics=${updated.analytics}, Marketing=${updated.marketing}`,
          timestamp: new Date().toISOString(),
        })
      } catch (e) {
        console.error('Failed to sync consents to DB (Expected in Mock)', e)
      }
    }
  }

  const login = async (email: string, password?: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const foundUser = mockUsers.find((u) => u.email === email)

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

      // Sync Consents logic on login
      try {
        const dbConsents = await consentService.getUserConsents(foundUser.id)
        if (dbConsents && dbConsents.length > 0) {
          // Merge DB consents into local state
          const merged = { ...consents }
          dbConsents.forEach((c) => {
            if (c.consent_type === 'Cookies Analíticos')
              merged.analytics = c.is_accepted
            if (c.consent_type === 'Marketing') merged.marketing = c.is_accepted
            if (c.consent_type === 'Termos de Uso')
              merged.termsOfUse = c.is_accepted
          })
          setConsents(merged)
          setConsentResolved(true)
          localStorage.setItem('vestra_consents', JSON.stringify(merged))
          localStorage.setItem('vestra_consent_resolved', 'true')
        } else if (consentResolved) {
          // Push local resolved consents to DB if missing
          await Promise.all([
            consentService.upsertConsent(
              foundUser.id,
              'Termos de Uso',
              consents.termsOfUse,
            ),
            consentService.upsertConsent(
              foundUser.id,
              'Cookies Analíticos',
              consents.analytics,
            ),
            consentService.upsertConsent(
              foundUser.id,
              'Marketing',
              consents.marketing,
            ),
          ])
        }
      } catch (e) {
        console.error('Error syncing user consents', e)
      }

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
    if (!lead || lead.status === 'APPROVED') return

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
    return projects
  }

  const getFilteredUnits = () => {
    if (!user) return []
    const visibleProjects = getFilteredProjects().map((p) => p.id)
    return units.filter((u) => visibleProjects.includes(u.projectId))
  }

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
        consents,
        consentResolved,
        updateConsents,
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
