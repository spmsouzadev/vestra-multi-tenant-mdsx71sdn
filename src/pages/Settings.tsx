import useAppStore from '@/stores/useAppStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WarrantyCategoriesSettings } from '@/components/settings/WarrantyCategoriesSettings'
import { Building, User, Shield } from 'lucide-react'
import { Navigate } from 'react-router-dom'

export default function Settings() {
  const { user } = useAppStore()

  if (!user) return <Navigate to="/login" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie sua conta e preferências da empresa.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Perfil
          </TabsTrigger>
          {(user.role === 'ADMIN' || user.role === 'MASTER') && (
            <TabsTrigger value="company" className="gap-2">
              <Building className="h-4 w-4" /> Empresa
            </TabsTrigger>
          )}
          {(user.role === 'ADMIN' || user.role === 'MASTER') && (
            <TabsTrigger value="warranties" className="gap-2">
              <Shield className="h-4 w-4" /> Garantias (NBR 15575)
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Usuário</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-bold text-slate-500">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-lg">{user.name}</p>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm bg-slate-100 inline-block px-2 py-1 rounded mt-1">
                    {user.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Informações do Tenant.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configurações da empresa indisponíveis nesta versão demo.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranties">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Garantias</CardTitle>
              <CardDescription>
                Gerencie os templates de garantia aplicados aos novos projetos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WarrantyCategoriesSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
