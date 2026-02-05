import { Lock, Shield, FileSearch, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function SecuritySection() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium mb-6">
              <Shield className="h-3 w-3" />
              Segurança Enterprise
            </div>
            <h2 className="text-3xl font-bold mb-6">
              Segurança e Compliance para Grandes Incorporadoras
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Nossa infraestrutura foi desenhada para atender os requisitos mais
              rigorosos de segurança da informação e legislação.
            </p>

            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700 text-slate-200">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="bg-blue-900/50 p-2 rounded-lg text-blue-400">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Criptografia de Ponta a Ponta
                    </h4>
                    <p className="text-sm text-slate-400">
                      Dados criptografados em repouso (AES-256) e em trânsito
                      (TLS 1.3).
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 text-slate-200">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="bg-purple-900/50 p-2 rounded-lg text-purple-400">
                    <FileSearch className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Audit Trail Imutável
                    </h4>
                    <p className="text-sm text-slate-400">
                      Registro completo de todas as ações: quem fez, o que fez e
                      quando fez.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-slate-400" />
              Perguntas Frequentes de Compliance
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-400">
                  O sistema está adequado à LGPD?
                </AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  Sim. Possuímos ferramentas nativas para gestão de
                  consentimento, anonimização de dados e relatórios de impacto,
                  garantindo total conformidade com a Lei Geral de Proteção de
                  Dados.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-400">
                  As assinaturas têm validade jurídica?
                </AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  Sim. Utilizamos assinatura eletrônica avançada, coletando IP,
                  geolocalização e carimbo de tempo, conforme Medida Provisória
                  2.200-2/2001.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-blue-400">
                  Como funciona o controle de acesso (RBAC)?
                </AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  Você pode criar perfis personalizados (ex: Engenheiro, SAC,
                  Master) e definir permissões granulares de visualização e
                  edição para cada módulo do sistema.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
