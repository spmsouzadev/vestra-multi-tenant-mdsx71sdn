import {
  Tenant,
  Project,
  Unit,
  Owner,
  AuditLog,
  User,
  Lead,
  ProjectDocument,
  DocumentLog,
} from '@/types'
import { subDays, subMonths } from 'date-fns'

// UUID Constants for consistency
const T1_ID = 'a1111111-1111-4111-a111-111111111111'
const T2_ID = 'a2222222-2222-4222-a222-222222222222'
const T3_ID = 'a3333333-3333-4333-a333-333333333333'

const P1_ID = 'b1111111-1111-4111-b111-111111111111'
const P2_ID = 'b2222222-2222-4222-b222-222222222222'
const P3_ID = 'b3333333-3333-4333-b333-333333333333'

const O1_ID = 'c1111111-1111-4111-c111-111111111111'
const O2_ID = 'c2222222-2222-4222-c222-222222222222'

const U1_ID = 'f1111111-1111-4111-f111-111111111111'
const U2_ID = 'f2222222-2222-4222-f222-222222222222'
const U3_ID = 'f3333333-3333-4333-f333-333333333333'

export const mockUsers: User[] = [
  {
    id: U1_ID,
    name: 'Carlos Master',
    email: 'carlos@platform.com',
    role: 'MASTER',
    avatarUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
  },
  {
    id: U2_ID,
    name: 'Ana Construtora',
    email: 'ana@const1.com',
    role: 'ADMIN',
    tenantId: T1_ID,
    avatarUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=2',
  },
  {
    id: U3_ID,
    name: 'Roberto Proprietário',
    email: 'roberto@gmail.com',
    role: 'OWNER',
    avatarUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=3',
  },
]

export const mockTenants: Tenant[] = [
  {
    id: T1_ID,
    name: 'Alpha Construções',
    cnpj: '12.345.678/0001-90',
    status: 'ACTIVE',
    createdAt: '2025-01-10',
    projectCount: 2,
    logoUrl: 'https://img.usecurling.com/i?q=building&color=blue',
    primaryColor: '#2563EB',
  },
  {
    id: T2_ID,
    name: 'Beta Incorporadora',
    cnpj: '98.765.432/0001-10',
    status: 'ACTIVE',
    createdAt: '2025-02-15',
    projectCount: 1,
    logoUrl: 'https://img.usecurling.com/i?q=crane&color=orange',
    primaryColor: '#EAB308',
  },
  {
    id: T3_ID,
    name: 'Gamma Engenharia',
    cnpj: '45.123.789/0001-55',
    status: 'SUSPENDED',
    createdAt: '2025-03-01',
    projectCount: 0,
    logoUrl: 'https://img.usecurling.com/i?q=helmet&color=gray',
    primaryColor: '#64748B',
  },
]

export const mockProjects: Project[] = [
  {
    id: P1_ID,
    tenantId: T1_ID,
    name: 'Residencial Horizonte',
    city: 'São Paulo',
    state: 'SP',
    manager: 'Eng. Ricardo Silva',
    address: 'Av. Paulista, 1000, São Paulo',
    totalUnits: 40,
    deliveredUnits: 0,
    openIssues: 5,
    completionPercentage: 75,
    deliveryDate: '2026-12-01',
    status: 'CONSTRUCTION',
    phase: 'EXECUTION',
    imageUrl:
      'https://img.usecurling.com/p/400/300?q=modern%20apartment%20building',
  },
  {
    id: P2_ID,
    tenantId: T1_ID,
    name: 'Torre Crystal',
    city: 'São Paulo',
    state: 'SP',
    manager: 'Arq. Julia Santos',
    address: 'Rua Oscar Freire, 500, São Paulo',
    totalUnits: 20,
    deliveredUnits: 0,
    openIssues: 0,
    completionPercentage: 10,
    deliveryDate: '2027-06-01',
    status: 'PLANNING',
    phase: 'PRE_SALES',
    imageUrl: 'https://img.usecurling.com/p/400/300?q=luxury%20condo',
  },
  {
    id: P3_ID,
    tenantId: T2_ID,
    name: 'Vila Verde',
    city: 'Campinas',
    state: 'SP',
    manager: 'Eng. Pedro Costa',
    address: 'Rua das Flores, 20, Campinas',
    totalUnits: 100,
    deliveredUnits: 100,
    openIssues: 2,
    completionPercentage: 100,
    deliveryDate: '2025-10-01',
    status: 'DELIVERED',
    phase: 'POST_DELIVERY',
    imageUrl: 'https://img.usecurling.com/p/400/300?q=suburban%20houses',
  },
]

