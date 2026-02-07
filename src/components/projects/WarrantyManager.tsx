import { useState, useEffect } from 'react'
import { Unit } from '@/types'
import { warrantyService } from '@/services/warrantyService'
import { UnitWarrantyDialog } from './UnitWarrantyDialog'
import { UnitWarrantyList } from './UnitWarrantyList'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Search, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { unitService } from '@/services/unitService'
import { isPast, parseISO } from 'date-fns'

interface WarrantyManagerProps {
  projectId: string
}

export function WarrantyManager({ projectId }: WarrantyManagerProps) {
  const [units, setUnits] = useState<Unit[]>([])
  const [warrantiesSummary, setWarrantiesSummary] = useState<
    Record<
      string,
      { configured: boolean; expiredCount: number; activeCount: number }
    >
  >({})
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [viewUnit, setViewUnit] = useState<Unit | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const unitsData = await unitService.getUnits(projectId)
      setUnits(unitsData)

      // Fetch warranty summary for all units
      // We'll fetch all warranties for these units to build summary
      const allWarranties = await warrantyService.getProjectWarranties(
        unitsData.map((u) => u.id),
      )

      const summary: any = {}
      unitsData.forEach((u) => {
        const unitWarranties = allWarranties.filter((w) => w.unitId === u.id)
        const expired = unitWarranties.filter(
          (w) => isPast(parseISO(w.expirationDate)) && w.status !== 'Suspensa',
        ).length
        const active = unitWarranties.filter(
          (w) => !isPast(parseISO(w.expirationDate)) && w.status !== 'Suspensa',
        ).length

        summary[u.id] = {
          configured: unitWarranties.length > 0,
          expiredCount: expired,
          activeCount: active,
        }
      })
      setWarrantiesSummary(summary)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [projectId])

  const filteredUnits = units.filter(
    (u) =>
      u.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.block.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Unidades Configuradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                Object.values(warrantiesSummary).filter((s) => s.configured)
                  .length
              }{' '}
              / {units.length}
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Garantias Vigentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Object.values(warrantiesSummary).reduce(
                (acc, curr) => acc + curr.activeCount,
                0,
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Itens Expirados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {Object.values(warrantiesSummary).reduce(
                (acc, curr) => acc + curr.expiredCount,
                0,
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar unidade..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unidade</TableHead>
              <TableHead>Bloco</TableHead>
              <TableHead>Status da Garantia</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.map((unit) => {
              const summary = warrantiesSummary[unit.id]
              return (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.number}</TableCell>
                  <TableCell>{unit.block}</TableCell>
                  <TableCell>
                    {summary?.configured ? (
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {summary.activeCount} Vigentes
                        </Badge>
                        {summary.expiredCount > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            {summary.expiredCount} Expirados
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary">Não Configurado</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {summary?.configured ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewUnit(unit)}
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" /> Gerenciar
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => setSelectedUnit(unit)}>
                        <ShieldAlert className="w-4 h-4 mr-2" /> Configurar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {selectedUnit && (
        <UnitWarrantyDialog
          open={!!selectedUnit}
          onOpenChange={(o) => !o && setSelectedUnit(null)}
          unit={selectedUnit}
          onSuccess={() => {
            loadData()
            setSelectedUnit(null)
          }}
        />
      )}

      {viewUnit && (
        <Dialog open={!!viewUnit} onOpenChange={(o) => !o && setViewUnit(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogTitle>
              Gestão de Garantias - Unidade {viewUnit.number}
            </DialogTitle>
            <UnitWarrantyList unit={viewUnit} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
