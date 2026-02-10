import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { X, Check } from 'lucide-react'

export function ComparisonSection() {
  const rows = [
    {
      feature: 'Vistorias',
      before: 'Papel, prancheta e fotos soltas no celular',
      after: 'App integrado, fotos vinculadas e laudo automático',
    },
    {
      feature: 'Manuais',
      before: 'Livro impresso caro, que o cliente perde',
      after: 'Portal digital, sempre atualizado e pesquisável',
    },
    {
      feature: 'Garantias',
      before: 'Planilhas excel e e-mails perdidos',
      after: 'Sistema de tickets com controle de prazos',
    },
    {
      feature: 'Assinaturas',
      before: 'Reconhecimento de firma e cartório',
      after: 'Assinatura digital com validade jurídica instantânea',
    },
    {
      feature: 'Relatórios',
      before: 'Compilação manual demorada',
      after: 'Dashboards em tempo real',
    },
  ]

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">
            Evolua seu processo
          </h2>
          <p className="text-slate-600 mt-2">
            Veja a diferença entre o método tradicional e a VESTRA
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead className="w-1/3 text-center py-6 text-lg font-bold text-slate-900">
                  Processo
                </TableHead>
                <TableHead className="w-1/3 text-center py-6 text-lg font-bold text-red-600 bg-red-50">
                  Antes (Manual)
                </TableHead>
                <TableHead className="w-1/3 text-center py-6 text-lg font-bold text-green-600 bg-green-50">
                  Depois (Digital)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell className="font-medium text-slate-900 text-center border-r">
                    {row.feature}
                  </TableCell>
                  <TableCell className="bg-red-50/30 text-center border-r">
                    <div className="flex flex-col items-center gap-2 text-slate-600">
                      <X className="h-5 w-5 text-red-500" />
                      {row.before}
                    </div>
                  </TableCell>
                  <TableCell className="bg-green-50/30 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-900 font-medium">
                      <Check className="h-5 w-5 text-green-500" />
                      {row.after}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
