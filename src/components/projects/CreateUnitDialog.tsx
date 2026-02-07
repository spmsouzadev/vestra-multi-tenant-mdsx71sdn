import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Unit } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const unitSchema = z.object({
  block: z.string().min(1, 'Bloco é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  floor: z.string().min(1, 'Andar é obrigatório'),
  typology: z.string().min(1, 'Tipologia é obrigatória'),
  area: z.coerce.number().positive('Área deve ser um número positivo'),
  price: z.coerce.number().positive('Preço deve ser um número positivo'),
  bedrooms: z.coerce
    .number()
    .int()
    .min(0, 'Quartos deve ser um número inteiro não negativo'),
  bathrooms: z.coerce
    .number()
    .int()
    .min(0, 'Banheiros deve ser um número inteiro não negativo'),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'DELIVERED']),
})

type UnitFormValues = z.infer<typeof unitSchema>

interface CreateUnitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  onSave: (unit: Omit<Unit, 'id' | 'ownerId'>) => Promise<void>
}

export function CreateUnitDialog({
  open,
  onOpenChange,
  projectId,
  onSave,
}: CreateUnitDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      block: '',
      number: '',
      floor: '',
      typology: '',
      area: 0,
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      status: 'AVAILABLE',
    },
  })

  const onSubmit = async (data: UnitFormValues) => {
    setLoading(true)
    try {
      await onSave({
        ...data,
        projectId,
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Unidade</DialogTitle>
          <DialogDescription>
            Adicione uma nova unidade ao projeto. Preencha os detalhes abaixo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="block"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bloco</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número (Unidade)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Andar</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1º" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="typology"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipologia</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 2 Quartos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartos</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banheiros</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Inicial</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">Disponível</SelectItem>
                      <SelectItem value="RESERVED">Reservado</SelectItem>
                      <SelectItem value="SOLD">Vendido</SelectItem>
                      <SelectItem value="DELIVERED">Entregue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Unidade
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
