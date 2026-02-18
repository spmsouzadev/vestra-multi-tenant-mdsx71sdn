export type Role = 'MASTER' | 'ADMIN' | 'OWNER'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
  tenantId?: string
}

export interface Tenant {
  id: string
  name: string
  cnpj: string
  logoUrl?: string
  primaryColor?: string
  status: 'ACTIVE' | 'SUSPENDED'
  createdAt: string
  projectCount: number
  // New fields
  adminEmail?: string
  phone?: string
  plan?: string
  subscriptionStatus?: string
  lastPaymentDate?: string
  storageUsed?: number
}

export interface BillingRecord {
  id: string
  tenantId: string
  invoiceNumber: string
  amount: number
  status: 'PAID' | 'PENDING' | 'OVERDUE'
  dueDate: string
  paidAt?: string
  pdfUrl?: string
}

export type ProjectStatus = 'PLANNING' | 'CONSTRUCTION' | 'DELIVERED'
export type ProjectPhase =
  | 'PRE_SALES'
  | 'EXECUTION'
  | 'DELIVERY'
  | 'POST_DELIVERY'

export interface Project {
  id: string
  tenantId: string
  name: string
  city: string
  state: string
  manager: string
  address: string
  totalUnits: number
  deliveredUnits: number
  openIssues: number
  completionPercentage: number
  deliveryDate: string // Previsão
  actualDeliveryDate?: string // Real
  status: ProjectStatus
  phase: ProjectPhase
  imageUrl?: string
}

export interface Unit {
  id: string
  projectId: string
  block: string
  number: string
  floor: string
  bedrooms: number
  bathrooms: number
  typology: string
  area: number
  price: number
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DELIVERED' | 'BLOCKED'
  ownerId?: string
}

export interface Owner {
  id: string
  name: string
  email: string
  phone: string
  document: string
  unitsOwned: string[]
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  entityType: string
  entityId: string
  details: string
  timestamp: string
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'APPROVED' | 'REJECTED'

export interface Lead {
  id: string
  companyType: string
  businessName: string
  cnpj: string
  managerName: string
  email: string
  whatsapp: string
  location: string
  unitsPerMonth: string
  plan: string
  status: LeadStatus
  createdAt: string
}

export type DocumentCategory =
  | 'Projetos'
  | 'Habite-se'
  | 'ART'
  | 'Manuais'
  | 'Garantias'
  | 'Vistorias'

export type DocumentVisibility = 'INTERNAL' | 'SHARED' | 'PUBLIC'

export interface ProjectDocument {
  id: string
  projectId: string
  unitId?: string // Optional link to unit
  name: string // Display name / Title
  description?: string
  category: DocumentCategory
  version: number
  tags: string[]
  visibility: DocumentVisibility
  isVisibleToOwners: boolean // Legacy/Helper for UI
  url: string // Current version URL
  createdAt: string
  createdBy: string
  size: string
  type: string
}

export interface DocumentVersion {
  id: string
  documentId: string
  versionNumber: number
  filePath: string
  fileName: string
  fileSize: number
  fileType: string
  createdAt: string
  createdBy: string
}

export interface DocumentLog {
  id: string
  documentId: string
  action: 'UPLOAD' | 'VIEW' | 'DOWNLOAD' | 'PERMISSION_CHANGE' | 'NEW_VERSION'
  userId: string
  userName: string
  timestamp: string
  details?: string
}

export interface WarrantyCategory {
  id: string
  tenantId: string
  name: string
  termMonths: number
  description?: string
  createdAt: string
  updatedAt: string
}

export type WarrantyStatus = 'Vigente' | 'Expirada' | 'Suspensa'

export interface UnitWarranty {
  id: string
  unitId: string
  categoryId: string
  startDate: string
  expirationDate: string
  status: WarrantyStatus
  notes?: string
  categoryName?: string // Helper for UI display join
  createdAt: string
}
