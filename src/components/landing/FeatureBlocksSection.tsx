import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureBlockProps {
  title: string
  description: string
  items: string[]
  imageQuery: string
  reversed?: boolean
}

function FeatureBlock({
  title,
  description,
  items,
  imageQuery,
  reversed = false,
}: FeatureBlockProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row items-center gap-12 py-16',
        reversed ? 'md:flex-row-reverse' : '',
      )}
    >
      <div className="flex-1 space-y-6">
        <h3 className="text-3xl font-bold text-slate-900">{title}</h3>
        <p className="text-lg text-slate-600">{description}</p>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 w-full">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-slate-100 aspect-video group">
          <img
            src={`https://img.usecurling.com/p/800/600?q=${imageQuery}&dpr=2`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
        </div>
      </div>
    </div>
  )
}

export function FeatureBlocksSection() {
  return (
    <section className="py-20 bg-slate-50" id="details">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Tudo o que você precisa em uma única plataforma
          </h2>
          <p className="text-slate-600">
            Da construção ao pós-venda, integre toda a jornada do cliente.
          </p>
        </div>

        <div className="space-y-12">
          <FeatureBlock
            title="Gestão de Empreendimentos e Unidades"
            description="Organize seu portfólio de forma inteligente. Tenha visão completa do status de cada unidade, proprietário e histórico."
            items={[
              'Cadastro hierárquico (Empreendimento > Bloco > Unidade)',
              'Importação em massa via planilha',
              'Dashboard gerencial com indicadores em tempo real',
            ]}
            imageQuery="building construction blueprint"
          />

          <FeatureBlock
            title="Vistorias Digitais e Entrega de Chaves"
            description="Abandone o papel. Realize vistorias guiadas por checklist, com fotos obrigatórias e assinatura digital no tablet ou celular."
            items={[
              'Checklists personalizáveis por tipologia',
              'Fotos ilimitadas com marcação de evidências',
              'Assinatura digital com validade jurídica',
              'Geração automática do Termo de Vistoria',
            ]}
            imageQuery="ipad construction site tablet"
            reversed
          />

          <FeatureBlock
            title="Portal do Proprietário e Manual Interativo"
            description="Ofereça uma experiência premium. Seus clientes acessam manuais, plantas, garantias e abrem chamados diretamente pelo celular."
            items={[
              'Manual do Proprietário digital e pesquisável',
              'Download de plantas e projetos',
              'Abertura de chamados técnicos com fotos',
              'Acompanhamento de status de solicitações',
            ]}
            imageQuery="happy family keys apartment"
          />

          <FeatureBlock
            title="Central de Garantias e Assistência Técnica"
            description="Automatize a triagem de chamados. O sistema verifica automaticamente se o item reclamado ainda está na garantia."
            items={[
              'Validação automática de prazos de garantia',
              'Workflow de atendimento e agendamento',
              'Histórico completo por unidade',
              'Métricas de desempenho da equipe técnica',
            ]}
            imageQuery="customer service headset"
            reversed
          />
        </div>
      </div>
    </section>
  )
}
