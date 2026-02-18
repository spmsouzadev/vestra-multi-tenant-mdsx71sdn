import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tenantService } from '@/services/tenantService'
import { Tenant, Project, Owner } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Building2,
  Users,
  HardHat,
  Database,
  CreditCard,
  Mail,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export default function TenantDetails() {
  const { id } = useParams<{ id: string }>()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [owners, setOwners] = useState<Owner[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!id) return

    const loadData = async () => {
      setLoading(true)
      try {
        const [t, p, o, s] = await Promise.all([
          tenantService.getTenantById(id),
          tenantService.getTenantProjects(id),
          tenantService.getTenantOwners(id),
          tenantService.getTenantStats(id),
        ])
        setTenant(t)
        setProjects(p)
        setOwners(o)
        setStats(s)
      } catch (error) {
        console.error(error)
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar os detalhes da construtora.',
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, toast])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Construtora não encontrada</h1>
        <Button asChild>
          <Link to="/tenants">Voltar para a lista</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/tenants">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {tenant.logoUrl && (
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                className="h-12 w-12 rounded object-contain bg-slate-100 p-1"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {tenant.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">{tenant.cnpj}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {tenant.adminEmail || 'N/A'}
                </span>
              </div>
            </div>
            <Badge
              className={`ml-auto text-lg ${
                tenant.status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {tenant.status === 'ACTIVE' ? 'Ativo' : 'Suspenso'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos</CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.project_count || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unit_count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proprietários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{owners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats?.storage_used || 0) / (1024 * 1024)).toFixed(2)} MB
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos/Empreendimentos</TabsTrigger>
          <TabsTrigger value="owners">Proprietários</TabsTrigger>
          <TabsTrigger value="financial">Plano e Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Razão Social
                  </label>
                  <p>{tenant.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    CNPJ
                  </label>
                  <p>{tenant.cnpj}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Administrativo
                  </label>
                  <p>{tenant.adminEmail || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Data de Cadastro
                  </label>
                  <p>
                    {tenant.createdAt
                      ? format(new Date(tenant.createdAt), 'dd/MM/yyyy')
                      : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Cor Primária
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: tenant.primaryColor }}
                    />
                    <span>{tenant.primaryColor}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Empreendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Fase</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Unidades</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        Nenhum projeto encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>
                          {p.city}/{p.state}
                        </TableCell>
                        <TableCell>{p.phase}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{p.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {p.totalUnits}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="owners">
          <Card>
            <CardHeader>
              <CardTitle>Base de Proprietários</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Documento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        Nenhum proprietário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    owners.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.name}</TableCell>
                        <TableCell>{o.email}</TableCell>
                        <TableCell>{o.document || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Assinatura e Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Plano Atual</h3>
                  </div>
                  <p className="text-xl font-bold">{tenant.plan || 'Free'}</p>
                  <Badge variant="secondary" className="mt-2">
                    {tenant.subscriptionStatus || 'Active'}
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Uso de Armazenamento</h3>
                  </div>
                  <p className="text-xl font-bold">
                    {((stats?.storage_used || 0) / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    de 10 GB permitidos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
