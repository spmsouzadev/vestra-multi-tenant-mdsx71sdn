import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Building2, Menu, X } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function LandingHeader() {
  const { user } = useAppStore()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { name: 'Solução', href: '#features' },
    { name: 'Funcionalidades', href: '#details' },
    { name: 'Planos', href: '#pricing' },
    { name: 'Depoimentos', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2'
          : 'bg-white py-4 border-transparent',
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 font-extrabold text-xl text-slate-900 cursor-pointer tracking-tight uppercase"
          onClick={() => window.scrollTo(0, 0)}
        >
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          VESTRA
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(link.href.replace('#', ''))
              }}
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Button onClick={() => navigate('/dashboard')}>
              Ir para Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button onClick={() => scrollToSection('cadastro')}>
                Criar conta
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(link.href.replace('#', ''))
                    }}
                    className="text-lg font-medium text-slate-900"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="flex flex-col gap-3 mt-4">
                  {user ? (
                    <Button onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/login')}
                      >
                        Entrar
                      </Button>
                      <Button onClick={() => scrollToSection('cadastro')}>
                        Criar conta
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
