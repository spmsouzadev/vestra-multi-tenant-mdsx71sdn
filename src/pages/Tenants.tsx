import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Building } from 'lucide-react'
import { Tenant } from '@/types'
import { useToast } from '@/hooks/use-toast'

export default function Tenants() {
  const { tenants, addTenant } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Form State
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: '',
    cnpj: '',
    primaryColor: '#000000',
    status: 'ACTIVE',
  })

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cnpj.includes(searchTerm),
  )

  const handleCreate = () => {
    if (!formData.name || !formData.cnpj) return

    const newTenant: Tenant = {
      id: Math.random().toString(),
      name: formData.name,
      cnpj: formData.cnpj,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      projectCount: 0,
      primaryColor: formData.primaryColor,
      logoUrl: 'https://img.usecurling.com/i?q=building&color=black',
    }

    addTenant(newTenant)
    setIsDialogOpen(false)
    setFormData({ name: '', cnpj: '', primaryColor: '#000000' })
    toast({
      title: 'Sucesso',
      description: 'Construtora cadastrada com sucesso.',
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Gestão de Construtoras
          </h1>
          <p className="text-muted-foreground">
            Gerencie os tenants da plataforma
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" /> Nova Construtora
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Construtora</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo tenant.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cnpj" className="text-right">
                  CNPJ
                </Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) =>
                    setFormData({ ...formData, cnpj: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Cor Primária
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData({ ...formData, primaryColor: e.target.value })
                    }
                    className="w-12 h-10 p-1"
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.primaryColor}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Cadastrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 max-w-md"
        />
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Construtora</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Projetos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredTenants.map((tenant) => (
                <TableRow
                  key={tenant.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="font-medium flex items-center gap-3">
                    {tenant.logoUrl && (
                      <img
                        src={tenant.logoUrl}
                        alt=""
                        className="h-8 w-8 rounded bg-slate-100 object-contain p-1"
                      />
                    )}
                    {tenant.name}
                  </TableCell>
                  <TableCell>{tenant.cnpj}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      {tenant.projectCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tenant.status === 'ACTIVE'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {tenant.status === 'ACTIVE' ? 'Ativo' : 'Suspenso'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
