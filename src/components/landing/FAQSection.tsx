import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FAQSection() {
  const faqs = [
    {
      q: 'Quanto tempo leva para implantar?',
      a: 'A implantação é imediata. Assim que você cria a conta, já pode cadastrar empreendimentos e começar a usar. Oferecemos treinamentos em vídeo para sua equipe.',
    },
    {
      q: 'Posso integrar com meu ERP?',
      a: 'Sim, o plano Enterprise oferece API aberta para integração com os principais ERPs do mercado (Sienge, Totvs, Uau, etc).',
    },
    {
      q: 'O que acontece se eu cancelar?',
      a: 'Você pode exportar todos os seus dados e documentos. Mantemos o acesso para leitura por 30 dias após o cancelamento.',
    },
    {
      q: 'Funciona offline?',
      a: 'Sim! O aplicativo de vistoria funciona 100% offline. Os dados sincronizam automaticamente quando houver conexão.',
    },
    {
      q: 'Existe limite de armazenamento?',
      a: 'Nos planos Basic e Pro, o limite é gerenciado por empreendimento. No Enterprise, o armazenamento é elástico conforme sua necessidade.',
    },
    {
      q: 'O proprietário precisa baixar app?',
      a: 'Não obrigatório. O Portal do Proprietário é uma Web App responsiva que funciona no navegador, mas também oferecemos app nativo nas lojas se preferir.',
    },
    {
      q: 'Como funciona o suporte?',
      a: 'Oferecemos suporte via chat, e-mail e base de conhecimento. Clientes Enterprise têm gerente de sucesso dedicado.',
    },
    {
      q: 'É seguro colocar os dados dos clientes?',
      a: 'Segurança é nossa prioridade. Usamos criptografia bancária e servidores na AWS com backups diários. Estamos 100% em conformidade com a LGPD.',
    },
  ]

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Perguntas Frequentes
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-slate-800 hover:text-primary">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
