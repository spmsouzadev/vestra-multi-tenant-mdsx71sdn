import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
    email: z.string().email({ message: 'Endereço de email inválido' }),
    password: z
      .string()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
    confirmPassword: z.string(),
    role: z.enum(['ADMIN', 'OWNER'], {
      required_error: 'Selecione o tipo de conta',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsSuccess(true)

    toast({
      title: 'Conta criada com sucesso!',
      description: 'Agora você pode fazer login com suas credenciais.',
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary animate-fade-in">
        <CardHeader className="space-y-2">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Login
          </Link>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Criar Nova Conta
          </CardTitle>
          <CardDescription>
            Preencha os dados abaixo para se cadastrar na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-8 space-y-6 animate-fade-in">
              <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Cadastro Realizado!
                </h3>
                <p className="text-muted-foreground mt-2">
                  Sua conta foi criada com sucesso. Você já pode acessar a
                  plataforma.
                </p>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link to="/login">Ir para Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="João Silva"
                  disabled={isLoading}
                  className={cn(
                    form.formState.errors.name &&
                      'border-red-500 focus-visible:ring-red-500',
                  )}
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@exemplo.com"
                  disabled={isLoading}
                  className={cn(
                    form.formState.errors.email &&
                      'border-red-500 focus-visible:ring-red-500',
                  )}
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Conta</Label>
                <Select
                  onValueChange={(val) => form.setValue('role', val as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className={cn(
                      form.formState.errors.role &&
                        'border-red-500 focus-visible:ring-red-500',
                    )}
                  >
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Construtora (Admin)</SelectItem>
                    <SelectItem value="OWNER">
                      Proprietário / Cliente
                    </SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.role && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.role.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    disabled={isLoading}
                    className={cn(
                      form.formState.errors.password &&
                        'border-red-500 focus-visible:ring-red-500',
                    )}
                    {...form.register('password')}
                  />
                  {form.formState.errors.password && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    disabled={isLoading}
                    className={cn(
                      form.formState.errors.confirmPassword &&
                        'border-red-500 focus-visible:ring-red-500',
                    )}
                    {...form.register('confirmPassword')}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>
          )}
        </CardContent>
        {!isSuccess && (
          <CardFooter className="justify-center border-t pt-6">
            <p className="text-xs text-center text-muted-foreground">
              Ao criar uma conta, você concorda com nossos Termos de Uso e
              Política de Privacidade.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
