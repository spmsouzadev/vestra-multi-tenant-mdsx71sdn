import { useState, useEffect } from 'react'
import { tenantService } from '@/services/tenantService'
import { Tenant } from '@/types'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  Building,
  MoreHorizontal,
  Loader2,
  KeyRound,
  Eye,
  Edit,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { EditTenantSheet } from '@/components/tenants/EditTenantSheet'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()

  // Actions State
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [resetPasswordTenant, setResetPasswordTenant] = useState<Tenant | null>(
    null,
  )
  const [isResetting, setIsResetting] = useState(false)

  const loadTenants = async () => {
    setLoading(true)
    try {
      const data = await tenantService.getTenants()
      setTenants(data)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar construtoras.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTenants()
  }, [])

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cnpj.includes(searchTerm),
  )

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant)
  }

  const handleUpdate = async (id: string, updates: Partial<Tenant>) => {
    try {
      await tenantService.updateTenant(id, updates)
      await loadTenants()
      toast({
        title: 'Atualizado',
        description: 'Construtora atualizada com sucesso.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao atualizar construtora.',
      })
    }
  }

  const handleResetPassword = async () => {
    if (!resetPasswordTenant?.adminEmail) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description:
          'Este tenant não possui um email administrativo configurado.',
      })
      setResetPasswordTenant(null)
      return
    }

    setIsResetting(true)
    try {
      await tenantService.resetTenantPassword(resetPasswordTenant.adminEmail)
      toast({
        title: 'Email enviado',
        description: `Link de redefinição enviado para ${resetPasswordTenant.adminEmail}`,
        className: 'bg-green-500 text-white border-none',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível enviar o email de redefinição.',
      })
    } finally {
      setIsResetting(false)
      setResetPasswordTenant(null)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Gestão de Construtoras
          </h1>
          <p className="text-muted-foreground">
            Gerencie os tenants da plataforma
          </p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" /> Nova Construtora
        </Button>
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
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Carregando...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTenants.length === 0 ? (
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
                    {tenant.logoUrl ? (
                      <img
                        src={tenant.logoUrl}
                        alt=""
                        className="h-8 w-8 rounded bg-slate-100 object-contain p-1"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center">
                        <Building className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span>{tenant.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {tenant.adminEmail || 'Sem email admin'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{tenant.cnpj}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50">
                      {tenant.plan || 'Standard'}
                    </Badge>
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
                    {tenant.createdAt
                      ? format(new Date(tenant.createdAt), 'dd/MM/yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(tenant)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/tenants/${tenant.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setResetPasswordTenant(tenant)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <KeyRound className="mr-2 h-4 w-4" /> Resetar senha
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingTenant && (
        <EditTenantSheet
          open={!!editingTenant}
          onOpenChange={(open) => !open && setEditingTenant(null)}
          tenant={editingTenant}
          onSave={handleUpdate}
        />
      )}

      <AlertDialog
        open={!!resetPasswordTenant}
        onOpenChange={(open) => !open && setResetPasswordTenant(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar reset de senha</AlertDialogTitle>
            <AlertDialogDescription>
              Isso enviará um email oficial da <strong>VESTRA</strong> com
              instruções de redefinição de senha para{' '}
              <span className="font-bold text-slate-900">
                {resetPasswordTenant?.adminEmail || 'o email administrativo'}
              </span>
              .
              <br />
              <br />O usuário atual precisará criar uma nova senha para acessar
              a plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetPassword}
              disabled={isResetting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Confirmar Envio'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
