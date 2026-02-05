import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check, Info } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Basic',
      priceMonthly: 199,
      priceAnnual: 165, // 199 * 10 / 12 approx
      description: 'Ideal para pequenas construtoras',
      features: [
        'Até 2 Empreendimentos',
        'Vistorias Digitais',
        'Portal do Proprietário Básico',
        '1 Usuário Admin',
        'Suporte por E-mail',
      ],
      cta: 'Começar Grátis',
      highlight: false,
    },
    {
      name: 'Pro',
      priceMonthly: 499,
      priceAnnual: 415, // 499 * 10 / 12
      description: 'Para empresas em crescimento',
      features: [
        'Até 10 Empreendimentos',
        'Tudo do Basic',
        'Gestão de Garantias',
        'Assinatura Digital',
        '5 Usuários Admin',
        'Suporte Prioritário',
      ],
      cta: 'Assinar Agora',
      highlight: true,
    },
    {
      name: 'Enterprise',
      priceMonthly: null,
      priceAnnual: null,
      description: 'Volume e necessidades personalizadas',
      features: [
        'Empreendimentos Ilimitados',
        'Tudo do Pro',
        'API de Integração',
        'Domínio Personalizado (Whitelabel)',
        'Gestor de Conta Dedicado',
        'SLA Garantido',
      ],
      cta: 'Falar com Consultor',
      highlight: false,
    },
  ]

  const scrollToRegistration = () => {
    const element = document.getElementById('cadastro')
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-slate-900 text-white" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Planos transparentes para cada fase
          </h2>
          <p className="text-slate-400 mb-8">
            Escolha a melhor opção para digitalizar sua construtora.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Label
              htmlFor="billing-mode"
              className={!isAnnual ? 'text-white font-bold' : 'text-slate-400'}
            >
              Mensal
            </Label>
            <Switch
              id="billing-mode"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label
              htmlFor="billing-mode"
              className={isAnnual ? 'text-white font-bold' : 'text-slate-400'}
            >
              Anual
              <Badge
                variant="secondary"
                className="ml-2 bg-green-500 text-white hover:bg-green-600 border-0"
              >
                2 meses off
              </Badge>
            </Label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col ${plan.highlight ? 'border-primary shadow-lg scale-105 z-10' : 'border-slate-700 bg-slate-800'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Mais Popular
                </div>
              )}
              <CardHeader>
                <CardTitle
                  className={plan.highlight ? 'text-primary' : 'text-white'}
                >
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  {plan.priceMonthly ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-slate-400">R$</span>
                      <span
                        className={`text-4xl font-bold ${plan.highlight ? 'text-slate-900' : 'text-white'}`}
                      >
                        {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                      </span>
                      <span className="text-slate-400">/mês</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-white py-1">
                      Sob Consulta
                    </div>
                  )}
                  {isAnnual && plan.priceMonthly && (
                    <p className="text-xs text-green-400 mt-1">
                      Economia de R$ {(plan.priceMonthly * 2).toFixed(0)}/ano
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlight ? 'default' : 'outline'}
                  onClick={scrollToRegistration}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
