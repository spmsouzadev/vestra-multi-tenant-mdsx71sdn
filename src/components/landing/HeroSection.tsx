import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react'

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 animate-fade-in-down">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Plataforma #1 em Gestão de Pós-Obra
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto animate-fade-in-up">
          Entrega de imóveis sem papel, com rastreabilidade e{' '}
          <span className="text-primary">segurança jurídica</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-100">
          Digitalize seus processos de vistoria, entrega de chaves e gestão de
          garantias. Elimine o retrabalho e aumente a satisfação do seu cliente.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up delay-200">
          <Button
            size="lg"
            className="w-full sm:w-auto text-base h-12 px-8"
            onClick={() => scrollToSection('cadastro')}
          >
            Criar conta grátis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto text-base h-12 px-8"
            onClick={() => scrollToSection('demo')}
          >
            Agendar demonstração
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium text-slate-500 animate-fade-in delay-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            LGPD Ready
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            Trilha de Auditoria
          </div>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-purple-600" />
            Assinatura Digital
          </div>
        </div>
      </div>
    </section>
  )
}
