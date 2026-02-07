import { useState, useEffect } from 'react'
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
import { Eye, Pencil, Trash2, FileText, Plus, Loader2 } from 'lucide-react'
import { ViewUnitDialog } from './ViewUnitDialog'
import { EditUnitDialog } from './EditUnitDialog'
import { DeleteUnitDialog } from './DeleteUnitDialog'
import { CreateUnitDialog } from './CreateUnitDialog'
import { UnitDocumentManagerDialog } from '@/components/documents/UnitDocumentManagerDialog'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { unitService } from '@/services/unitService'

interface UnitListProps {
  projectId: string
}

export function UnitList({ projectId }: UnitListProps) {
  const { toast } = useToast()

  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)

  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [viewUnit, setViewUnit] = useState<Unit | null>(null)
  const [editUnit, setEditUnit] = useState<Unit | null>(null)
  const [deleteUnitItem, setDeleteUnitItem] = useState<Unit | null>(null)
  const [createUnitOpen, setCreateUnitOpen] = useState(false)
  const [docsUnit, setDocsUnit] = useState<Unit | null>(null)

  const loadUnits = async () => {
    setLoading(true)
    try {
      const data = await unitService.getUnits(projectId)
      setUnits(data)
    } catch (error) {
      console.error('Failed to load units:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar as unidades.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUnits()
  }, [projectId])

  const filteredUnits =
    filterStatus === 'ALL'
      ? units
      : units.filter((u) => u.status === filterStatus)

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

  const handleCreateUnit = async (newUnit: Omit<Unit, 'id' | 'ownerId'>) => {
    try {
      await unitService.createUnit(newUnit)
      await loadUnits()
      toast({
        title: 'Sucesso',
        description: 'Nova unidade criada com sucesso.',
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao criar unidade.',
      })
      throw error // Re-throw to let the dialog know (if it handled loading state)
    }
  }

  const handleUpdateUnit = async (updatedUnit: Unit) => {
    try {
      await unitService.updateUnit(updatedUnit)
      setUnits((prev) =>
        prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u)),
      )
      toast({
        title: 'Unidade atualizada',
        description: `A unidade ${updatedUnit.number} foi atualizada com sucesso.`,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao atualizar unidade.',
      })
    }
  }

  const handleDeleteUnit = async () => {
    if (deleteUnitItem) {
      try {
        await unitService.deleteUnit(deleteUnitItem.id)
        setUnits((prev) => prev.filter((u) => u.id !== deleteUnitItem.id))
        setDeleteUnitItem(null)
        toast({
          title: 'Unidade excluída',
          description: 'A unidade foi removida do sistema.',
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao excluir unidade.',
        })
      }
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
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold">{units.length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {units.filter((u) => u.status === 'AVAILABLE').length}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Vendidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-slate-700">
                {units.filter((u) => u.status === 'SOLD').length}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Units Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Inventário</CardTitle>
          <div className="flex gap-2">
            <div className="w-[150px]">
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
            <Button onClick={() => setCreateUnitOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nova Unidade
            </Button>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />{' '}
                      Carregando unidades...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUnits.length === 0 ? (
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
      <CreateUnitDialog
        open={createUnitOpen}
        onOpenChange={setCreateUnitOpen}
        projectId={projectId}
        onSave={handleCreateUnit}
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
