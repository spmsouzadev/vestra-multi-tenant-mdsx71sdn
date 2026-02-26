import { useState, useEffect } from 'react'
import useAppStore from '@/stores/useAppStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface ConsentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConsentModal({ open, onOpenChange }: ConsentModalProps) {
  const { consents, updateConsents } = useAppStore()
  const [localConsents, setLocalConsents] = useState(consents)

  useEffect(() => {
    setLocalConsents(consents)
  }, [consents, open])

  const handleSave = () => {
    updateConsents(localConsents)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações de Privacidade</DialogTitle>
          <DialogDescription>
            Personalize suas preferências de uso de dados e cookies em
            conformidade com a LGPD.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-base">Termos de Uso & Essencial</Label>
              <p className="text-sm text-muted-foreground">
                Necessários para o funcionamento básico da plataforma,
                segurança, e cumprimento das obrigações legais (LGPD). Não podem
                ser desativados.
              </p>
            </div>
            <Switch checked disabled />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-base">Cookies Analíticos</Label>
              <p className="text-sm text-muted-foreground">
                Permitem entender como você interage com o site, medir o tráfego
                e melhorar a experiência.
              </p>
            </div>
            <Switch
              checked={localConsents.analytics}
              onCheckedChange={(v) =>
                setLocalConsents((prev) => ({ ...prev, analytics: v }))
              }
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-base">Marketing</Label>
              <p className="text-sm text-muted-foreground">
                Usados para rastrear a eficácia de campanhas e enviar ofertas
                relevantes ao seu perfil.
              </p>
            </div>
            <Switch
              checked={localConsents.marketing}
              onCheckedChange={(v) =>
                setLocalConsents((prev) => ({ ...prev, marketing: v }))
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
