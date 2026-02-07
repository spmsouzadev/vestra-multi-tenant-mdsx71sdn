import { useState, useEffect } from 'react'
import { WarrantyCategory } from '@/types'
import { warrantyService } from '@/services/warrantyService'
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Pencil, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'

export function WarrantyCategoriesSettings() {
  const { user } = useAppStore()
  const { toast } = useToast()
  const [categories, setCategories] = useState<WarrantyCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<WarrantyCategory | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    termMonths: 60,
    description: '',
  })

  const fetchCategories = async () => {
    if (!user?.tenantId) return
    setLoading(true)
    try {
      const data = await warrantyService.getCategories(user.tenantId)
      setCategories(data)
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao carregar categorias.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [user])

  const handleSubmit = async () => {
    if (!user?.tenantId) return

    try {
      if (editingCategory) {
        await warrantyService.updateCategory(editingCategory.id, formData)
        toast({
          title: 'Atualizado',
          description: 'Categoria atualizada com sucesso.',
        })
      } else {
        await warrantyService.createCategory({
          tenantId: user.tenantId,
          name: formData.name,
          termMonths: formData.termMonths,
          description: formData.description,
        })
        toast({ title: 'Criado', description: 'Categoria criada com sucesso.' })
      }
      setIsDialogOpen(false)
      fetchCategories()
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao salvar categoria.',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await warrantyService.deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast({ title: 'Removido', description: 'Categoria removida.' })
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Erro ao remover categoria.',
      })
    }
  }

  const openCreate = () => {
    setEditingCategory(null)
    setFormData({ name: '', termMonths: 60, description: '' })
    setIsDialogOpen(true)
  }

  const openEdit = (cat: WarrantyCategory) => {
    setEditingCategory(cat)
    setFormData({
      name: cat.name,
      termMonths: cat.termMonths,
      description: cat.description || '',
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Categorias de Garantia (NBR 15575)
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure os prazos padrão para os itens de garantia.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Nova Categoria
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item / Sistema</TableHead>
              <TableHead>Prazo (Meses)</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma categoria configurada.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.termMonths} meses</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cat.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(cat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              Defina o nome e o prazo de garantia em meses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome do Sistema</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Estrutura"
              />
            </div>
            <div className="grid gap-2">
              <Label>Prazo (Meses)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={formData.termMonths}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      termMonths: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  ({(formData.termMonths / 12).toFixed(1)} anos)
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Descrição (Opcional)</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Ex: Fundações, vigas..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
