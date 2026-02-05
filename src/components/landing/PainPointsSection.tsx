import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { XCircle, CheckCircle } from 'lucide-react'

export function PainPointsSection() {
  const painPoints = [
    {
      problem: 'Documentação Espalhada',
      description:
        'Manuais, plantas e garantias perdidos em e-mails e pastas físicas.',
      solution:
        'Portal do Cliente com toda documentação centralizada e acessível via QR Code.',
    },
    {
      problem: 'Vistorias em Papel',
      description:
        'Fichas preenchidas à mão, ilegíveis e sem evidências fotográficas.',
      solution:
        'App de vistoria digital com fotos, assinatura na tela e geração automática de laudo.',
    },
    {
      problem: 'Gestão de Chamados Caótica',
      description:
        'Solicitações via WhatsApp, telefone e e-mail sem controle de prazo.',
      solution:
        'Sistema de tickets estruturado com validação automática de vigência de garantia.',
    },
  ]

  return (
    <section className="py-20 bg-slate-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            A entrega de chaves não precisa ser uma dor de cabeça
          </h2>
          <p className="text-lg text-slate-600">
            Identificamos os maiores gargalos do processo tradicional e criamos
            soluções definitivas para cada um deles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((item, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-slate-50 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform opacity-50"></div>
              <Card className="relative h-full border-slate-200 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2 text-red-500 font-medium">
                    <XCircle className="h-5 w-5" />
                    <span>O Problema</span>
                  </div>
                  <CardTitle className="text-xl mb-2">{item.problem}</CardTitle>
                  <p className="text-sm text-slate-500 mb-6 min-h-[40px]">
                    {item.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-2 text-green-700 font-medium">
                      <CheckCircle className="h-5 w-5" />
                      <span>A Solução</span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium">
                      {item.solution}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
