import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Unit, WarrantyCategory } from '@/types'
import { warrantyService } from '@/services/warrantyService'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'
import { Loader2, CheckSquare, Square } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'

interface UnitWarrantyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  units: Unit[]
  onSuccess: () => void
}

export function UnitWarrantyDialog({
  open,
  onOpenChange,
  units,
  onSuccess,
}: UnitWarrantyDialogProps) {
  const { user } = useAppStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<WarrantyCategory[]>([])

  // Selection state: Map of categoryId -> Date string (yyyy-mm-dd) or null if not selected
  const [selection, setSelection] = useState<Record<string, string>>({})
  const [masterDate, setMasterDate] = useState(
    new Date().toISOString().split('T')[0],
  )

  useEffect(() => {
    if (open && user?.tenantId) {
      loadCategories(user.tenantId)
    }
  }, [open, user])

  const loadCategories = async (tenantId: string) => {
    try {
      const data = await warrantyService.getCategories(tenantId)
      setCategories(data)

      // Initialize selection with all selected by default using master date
      const initialSelection: Record<string, string> = {}
      data.forEach((c) => {
        initialSelection[c.id] = masterDate
      })
      setSelection(initialSelection)
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao carregar categorias.',
      })
    }
  }

  const handleMasterDateChange = (date: string) => {
    setMasterDate(date)
    // Update all selected categories to this date
    setSelection((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (next[key]) next[key] = date
      })
      return next
    })
  }

  const toggleCategory = (catId: string) => {
    setSelection((prev) => {
      const next = { ...prev }
      if (next[catId]) {
        delete next[catId]
      } else {
        next[catId] = masterDate
      }
      return next
    })
  }

  const updateCategoryDate = (catId: string, date: string) => {
    setSelection((prev) => ({
      ...prev,
      [catId]: date,
    }))
  }

  const toggleAll = () => {
    const allSelected = categories.every((c) => selection[c.id])
    if (allSelected) {
      setSelection({})
    } else {
      const next: Record<string, string> = {}
      categories.forEach((c) => (next[c.id] = masterDate))
      setSelection(next)
    }
  }

  const handleSave = async () => {
    if (!user?.tenantId || Object.keys(selection).length === 0) return

    setLoading(true)
    try {
      const assignments = Object.entries(selection).map(([catId, dateStr]) => ({
        categoryId: catId,
        startDate: new Date(dateStr),
      }))

      await warrantyService.generateWarranties(
        units.map((u) => u.id),
        assignments,
        user.tenantId,
      )

      toast({
        title: 'Garantias Configuradas',
        description: `Garantias aplicadas para ${units.length} unidade(s).`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao gerar garantias.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Configurar Garantias</DialogTitle>
          <DialogDescription>
            Aplicando para {units.length} unidade(s). Selecione as categorias e
            defina as datas de início.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 flex-1 overflow-hidden">
          <div className="grid gap-2 p-4 bg-slate-50 rounded-md border">
            <Label>Data de Início Padrão (Entrega/Habite-se)</Label>
            <div className="flex gap-4 items-center">
              <Input
                type="date"
                value={masterDate}
                onChange={(e) => handleMasterDateChange(e.target.value)}
                className="max-w-xs bg-white"
              />
              <span className="text-xs text-muted-foreground">
                Altera todas as categorias selecionadas abaixo.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <Label className="text-sm font-medium">Categorias Globais</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAll}
              className="h-auto p-0 text-primary"
            >
              {categories.every((c) => selection[c.id])
                ? 'Desmarcar Todas'
                : 'Selecionar Todas'}
            </Button>
          </div>

          <ScrollArea className="flex-1 border rounded-md p-2">
            <div className="space-y-2">
              {categories.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma categoria configurada. Vá em Configurações &gt;
                  Garantias para criar.
                </div>
              )}
              {categories.map((cat) => {
                const isSelected = !!selection[cat.id]
                return (
                  <div
                    key={cat.id}
                    className={`flex items-center gap-4 p-3 rounded-md border transition-colors ${isSelected ? 'bg-white border-primary/50' : 'bg-slate-50 border-transparent'}`}
                  >
                    <Checkbox
                      id={cat.id}
                      checked={isSelected}
                      onCheckedChange={() => toggleCategory(cat.id)}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={cat.id}
                        className="font-medium cursor-pointer"
                      >
                        {cat.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {cat.termMonths} meses
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-2">
                        <Label className="text-xs whitespace-nowrap">
                          Início:
                        </Label>
                        <Input
                          type="date"
                          value={selection[cat.id]}
                          onChange={(e) =>
                            updateCategoryDate(cat.id, e.target.value)
                          }
                          className="w-36 h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || Object.keys(selection).length === 0}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Garantias
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
