import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Unit } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Eye, Pencil, Trash2, FileText } from 'lucide-react'
import { ViewUnitDialog } from './ViewUnitDialog'
import { EditUnitDialog } from './EditUnitDialog'
import { DeleteUnitDialog } from './DeleteUnitDialog'
import { UnitDocumentManagerDialog } from '@/components/documents/UnitDocumentManagerDialog'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface UnitListProps {
  projectId: string
}

export function UnitList({ projectId }: UnitListProps) {
  const { projects, units, updateUnit, deleteUnit } = useAppStore()
  const { toast } = useToast()

  const project = projects.find((p) => p.id === projectId)
  const projectUnits = units.filter((u) => u.projectId === projectId)

  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [viewUnit, setViewUnit] = useState<Unit | null>(null)
  const [editUnit, setEditUnit] = useState<Unit | null>(null)
  const [deleteUnitItem, setDeleteUnitItem] = useState<Unit | null>(null)
  const [docsUnit, setDocsUnit] = useState<Unit | null>(null)

  if (!project) return null

  const filteredUnits =
    filterStatus === 'ALL'
      ? projectUnits
      : projectUnits.filter((u) => u.status === filterStatus)

  const statusColors = {
    AVAILABLE: 'bg-green-100 text-green-700 border-green-200',
    RESERVED: 'bg-amber-100 text-amber-700 border-amber-200',
    SOLD: 'bg-slate-100 text-slate-700 border-slate-200',
    DELIVERED: 'bg-blue-100 text-blue-700 border-blue-200',
  }

  const statusLabels = {
    AVAILABLE: 'Disponível',
    RESERVED: 'Reservado',
    SOLD: 'Vendido',
    DELIVERED: 'Entregue',
  }

  const handleUpdateUnit = (updatedUnit: Unit) => {
    updateUnit(updatedUnit)
    toast({
      title: 'Unidade atualizada',
      description: `A unidade ${updatedUnit.number} foi atualizada com sucesso.`,
    })
  }

  const handleDeleteUnit = () => {
    if (deleteUnitItem) {
      deleteUnit(deleteUnitItem.id)
      setDeleteUnitItem(null)
      toast({
        title: 'Unidade excluída',
        description: 'A unidade foi removida do sistema.',
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total de Unidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.totalUnits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {projectUnits.filter((u) => u.status === 'AVAILABLE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Vendidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">
              {projectUnits.filter((u) => u.status === 'SOLD').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Units Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Inventário</CardTitle>
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
                <SelectItem value="DELIVERED">Entregue</SelectItem>
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
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    Nenhuma unidade encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit) => (
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
                          'pointer-events-none font-normal shadow-none',
                          statusColors[unit.status],
                        )}
                      >
                        {statusLabels[unit.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-slate-50"
                          onClick={() => setDocsUnit(unit)}
                          title="Documentos"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => setViewUnit(unit)}
                          title="Detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => setEditUnit(unit)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteUnitItem(unit)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewUnitDialog
        open={!!viewUnit}
        onOpenChange={(open) => !open && setViewUnit(null)}
        unit={viewUnit}
      />
      <EditUnitDialog
        open={!!editUnit}
        onOpenChange={(open) => !open && setEditUnit(null)}
        unit={editUnit}
        onSave={handleUpdateUnit}
      />
      <DeleteUnitDialog
        open={!!deleteUnitItem}
        onOpenChange={(open) => !open && setDeleteUnitItem(null)}
        unit={deleteUnitItem}
        onConfirm={handleDeleteUnit}
      />
      <UnitDocumentManagerDialog
        open={!!docsUnit}
        onOpenChange={(open) => !open && setDocsUnit(null)}
        unit={docsUnit}
        projectId={projectId}
      />
    </div>
  )
}
