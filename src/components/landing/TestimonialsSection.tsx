import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ricardo Souza',
      role: 'Gerente de Obras',
      company: 'Construtora Viver Bem',
      image: 'https://img.usecurling.com/ppl/medium?gender=male&seed=4',
      quote:
        'Reduzimos em 50% o tempo gasto com papelada nas vistorias. A equipe de campo adorou a facilidade do aplicativo.',
    },
    {
      name: 'Mariana Costa',
      role: 'Diretora de Operações',
      company: 'Urban Incorporadora',
      image: 'https://img.usecurling.com/ppl/medium?gender=female&seed=5',
      quote:
        'O portal do proprietário elevou nossa percepção de marca. Os clientes se sentem muito mais seguros tendo acesso a tudo digitalmente.',
    },
    {
      name: 'Carlos Mendes',
      role: 'Engenheiro Residente',
      company: 'Mendes Engenharia',
      image: 'https://img.usecurling.com/ppl/medium?gender=male&seed=6',
      quote:
        'A gestão de garantias era nosso maior gargalo. Com a ObraEntregue, eliminamos chamados improcedentes e organizamos o fluxo.',
    },
  ]

  return (
    <section className="py-20 bg-white" id="testimonials">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          O que dizem nossos clientes
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="bg-slate-50 border-none shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-slate-700 italic mb-6 min-h-[80px]">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                    <div className="text-xs text-primary font-medium">
                      {t.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
