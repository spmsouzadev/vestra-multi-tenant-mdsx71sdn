import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import logoVestra from '@/assets/logo_apenas_imagem-aa4c3.png'

export function LandingFooter() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 font-extrabold text-xl text-white mb-4 tracking-tight uppercase">
              <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logoVestra}
                  alt="VESTRA Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>
              VESTRA
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Plataforma completa para gestão de entrega de obras, vistorias e
              assistência técnica.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('features')
                  }}
                  className="hover:text-white"
                >
                  Funcionalidades
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('pricing')
                  }}
                  className="hover:text-white"
                >
                  Planos e Preços
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('testimonials')
                  }}
                  className="hover:text-white"
                >
                  Clientes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Atualizações
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Segurança
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  LGPD
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            © 2024 VESTRA Tecnologia Ltda. Todos os direitos reservados.
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button size="sm" onClick={() => scrollToSection('cadastro')}>
              Criar Conta
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
