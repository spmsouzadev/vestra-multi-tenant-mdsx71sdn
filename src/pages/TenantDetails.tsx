import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tenantService } from '@/services/tenantService'
import { Tenant, Project, Owner, BillingRecord } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
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
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function TenantDetails() {
  const { id } = useParams<{ id: string }>()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [owners, setOwners] = useState<Owner[]>([])
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!id) return

    const loadData = async () => {
      setLoading(true)
      try {
        const [t, p, o, s, b] = await Promise.all([
          tenantService.getTenantById(id),
          tenantService.getTenantProjects(id),
          tenantService.getTenantOwners(id),
          tenantService.getTenantStats(id),
          tenantService.getBillingHistory(id),
        ])
        setTenant(t)
        setProjects(p)
        setOwners(o)
        setStats(s)
        setBillingHistory(b)
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
    <div className="space-y-6 animate-fade-in">
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
                  <Mail className="h-3 w-3" />{' '}
                  {tenant.adminEmail || 'Email não configurado'}
                </span>
                {tenant.phone && (
                  <>
                    <span>•</span>
                    <span>{tenant.phone}</span>
                  </>
                )}
              </div>
            </div>
            <div className="ml-auto flex flex-col items-end gap-1">
              <Badge
                className={`text-sm ${
                  tenant.status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {tenant.status === 'ACTIVE' ? 'Ativo' : 'Suspenso'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                ID: {tenant.id.slice(0, 8)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Ativos
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">
              Unidades Gerenciadas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unit_count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Proprietários Cadastrados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{owners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Armazenamento Usado
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats?.storage_used || 0) / (1024 * 1024)).toFixed(2)} MB
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              de 50 GB contratados
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="owners">Proprietários</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Informações Corporativas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Razão Social
                    </label>
                    <p className="font-medium text-slate-900">{tenant.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      CNPJ
                    </label>
                    <p className="font-medium text-slate-900">{tenant.cnpj}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Administrativo
                    </label>
                    <p className="font-medium text-slate-900">
                      {tenant.adminEmail || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Telefone
                    </label>
                    <p className="font-medium text-slate-900">
                      {tenant.phone || '-'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Data de Cadastro
                    </label>
                    <p className="font-medium text-slate-900">
                      {tenant.createdAt
                        ? format(new Date(tenant.createdAt), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Cor da Marca
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="h-6 w-6 rounded-full border shadow-sm"
                        style={{ backgroundColor: tenant.primaryColor }}
                      />
                      <span className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded">
                        {tenant.primaryColor}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Plano Vigente
                    </label>
                    <p className="font-medium text-slate-900">
                      {tenant.plan || 'Standard'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Empreendimentos ({projects.length})</CardTitle>
              <CardDescription>
                Lista de projetos imobiliários gerenciados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Localização</TableHead>
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
                        className="text-center text-muted-foreground py-8"
                      >
                        Nenhum projeto encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">
                          <Link
                            to={`/projects/${p.id}`}
                            className="hover:underline text-primary"
                          >
                            {p.name}
                          </Link>
                        </TableCell>
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
              <CardTitle>Base de Proprietários ({owners.length})</CardTitle>
              <CardDescription>
                Clientes finais vinculados aos projetos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Telefone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground py-8"
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
                        <TableCell>{o.phone || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assinatura</CardTitle>
                <CardDescription>Detalhes do plano contratado.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Plano Atual</h3>
                      </div>
                      <p className="text-2xl font-bold">
                        {tenant.plan || 'Free'}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="self-start mt-2 bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />{' '}
                      {tenant.subscriptionStatus || 'Ativo'}
                    </Badge>
                  </div>

                  <div className="p-4 border rounded-lg bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Ciclo de Faturamento</h3>
                      </div>
                      <p className="text-lg font-medium">Mensal</p>
                      <p className="text-sm text-muted-foreground">
                        Próxima cobrança: 01/06/2025
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Armazenamento</h3>
                      </div>
                      <p className="text-2xl font-bold">
                        {((stats?.storage_used || 0) / (1024 * 1024)).toFixed(
                          2,
                        )}{' '}
                        MB
                      </p>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: '5%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        5% utilizado
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Cobranças</CardTitle>
                <CardDescription>Últimas faturas geradas.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data de Vencimento</TableHead>
                      <TableHead>Fatura</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingHistory.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground"
                        >
                          Nenhuma fatura encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      billingHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {format(new Date(item.dueDate), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell className="font-mono">
                            {item.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            R$ {item.amount.toFixed(2).replace('.', ',')}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                item.status === 'PAID'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : item.status === 'PENDING'
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                              }
                            >
                              {item.status === 'PAID'
                                ? 'Pago'
                                : item.status === 'PENDING'
                                  ? 'Pendente'
                                  : 'Atrasado'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" disabled>
                              <Download className="mr-2 h-4 w-4" /> PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
