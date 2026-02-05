import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import useAppStore from '@/stores/useAppStore'
import { Building2 } from 'lucide-react'
import { mockUsers } from '@/data/mockData'

export default function Login() {
  const { login } = useAppStore()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground mb-4">
            <Building2 className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            SaaS Construtora
          </CardTitle>
          <CardDescription>
            Selecione um perfil para acessar a demonstração
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {mockUsers.map((u) => (
            <Button
              key={u.id}
              onClick={() => login(u.email)}
              variant="outline"
              className="h-auto py-4 flex flex-col items-start gap-1 hover:border-primary hover:bg-slate-50"
            >
              <div className="font-semibold text-lg">{u.name}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {u.role}
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
