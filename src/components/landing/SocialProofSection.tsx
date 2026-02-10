import { Card, CardContent } from '@/components/ui/card'
import { Clock, CheckCircle, Database } from 'lucide-react'

export function SocialProofSection() {
  const brands = [
    {
      name: 'Construtora Alpha',
      logo: 'https://img.usecurling.com/i?q=construction&color=gray&shape=fill',
    },
    {
      name: 'Beta Incorporadora',
      logo: 'https://img.usecurling.com/i?q=building&color=gray&shape=fill',
    },
    {
      name: 'Gamma Engenharia',
      logo: 'https://img.usecurling.com/i?q=crane&color=gray&shape=fill',
    },
    {
      name: 'Delta Properties',
      logo: 'https://img.usecurling.com/i?q=house&color=gray&shape=fill',
    },
    {
      name: 'Epsilon Realty',
      logo: 'https://img.usecurling.com/i?q=city&color=gray&shape=fill',
    },
  ]

  return (
    <section className="py-16 bg-white border-b">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
          Mais de 200 construtoras confiam na VESTRA
        </p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-16 opacity-70 grayscale">
          {brands.map((brand, i) => (
            <img
              key={i}
              src={brand.logo}
              alt={brand.name}
              className="h-8 md:h-10 w-auto object-contain hover:grayscale-0 transition-all duration-300"
            />
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-50 border-none shadow-none">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">-40%</h3>
              <p className="text-muted-foreground">
                Redução no tempo de vistoria e entrega de chaves
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 border-none shadow-none">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">100%</h3>
              <p className="text-muted-foreground">
                Centralização de documentos e manuais técnicos
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 border-none shadow-none">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">-65%</h3>
              <p className="text-muted-foreground">
                Redução de chamados improcedentes de assistência
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
