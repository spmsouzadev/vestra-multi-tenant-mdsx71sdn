import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Tenant } from '@/types'
import { tenantService } from '@/services/tenantService'
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
import { Loader2, Upload, Building, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const tenantFormSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  adminEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
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
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: '',
      cnpj: '',
      adminEmail: '',
      phone: '',
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
        phone: tenant.phone || '',
        primaryColor: tenant.primaryColor || '#000000',
        status: tenant.status,
        plan: tenant.plan || 'Standard',
      })
      setPreviewUrl(tenant.logoUrl || null)
      setSelectedFile(null)
    }
  }, [tenant, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Arquivo inválido',
          description: 'Por favor selecione uma imagem.',
        })
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeLogo = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: TenantFormValues) => {
    try {
      let logoUrl = tenant.logoUrl

      // Upload logo if selected
      if (selectedFile) {
        try {
          logoUrl = await tenantService.uploadTenantLogo(
            tenant.id,
            selectedFile,
          )
        } catch (error) {
          console.error('Error uploading logo:', error)
          toast({
            variant: 'destructive',
            title: 'Erro no upload',
            description: 'Não foi possível fazer o upload da logo.',
          })
          return // Stop execution if upload fails
        }
      } else if (previewUrl === null && tenant.logoUrl) {
        // Logic to remove logo if needed (not strictly in requirements but good for UX)
        // For now, we assume if previewUrl is null and user explicitly removed it, we might want to clear it
        // But let's stick to simple replacement logic
        logoUrl = undefined
      }

      await onSave(tenant.id, {
        ...data,
        adminEmail: data.adminEmail || undefined,
        phone: data.phone || undefined,
        logoUrl: logoUrl, // Include the new or existing logo URL
      })

      onOpenChange(false)
    } catch (error) {
      // Error handling is done in the parent component or via onSave promise rejection
      console.error(error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Construtora</SheetTitle>
          <SheetDescription>
            Atualize as informações e visual da construtora.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
          <div className="space-y-2">
            <Label>Logo da Empresa</Label>
            <div className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50">
              <div className="relative group shrink-0">
                {previewUrl ? (
                  <div className="h-20 w-20 rounded-md border bg-white flex items-center justify-center overflow-hidden relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-md border bg-white flex items-center justify-center text-muted-foreground">
                    <Building className="h-8 w-8 opacity-20" />
                  </div>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-xs text-muted-foreground">
                  Selecione uma imagem (JPG, PNG ou SVG) para personalizar o
                  ambiente.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={triggerFileInput}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Selecionar Imagem
                </Button>
              </div>
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email (Login)</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@email.com"
                {...form.register('adminEmail')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                {...form.register('phone')}
              />
            </div>
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
