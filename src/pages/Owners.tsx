import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Phone, Loader2 } from 'lucide-react'
import { ownerService } from '@/services/ownerService'
import { Owner } from '@/types'
import { CreateOwnerDialog } from '@/components/owners/CreateOwnerDialog'
import { useToast } from '@/hooks/use-toast'

export default function Owners() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { toast } = useToast()

  const loadOwners = async () => {
    setLoading(true)
    try {
      const data = await ownerService.getOwners()
      setOwners(data)
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar proprietários.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOwners()
  }, [])

  const handleOwnerCreated = (newOwner: Owner) => {
    setOwners((prev) => [...prev, newOwner])
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Proprietários</h1>
          <p className="text-muted-foreground">
            Base de clientes e proprietários
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Carregando...
                  </div>
                </TableCell>
              </TableRow>
            ) : owners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum proprietário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              owners.map((owner) => (
                <TableRow key={owner.id}>
                  <TableCell className="font-medium">{owner.name}</TableCell>
                  <TableCell>{owner.document || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {owner.email}
                      </div>
                      {owner.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {owner.phone}
                        </div>
                      )}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateOwnerDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleOwnerCreated}
      />
    </div>
  )
}
