import useAppStore from '@/stores/useAppStore'
import { StatCard } from '@/components/StatCard'
import {
  Building2,
  Users,
  HardHat,
  TrendingUp,
  AlertTriangle,
  FileCheck,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'

export default function Dashboard() {
  const { user, tenants, projects, units, auditLogs } = useAppStore()

  if (!user) return null

  // Master Dashboard
  if (user.role === 'MASTER') {
    const totalRevenue = 1250000
    const activeProjects = projects.filter(
      (p) => p.status === 'CONSTRUCTION',
    ).length

    const chartData = [
      { month: 'Jan', tenants: 12 },
      { month: 'Fev', tenants: 15 },
      { month: 'Mar', tenants: 18 },
      { month: 'Abr', tenants: 22 },
      { month: 'Mai', tenants: 28 },
      { month: 'Jun', tenants: 35 },
    ]

    const chartConfig = {
      tenants: {
        label: 'Tenants',
        color: 'hsl(var(--chart-1))',
      },
    }

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Master</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Construtoras"
            value={tenants.length}
            icon={Building2}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Projetos Ativos"
            value={activeProjects}
            icon={HardHat}
          />
          <StatCard
            title="Receita Mensal (Mock)"
            value={`R$ ${totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Saúde da Plataforma"
            value="99.9%"
            icon={TrendingUp}
            className="border-l-4 border-l-green-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Crescimento de Clientes</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="tenants"
                    fill="var(--color-tenants)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas ações na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 text-sm border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="min-w-fit font-medium text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {log.action} - {log.entityType}
                      </p>
                      <p className="text-muted-foreground">{log.details}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {log.userName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  if (user.role === 'ADMIN') {
    const myProjects = projects.filter((p) => p.tenantId === user.tenantId)
    const myUnits = units.filter((u) =>
      myProjects.some((p) => p.id === u.projectId),
    )
    const soldUnits = myUnits.filter((u) => u.status === 'SOLD').length
    const availableUnits = myUnits.filter(
      (u) => u.status === 'AVAILABLE',
    ).length

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard Construtora
        </h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Meus Projetos"
            value={myProjects.length}
            icon={Building2}
          />
          <StatCard
            title="Unidades Vendidas"
            value={soldUnits}
            icon={FileCheck}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Unidades Disponíveis"
            value={availableUnits}
            icon={HardHat}
          />
          <StatCard
            title="Pendências Técnicas"
            value={3}
            icon={AlertTriangle}
            className="border-l-4 border-l-amber-500"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden group">
              <div className="relative h-48">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-3xl font-bold">
                      {project.completionPercentage}%
                    </div>
                    <div className="text-sm font-medium">Concluído</div>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entrega:</span>
                  <span className="font-medium">
                    {new Date(project.deliveryDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Owner Dashboard
  if (user.role === 'OWNER') {
    // For simplicity, showing static data or mocked linked units
    const myUnits = units.filter((u) => u.ownerId === user.id) // Assuming simple link or using mockOwners logic

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-slate-900">Meu Painel</h1>
        {myUnits.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium">Nenhuma unidade encontrada</h3>
            <p className="text-muted-foreground">
              Entre em contato com a construtora.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {myUnits.map((unit) => {
              const project = projects.find((p) => p.id === unit.projectId)
              return (
                <Card key={unit.id} className="overflow-hidden">
                  <div className="h-40 bg-slate-100 relative">
                    {project?.imageUrl && (
                      <img
                        src={project.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <Badge className="absolute top-4 right-4 bg-green-600">
                      Em dia
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>
                      {project?.name} - Unidade {unit.number}
                    </CardTitle>
                    <CardDescription>{project?.address}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fase da Obra</span>
                        <span className="font-bold">
                          {project?.completionPercentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${project?.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 bg-slate-50 rounded text-center cursor-pointer hover:bg-slate-100 transition-colors">
                        <FileCheck className="mx-auto h-6 w-6 text-slate-700 mb-2" />
                        <div className="text-sm font-medium">Contrato</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded text-center cursor-pointer hover:bg-slate-100 transition-colors">
                        <TrendingUp className="mx-auto h-6 w-6 text-slate-700 mb-2" />
                        <div className="text-sm font-medium">Financeiro</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Comunicados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r text-blue-900 text-sm">
              <strong>Aviso Importante:</strong> A reunião de condomínio será
              realizada no dia 25/05 às 19h no salão de festas.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <div>Role not recognized</div>
}
