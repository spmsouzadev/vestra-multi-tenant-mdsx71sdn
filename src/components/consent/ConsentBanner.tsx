import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { ConsentModal } from './ConsentModal'
import { ShieldAlert } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export function ConsentBanner() {
  const { consentResolved, updateConsents } = useAppStore()
  const [showModal, setShowModal] = useState(false)
  const location = useLocation()

  const isTargetPage =
    location.pathname === '/' || location.pathname === '/login'

  if (consentResolved || !isTargetPage) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] animate-slide-up">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 flex items-start md:items-center gap-4">
            <div className="hidden sm:flex bg-blue-100 p-2 rounded-full text-blue-700 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
              A <strong>VESTRA</strong> utiliza cookies e tecnologias
              semelhantes para garantir a segurança, melhorar a sua experiência,
              analisar o tráfego do site e personalizar conteúdo. Ao clicar em
              "Aceitar Todos", você concorda com o uso de todos os cookies, em
              conformidade com a LGPD e nossa{' '}
              <a href="#" className="underline font-medium hover:text-primary">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 md:flex-none"
              onClick={() => setShowModal(true)}
            >
              Personalizar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 md:flex-none"
              onClick={() =>
                updateConsents({ analytics: false, marketing: false })
              }
            >
              Rejeitar
            </Button>
            <Button
              size="sm"
              className="flex-1 md:flex-none"
              onClick={() =>
                updateConsents({ analytics: true, marketing: true })
              }
            >
              Aceitar Todos
            </Button>
          </div>
        </div>
      </div>
      <ConsentModal open={showModal} onOpenChange={setShowModal} />
    </>
  )
}