export const mockUnits: Unit[] = [
  // Project 1 Units
  {
    id: 'd1111111-1111-4111-d111-111111111111',
    projectId: P1_ID,
    block: 'A',
    number: '101',
    floor: '1º',
    bedrooms: 2,
    bathrooms: 1,
    typology: '2D',
    area: 65,
    price: 450000,
    status: 'SOLD',
    ownerId: O1_ID,
  },
  {
    id: 'd2222222-2222-4222-d222-222222222222',
    projectId: P1_ID,
    block: 'A',
    number: '102',
    floor: '1º',
    bedrooms: 2,
    bathrooms: 1,
    typology: '2D',
    area: 65,
    price: 450000,
    status: 'AVAILABLE',
  },
  {
    id: 'd3333333-3333-4333-d333-333333333333',
    projectId: P1_ID,
    block: 'A',
    number: '103',
    floor: '1º',
    bedrooms: 3,
    bathrooms: 2,
    typology: '3D',
    area: 85,
    price: 650000,
    status: 'RESERVED',
  },
  {
    id: 'd4444444-4444-4444-d444-444444444444',
    projectId: P1_ID,
    block: 'B',
    number: '201',
    floor: '2º',
    bedrooms: 2,
    bathrooms: 1,
    typology: '2D',
    area: 65,
    price: 460000,
    status: 'AVAILABLE',
  },
  {
    id: 'd5555555-5555-5555-d555-555555555555',
    projectId: P1_ID,
    block: 'B',
    number: '202',
    floor: '2º',
    bedrooms: 1,
    bathrooms: 1,
    typology: 'Studio',
    area: 40,
    price: 300000,
    status: 'SOLD',
    ownerId: O2_ID,
  },
  // Project 2 Units
  {
    id: 'd6666666-6666-6666-d666-666666666666',
    projectId: P2_ID,
    block: 'Unico',
    number: '10',
    floor: '10º',
    bedrooms: 4,
    bathrooms: 3,
    typology: '4D',
    area: 150,
    price: 1500000,
    status: 'AVAILABLE',
  },
  {
    id: 'd7777777-7777-7777-d777-777777777777',
    projectId: P2_ID,
    block: 'Unico',
    number: '11',
    floor: '11º',
    bedrooms: 4,
    bathrooms: 3,
    typology: '4D',
    area: 150,
    price: 1550000,
    status: 'AVAILABLE',
  },
]

export const mockOwners: Owner[] = [
  {
    id: O1_ID,
    name: 'Roberto Proprietário',
    email: 'roberto@gmail.com',
    phone: '(11) 99999-9999',
    document: '123.456.789-00',
    unitsOwned: ['d1111111-1111-4111-d111-111111111111'],
  },
  {
    id: O2_ID,
    name: 'Fernanda Lima',
    email: 'fernanda@gmail.com',
    phone: '(11) 98888-8888',
    document: '321.654.987-00',
    unitsOwned: ['d5555555-5555-5555-d555-555555555555'],
  },
]

export const mockAuditLogs: AuditLog[] = [
  {
    id: '11111111-1111-4111-1111-111111111111',
    userId: U1_ID,
    userName: 'Carlos Master',
    action: 'CREATE',
    entityType: 'TENANT',
    entityId: T1_ID,
    details: 'Created tenant Alpha Construções',
    timestamp: subDays(new Date(), 2).toISOString(),
  },
  {
    id: '22222222-2222-4222-2222-222222222222',
    userId: U2_ID,
    userName: 'Ana Construtora',
    action: 'UPDATE',
    entityType: 'UNIT',
    entityId: 'd1111111-1111-4111-d111-111111111111',
    details: 'Status changed from AVAILABLE to SOLD',
    timestamp: subDays(new Date(), 1).toISOString(),
  },
  {
    id: '33333333-3333-4333-3333-333333333333',
    userId: U2_ID,
    userName: 'Ana Construtora',
    action: 'UPDATE',
    entityType: 'PROJECT',
    entityId: P1_ID,
    details: 'Completion updated to 75%',
    timestamp: new Date().toISOString(),
  },
]

export const mockLeads: Lead[] = [
  {
    id: 'g1111111-1111-4111-g111-111111111111',
    companyType: 'construtora',
    businessName: 'Delta Construções',
    cnpj: '55.444.333/0001-22',
    managerName: 'José da Silva',
    email: 'jose@deltaconst.com.br',
    whatsapp: '(11) 98765-4321',
    location: 'São Paulo - SP',
    unitsPerMonth: '51-200',
    plan: 'pro',
    status: 'NEW',
    createdAt: subDays(new Date(), 3).toISOString(),
  },
]

export const mockDocuments: ProjectDocument[] = [
  {
    id: 'e1111111-1111-4111-e111-111111111111',
    projectId: P1_ID,
    name: 'Planta Baixa - Bloco A.pdf',
    category: 'Projetos',
    version: 1,
    tags: ['arquitetura', 'bloco A'],
    isVisibleToOwners: true,
    url: '#',
    createdAt: subMonths(new Date(), 2).toISOString(),
    createdBy: 'Ana Construtora',
    size: '2.4 MB',
    type: 'pdf',
  },
  {
    id: 'e2222222-2222-4222-e222-222222222222',
    projectId: P1_ID,
    name: 'Alvará de Construção.pdf',
    category: 'Habite-se',
    version: 1,
    tags: ['legal', 'prefeitura'],
    isVisibleToOwners: false,
    url: '#',
    createdAt: subMonths(new Date(), 5).toISOString(),
    createdBy: 'Ana Construtora',
    size: '1.1 MB',
    type: 'pdf',
  },
  {
    id: 'e3333333-3333-4333-e333-333333333333',
    projectId: P1_ID,
    name: 'Manual do Proprietário.pdf',
    category: 'Manuais',
    version: 2,
    tags: ['entrega', 'manual'],
    isVisibleToOwners: true,
    url: '#',
    createdAt: subDays(new Date(), 10).toISOString(),
    createdBy: 'Ana Construtora',
    size: '5.6 MB',
    type: 'pdf',
  },
]

export const mockDocumentLogs: DocumentLog[] = [
  {
    id: 'dl1',
    documentId: 'e1111111-1111-4111-e111-111111111111',
    action: 'UPLOAD',
    userId: U2_ID,
    userName: 'Ana Construtora',
    timestamp: subMonths(new Date(), 2).toISOString(),
    details: 'Initial upload',
  },
  {
    id: 'dl2',
    documentId: 'e1111111-1111-4111-e111-111111111111',
    action: 'VIEW',
    userId: U1_ID,
    userName: 'Carlos Master',
    timestamp: subDays(new Date(), 15).toISOString(),
  },
]
