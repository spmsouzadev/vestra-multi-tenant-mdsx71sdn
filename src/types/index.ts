export type Role = 'MASTER' | 'ADMIN' | 'OWNER'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
  tenantId?: string // If null, Master Admin has access to all
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
}

export interface Project {
  id: string
  tenantId: string
  name: string
  address: string
  totalUnits: number
  completionPercentage: number
  deliveryDate: string
  status: 'PLANNING' | 'CONSTRUCTION' | 'DELIVERED'
  imageUrl?: string
}

export interface Unit {
  id: string
  projectId: string
  block: string
  number: string
  typology: string
  area: number
  price: number
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD'
  ownerId?: string
}

export interface Owner {
  id: string
  name: string
  email: string
  phone: string
  document: string
  unitsOwned: string[] // Unit IDs
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
