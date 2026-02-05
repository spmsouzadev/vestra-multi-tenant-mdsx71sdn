import useAppStore from '@/stores/useAppStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Phone } from 'lucide-react'

export default function Owners() {
  const { owners } = useAppStore()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Proprietários</h1>
          <p className="text-muted-foreground">
            Base de clientes e proprietários
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Novo Proprietário
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Unidades</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {owners.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell className="font-medium">{owner.name}</TableCell>
                <TableCell>{owner.document}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {owner.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {owner.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {owner.unitsOwned.length} Unidade(s)
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
