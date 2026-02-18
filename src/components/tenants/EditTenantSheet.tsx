import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Tenant } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const tenantFormSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  adminEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  primaryColor: z.string().optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED']),
  plan: z.string().optional(),
})

type TenantFormValues = z.infer<typeof tenantFormSchema>

interface EditTenantSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: Tenant
  onSave: (id: string, data: Partial<Tenant>) => Promise<void>
}

export function EditTenantSheet({
  open,
  onOpenChange,
  tenant,
  onSave,
}: EditTenantSheetProps) {
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: '',
      cnpj: '',
      adminEmail: '',
      primaryColor: '#000000',
      status: 'ACTIVE',
      plan: 'Standard',
    },
  })

  useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name,
        cnpj: tenant.cnpj,
        adminEmail: tenant.adminEmail || '',
        primaryColor: tenant.primaryColor || '#000000',
        status: tenant.status,
        plan: tenant.plan || 'Standard',
      })
    }
  }, [tenant, form])

  const onSubmit = async (data: TenantFormValues) => {
    await onSave(tenant.id, {
      ...data,
      adminEmail: data.adminEmail || undefined,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Construtora</SheetTitle>
          <SheetDescription>
            Atualize as informações e plano da construtora.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">Razão Social</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" {...form.register('cnpj')} />
            {form.formState.errors.cnpj && (
              <p className="text-xs text-red-500">
                {form.formState.errors.cnpj.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email do Administrador</Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="admin@construtora.com"
              {...form.register('adminEmail')}
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Usado para login e recuperação de senha.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(val: any) => form.setValue('status', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="SUSPENDED">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plano de Assinatura</Label>
              <Select
                value={form.watch('plan')}
                onValueChange={(val) => form.setValue('plan', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryColor">Cor da Marca</Label>
            <div className="flex items-center gap-2">
              <Input
                id="primaryColor"
                type="color"
                className="w-16 h-10 p-1 cursor-pointer"
                {...form.register('primaryColor')}
              />
              <span className="text-sm font-mono text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                {form.watch('primaryColor')}
              </span>
            </div>
          </div>

          <SheetFooter className="mt-8">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
