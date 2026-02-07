import { useState, useEffect } from 'react'
import { UnitWarranty, Unit } from '@/types'
import { warrantyService } from '@/services/warrantyService'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format, isPast, differenceInDays, parseISO } from 'date-fns'
import { AlertTriangle, CheckCircle, PauseCircle, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface UnitWarrantyListProps {
  unit: Unit
}

export function UnitWarrantyList({ unit }: UnitWarrantyListProps) {
  const [warranties, setWarranties] = useState<UnitWarranty[]>([])
  const { toast } = useToast()

  const loadWarranties = async () => {
    try {
      const data = await warrantyService.getUnitWarranties(unit.id)
      setWarranties(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadWarranties()
  }, [unit])

  const getStatus = (w: UnitWarranty) => {
    if (w.status === 'Suspensa') return 'Suspensa'
    if (isPast(parseISO(w.expirationDate))) return 'Expirada'
    return 'Vigente'
  }

  const getStatusBadge = (status: string, expirationDate: string) => {
    const daysLeft = differenceInDays(parseISO(expirationDate), new Date())

    if (status === 'Suspensa') {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-700 hover:bg-amber-200"
        >
          <PauseCircle className="w-3 h-3 mr-1" /> Suspensa
        </Badge>
      )
    }
    if (status === 'Expirada') {
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" /> Expirada
        </Badge>
      )
    }

    // Vigente logic
    if (daysLeft < 90 && daysLeft >= 0) {
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">
          <AlertTriangle className="w-3 h-3 mr-1" /> Expira em breve
        </Badge>
      )
    }

    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" /> Vigente
      </Badge>
    )
  }

  const toggleSuspend = async (w: UnitWarranty) => {
    const newStatus = w.status === 'Suspensa' ? 'Vigente' : 'Suspensa'
    try {
      await warrantyService.updateUnitWarrantyStatus(w.id, newStatus)
      setWarranties((prev) =>
        prev.map((item) =>
          item.id === w.id ? { ...item, status: newStatus as any } : item,
        ),
      )
      toast({
        description: `Garantia ${newStatus === 'Suspensa' ? 'suspensa' : 'reativada'}.`,
      })
    } catch (error) {
      toast({ variant: 'destructive', description: 'Erro ao atualizar status' })
    }
  }

  const coveredItems = warranties.filter((w) => getStatus(w) === 'Vigente')
  const notCoveredItems = warranties.filter((w) => getStatus(w) !== 'Vigente')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-md bg-green-50/50">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Itens Cobertos (
            {coveredItems.length})
          </h4>
          <ul className="text-sm text-green-700 space-y-1 pl-6 list-disc">
            {coveredItems.map((w) => (
              <li key={w.id}>{w.categoryName}</li>
            ))}
            {coveredItems.length === 0 && <li>Nenhum item coberto.</li>}
          </ul>
        </div>
        <div className="p-4 border rounded-md bg-slate-50">
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Não Cobertos / Expirados (
            {notCoveredItems.length})
          </h4>
          <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc">
            {notCoveredItems.map((w) => (
              <li key={w.id}>
                {w.categoryName} ({getStatus(w)})
              </li>
            ))}
            {notCoveredItems.length === 0 && <li>Nenhum item expirado.</li>}
          </ul>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sistema</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warranties.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.categoryName}</TableCell>
                <TableCell>
                  {format(parseISO(w.startDate), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {format(parseISO(w.expirationDate), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {getStatusBadge(getStatus(w), w.expirationDate)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`suspend-${w.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Suspender
                      </Label>
                      <Switch
                        id={`suspend-${w.id}`}
                        checked={w.status === 'Suspensa'}
                        onCheckedChange={() => toggleSuspend(w)}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
