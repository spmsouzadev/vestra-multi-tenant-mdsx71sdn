import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  MapPin,
  Calendar,
  HardHat,
  Plus,
  AlertTriangle,
  CheckCircle,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ProjectStatus, ProjectPhase } from '@/types'

export default function Projects() {
  const { getFilteredProjects } = useAppStore()
  const projects = getFilteredProjects()

  const [filterPhase, setFilterPhase] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterCity, setFilterCity] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  // Extract unique cities
  const cities = Array.from(new Set(projects.map((p) => p.city)))

  const filteredProjects = projects.filter((p) => {
    const matchesPhase = filterPhase === 'ALL' || p.phase === filterPhase
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus
    const matchesCity = filterCity === 'ALL' || p.city === filterCity
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manager.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesPhase && matchesStatus && matchesCity && matchesSearch
  })

  const getPhaseLabel = (phase: ProjectPhase) => {
    switch (phase) {
      case 'PRE_SALES':
        return 'Pré-venda'
      case 'EXECUTION':
        return 'Execução'
      case 'DELIVERY':
        return 'Entrega'
      case 'POST_DELIVERY':
        return 'Pós-entrega'
      default:
        return phase
    }
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-100 text-blue-700'
      case 'CONSTRUCTION':
        return 'bg-amber-100 text-amber-700'
      case 'DELIVERED':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Gestão de Empreendimentos
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso e indicadores de todas as obras
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Novo Projeto
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar projeto ou responsável..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterPhase} onValueChange={setFilterPhase}>
              <SelectTrigger>
                <SelectValue placeholder="Fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas as Fases</SelectItem>
                <SelectItem value="PRE_SALES">Pré-venda</SelectItem>
                <SelectItem value="EXECUTION">Execução</SelectItem>
                <SelectItem value="DELIVERY">Entrega</SelectItem>
                <SelectItem value="POST_DELIVERY">Pós-entrega</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger>
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas as Cidades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os Status</SelectItem>
                <SelectItem value="PLANNING">Planejamento</SelectItem>
                <SelectItem value="CONSTRUCTION">Em Obra</SelectItem>
                <SelectItem value="DELIVERED">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-64 h-48 md:h-auto bg-slate-100 relative shrink-0">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge
                    className={cn(
                      'border-0 shadow-sm',
                      getStatusColor(project.status),
                    )}
                  >
                    {project.status === 'CONSTRUCTION'
                      ? 'Em Obra'
                      : project.status === 'PLANNING'
                        ? 'Planejamento'
                        : 'Entregue'}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" /> {project.city}/
                        {project.state}
                        <span className="text-slate-300">|</span>
                        <span>Resp: {project.manager}</span>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <Link to={`/projects/${project.id}`}>Ver Detalhes</Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Fase Atual
                      </p>
                      <p className="font-medium text-slate-900">
                        {getPhaseLabel(project.phase)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Progresso
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-2.5 max-w-[100px]">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{
                              width: `${project.completionPercentage}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {project.completionPercentage}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Unidades
                      </p>
                      <p className="font-medium text-slate-900">
                        {project.deliveredUnits} / {project.totalUnits}{' '}
                        Entregues
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Pendências
                      </p>
                      <div className="flex items-center gap-1 font-medium text-amber-600">
                        {project.openIssues > 0 ? (
                          <>
                            <AlertTriangle className="h-4 w-4" />
                            {project.openIssues} Abertas
                          </>
                        ) : (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" /> Nenhuma
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
