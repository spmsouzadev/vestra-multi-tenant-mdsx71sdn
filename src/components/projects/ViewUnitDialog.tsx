import { Unit } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import useAppStore from '@/stores/useAppStore'

interface ViewUnitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: Unit | null
}

export function ViewUnitDialog({
  open,
  onOpenChange,
  unit,
}: ViewUnitDialogProps) {
  const { owners } = useAppStore()

  if (!unit) return null

  const ownerName = unit.ownerId
    ? owners.find((o) => o.id === unit.ownerId)?.name || 'Desconhecido'
    : 'Nenhum'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Unidade {unit.number}</DialogTitle>
          <DialogDescription>
            Informações completas da unidade.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Bloco</Label>
              <Input value={unit.block} readOnly className="bg-slate-50" />
            </div>
            <div className="grid gap-2">
              <Label>Andar</Label>
              <Input value={unit.floor} readOnly className="bg-slate-50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Área (m²)</Label>
              <Input
                value={unit.area.toString()}
                readOnly
                className="bg-slate-50"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tipologia</Label>
              <Input value={unit.typology} readOnly className="bg-slate-50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Quartos</Label>
              <Input value={unit.bedrooms} readOnly className="bg-slate-50" />
            </div>
            <div className="grid gap-2">
              <Label>Banheiros</Label>
              <Input value={unit.bathrooms} readOnly className="bg-slate-50" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Proprietário</Label>
            <Input value={ownerName} readOnly className="bg-slate-50" />
          </div>
          <div className="grid gap-2">
            <Label>Status Atual</Label>
            <div className="pt-1">
              <Badge variant="outline">{unit.status}</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
