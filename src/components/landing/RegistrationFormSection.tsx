import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const leadSchema = z.object({
  companyType: z.string().min(1, 'Selecione o tipo de empresa'),
  businessName: z.string().min(2, 'Razão social é obrigatória'),
  cnpj: z.string().min(14, 'CNPJ inválido'), // Simple validation
  managerName: z.string().min(2, 'Nome do responsável é obrigatório'),
  email: z.string().email('E-mail inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  location: z.string().min(2, 'Cidade/UF obrigatória'),
  unitsPerMonth: z.string().min(1, 'Selecione o volume'),
  plan: z.string().min(1, 'Selecione um plano'),
  lgpdConsent: z.boolean().refine((val) => val === true, {
    message: 'Você precisa aceitar os termos para continuar',
  }),
})

type LeadFormValues = z.infer<typeof leadSchema>

export function RegistrationFormSection() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      lgpdConsent: false,
    },
  })

  const onSubmit = async (data: LeadFormValues) => {
    setIsLoading(true)
    // Mock API call trigger
    console.log('Lead Captured:', data)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock analytics event
    console.log('Event: form_submit', { form: 'lead_gen_home' })

    setIsLoading(false)
    setIsSuccess(true)

    toast({
      title: 'Solicitação recebida!',
      description: 'Um de nossos especialistas entrará em contato em breve.',
    })
  }

  return (
    <section className="py-20 bg-slate-50" id="cadastro">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Pronto para transformar a entrega dos seus empreendimentos?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Preencha o formulário para criar sua conta ou falar com um
              especialista. Junte-se a mais de 200 construtoras que já
              digitalizaram seus processos.
            </p>
            <ul className="space-y-4">
              {[
                'Setup imediato',
                'Treinamento incluso',
                'Sem fidelidade (planos mensais)',
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 font-medium text-slate-800"
                >
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Card className="shadow-xl border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Criar Conta / Solicitar Contato</CardTitle>
              <CardDescription>
                Comece agora a revolução digital na sua construtora.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="py-12 text-center space-y-4 animate-fade-in">
                  <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Cadastro Recebido!
                  </h3>
                  <p className="text-slate-600">
                    Obrigado pelo interesse. Verifique seu e-mail para os
                    próximos passos ou aguarde nosso contato via WhatsApp.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="mt-4"
                  >
                    Enviar nova solicitação
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyType">Tipo de Empresa</Label>
                      <Select
                        onValueChange={(val) =>
                          form.setValue('companyType', val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="construtora">
                            Construtora
                          </SelectItem>
                          <SelectItem value="incorporadora">
                            Incorporadora
                          </SelectItem>
                          <SelectItem value="imobiliaria">
                            Imobiliária
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.companyType && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.companyType.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitsPerMonth">
                        Unidades Entregues/Ano
                      </Label>
                      <Select
                        onValueChange={(val) =>
                          form.setValue('unitsPerMonth', val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Volume..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-50">Até 50</SelectItem>
                          <SelectItem value="51-200">51 a 200</SelectItem>
                          <SelectItem value="201-500">201 a 500</SelectItem>
                          <SelectItem value="500+">+500</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.unitsPerMonth && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.unitsPerMonth.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessName">Razão Social</Label>
                    <Input
                      id="businessName"
                      placeholder="Sua Construtora Ltda"
                      {...form.register('businessName')}
                    />
                    {form.formState.errors.businessName && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.businessName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        placeholder="00.000.000/0000-00"
                        {...form.register('cnpj')}
                      />
                      {form.formState.errors.cnpj && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.cnpj.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        placeholder="(11) 99999-9999"
                        {...form.register('whatsapp')}
                      />
                      {form.formState.errors.whatsapp && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.whatsapp.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="managerName">Seu Nome</Label>
                    <Input
                      id="managerName"
                      placeholder="Nome Completo"
                      {...form.register('managerName')}
                    />
                    {form.formState.errors.managerName && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.managerName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail Corporativo</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nome@empresa.com.br"
                      {...form.register('email')}
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Cidade / UF</Label>
                    <Input
                      id="location"
                      placeholder="São Paulo - SP"
                      {...form.register('location')}
                    />
                    {form.formState.errors.location && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.location.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plan">Plano de Interesse</Label>
                    <Select onValueChange={(val) => form.setValue('plan', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o plano..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">
                          Basic (R$ 199/mês)
                        </SelectItem>
                        <SelectItem value="pro">Pro (R$ 499/mês)</SelectItem>
                        <SelectItem value="enterprise">
                          Enterprise (Sob consulta)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.plan && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.plan.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2 py-2">
                    <Checkbox
                      id="lgpd"
                      onCheckedChange={(checked) =>
                        form.setValue('lgpdConsent', checked === true)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="lgpd"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Concordo com os Termos e Política de Privacidade
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Ao enviar, você concorda em receber comunicações da
                        ObraEntregue.
                      </p>
                    </div>
                  </div>
                  {form.formState.errors.lgpdConsent && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.lgpdConsent.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Cadastrar Empresa'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
