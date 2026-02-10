import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from 'lucide-react'

export function DemoSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="py-16 bg-primary text-primary-foreground" id="demo">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Veja a VESTRA em ação
        </h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Agende uma demonstração rápida de 15 minutos e descubra como podemos
          digitalizar sua construtora ainda esta semana.
        </p>

        {submitted ? (
          <div className="bg-white/10 p-6 rounded-lg inline-block animate-fade-in">
            <p className="font-bold flex items-center gap-2 justify-center">
              <Calendar className="h-5 w-5" />
              Solicitação enviada! Entraremos em contato.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              className="bg-white text-slate-900 border-0 focus-visible:ring-offset-primary"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              variant="secondary"
              className="font-bold whitespace-nowrap"
            >
              Agendar Demo
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
