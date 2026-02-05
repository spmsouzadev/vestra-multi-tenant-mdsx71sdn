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
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Endereço de email inválido' }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)

    toast({
      title: 'Email enviado',
      description: `Enviamos as instruções de recuperação para ${data.email}`,
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
            Recuperar Senha
          </CardTitle>
          <CardDescription>
            Digite seu email para receber um link de redefinição de senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">
                Verifique seu email
              </h3>
              <p className="text-sm text-muted-foreground">
                Enviamos um link de recuperação para{' '}
                <strong>{form.getValues().email}</strong>. Por favor, verifique
                sua caixa de entrada e spam.
              </p>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link to="/login">Voltar para Login</Link>
              </Button>
            </div>
          ) : (
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </Button>
            </form>
          )}
        </CardContent>
        {!isSubmitted && (
          <CardFooter className="justify-center border-t pt-6">
            <p className="text-xs text-center text-muted-foreground">
              Se você não tem uma conta, entre em contato com o administrador.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
