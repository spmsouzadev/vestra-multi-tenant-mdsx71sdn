import { useParams } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { ArrowLeft, Upload, FileDown, Edit2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function ProjectDetails() {
  const { projectId } = useParams()
  const { projects, units, updateUnitStatus } = useAppStore()

  const project = projects.find((p) => p.id === projectId)
  const projectUnits = units.filter((u) => u.projectId === projectId)

  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  if (!project) return <div>Projeto não encontrado</div>

  const filteredUnits =
    filterStatus === 'ALL'
      ? projectUnits
      : projectUnits.filter((u) => u.status === filterStatus)

  const statusColors = {
    AVAILABLE:
      'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
    RESERVED: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100',
    SOLD: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100',
  }

  const statusLabels = {
    AVAILABLE: 'Disponível',
    RESERVED: 'Reservado',
    SOLD: 'Vendido',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-muted-foreground">Gestão de Inventário</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button variant="secondary">
            <Upload className="mr-2 h-4 w-4" /> Importar CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Unidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.totalUnits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              VGV Estimado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.5 Mi</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Percentual Vendido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (projectUnits.filter((u) => u.status === 'SOLD').length /
                  projectUnits.length) *
                  100,
              )}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Inventário de Unidades</CardTitle>
          <div className="w-[200px]">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="AVAILABLE">Disponível</SelectItem>
                <SelectItem value="RESERVED">Reservado</SelectItem>
                <SelectItem value="SOLD">Vendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Unidade</TableHead>
                <TableHead>Bloco</TableHead>
                <TableHead>Tipologia</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="pl-6 font-medium">
                    {unit.number}
                  </TableCell>
                  <TableCell>{unit.block}</TableCell>
                  <TableCell>{unit.typology}</TableCell>
                  <TableCell>{unit.area} m²</TableCell>
                  <TableCell>R$ {unit.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'pointer-events-none font-normal',
                        statusColors[unit.status],
                      )}
                    >
                      {statusLabels[unit.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownAction
                      unit={unit}
                      updateStatus={updateUnitStatus}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function DropdownAction({
  unit,
  updateStatus,
}: {
  unit: any
  updateStatus: any
}) {
  return (
    <Select
      defaultValue={unit.status}
      onValueChange={(val) => updateStatus(unit.id, val)}
    >
      <SelectTrigger className="h-8 w-[130px] ml-auto">
        <SelectValue placeholder="Alterar Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="AVAILABLE">Disponibilizar</SelectItem>
        <SelectItem value="RESERVED">Reservar</SelectItem>
        <SelectItem value="SOLD">Vender</SelectItem>
      </SelectContent>
    </Select>
  )
}
