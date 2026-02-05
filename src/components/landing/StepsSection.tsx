import { Building, Send, ShieldCheck, ArrowRight } from 'lucide-react'

export function StepsSection() {
  const steps = [
    {
      id: 1,
      icon: Building,
      title: 'Cadastre seus Empreendimentos',
      description:
        'Importe suas unidades, defina as áreas comuns e configure os prazos de garantia.',
    },
    {
      id: 2,
      icon: Send,
      title: 'Envie Documentos e Vistorias',
      description:
        'Convide os proprietários, realize as vistorias digitais e entregue o manual do proprietário.',
    },
    {
      id: 3,
      icon: ShieldCheck,
      title: 'Gerencie Garantias',
      description:
        'Receba chamados técnicos, valide prazos automaticamente e despache para a equipe de obra.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Como funciona</h2>
          <p className="text-muted-foreground mt-4">
            Simples, rápido e eficiente.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-200 -z-10"></div>

          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center mb-6 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <step.icon className="h-8 w-8" />
                </div>
              </div>
              <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                PASSO {step.id}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
