import { useState } from 'react'
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
import { Unit } from '@/types'
import { warrantyService } from '@/services/warrantyService'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'
import { Loader2 } from 'lucide-react'

interface UnitWarrantyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: Unit
  onSuccess: () => void
}

export function UnitWarrantyDialog({
  open,
  onOpenChange,
  unit,
  onSuccess,
}: UnitWarrantyDialogProps) {
  const { user } = useAppStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0],
  )

  const handleSave = async () => {
    if (!user?.tenantId) return

    setLoading(true)
    try {
      await warrantyService.generateWarranties(
        unit.id,
        new Date(startDate),
        user.tenantId,
      )
      toast({
        title: 'Garantias Configuradas',
        description:
          'As garantias foram geradas com base nos padrões da empresa.',
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Garantia - Unidade {unit.number}</DialogTitle>
          <DialogDescription>
            Defina a data de entrega das chaves para iniciar a contagem dos
            prazos de garantia.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Data de Início (Entrega)</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Os prazos (5 anos, 3 anos, etc.) serão calculados a partir desta
              data.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gerar Garantias
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
