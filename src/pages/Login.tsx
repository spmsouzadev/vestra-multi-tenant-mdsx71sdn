import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, Navigate } from 'react-router-dom'
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
import useAppStore from '@/stores/useAppStore'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import logoVestra from '@/assets/logo_apenas_imagem-aa4c3.png'

const loginSchema = z.object({
  email: z.string().email({ message: 'Endereço de email inválido' }),
  password: z.string().min(1, { message: 'A senha é obrigatória' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const { login, user } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const success = await login(data.email, data.password)
      if (!success) {
        toast({
          variant: 'destructive',
          title: 'Erro de autenticação',
          description: 'Credenciais inválidas. Verifique seu email e senha.',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no sistema',
        description: 'Ocorreu um erro ao tentar fazer login. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary animate-fade-in-up">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-2 flex justify-center">
            <img
              src={logoVestra}
              alt="VESTRA Logo"
              className="h-16 w-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">
            VESTRA
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={cn(
                    form.formState.errors.password &&
                      'border-red-500 focus-visible:ring-red-500',
                  )}
                  {...form.register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Esconder senha' : 'Mostrar senha'}
                  </span>
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-primary font-semibold hover:underline"
            >
              Criar novo cadastro
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
