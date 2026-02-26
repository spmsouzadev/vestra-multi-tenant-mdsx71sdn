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
import { Building, User, Shield, ShieldCheck } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function Settings() {
  const { user, consents, updateConsents } = useAppStore()

  if (!user) return <Navigate to="/login" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie sua conta, preferências de privacidade e da empresa.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="overflow-x-auto flex-nowrap justify-start w-full sm:w-auto h-auto p-1">
          <TabsTrigger value="profile" className="gap-2 py-2 shrink-0">
            <User className="h-4 w-4" /> Perfil
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2 py-2 shrink-0">
            <ShieldCheck className="h-4 w-4" /> Privacidade (LGPD)
          </TabsTrigger>
          {(user.role === 'ADMIN' || user.role === 'MASTER') && (
            <TabsTrigger value="company" className="gap-2 py-2 shrink-0">
              <Building className="h-4 w-4" /> Empresa
            </TabsTrigger>
          )}
          {(user.role === 'ADMIN' || user.role === 'MASTER') && (
            <TabsTrigger value="warranties" className="gap-2 py-2 shrink-0">
              <Shield className="h-4 w-4" /> Garantias (NBR 15575)
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="animate-fade-in">
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

        <TabsContent value="privacy" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Privacidade e Consentimentos</CardTitle>
              <CardDescription>
                Gerencie como a VESTRA e nossos parceiros processam seus dados,
                em conformidade com a Lei Geral de Proteção de Dados (LGPD).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between gap-4 py-2 border-b">
                <div className="space-y-1">
                  <Label className="text-base">Essenciais (Obrigatório)</Label>
                  <p className="text-sm text-muted-foreground">
                    Necessários para o funcionamento básico da plataforma,
                    autenticação, segurança e cumprimento das obrigações legais.
                    Não podem ser desativados.
                  </p>
                </div>
                <Switch checked disabled />
              </div>

              <div className="flex items-start justify-between gap-4 py-2 border-b">
                <div className="space-y-1">
                  <Label className="text-base">Análise e Tráfego</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitem entender como você interage com a plataforma,
                    garantindo a melhoria contínua da experiência de uso e
                    estabilidade do sistema.
                  </p>
                </div>
                <Switch
                  checked={consents.analytics}
                  onCheckedChange={(val) => updateConsents({ analytics: val })}
                />
              </div>

              <div className="flex items-start justify-between gap-4 py-2">
                <div className="space-y-1">
                  <Label className="text-base">Marketing e Comunicações</Label>
                  <p className="text-sm text-muted-foreground">
                    Usados para o envio de ofertas personalizadas, novidades do
                    mercado imobiliário e comunicação de parceiros autorizados.
                  </p>
                </div>
                <Switch
                  checked={consents.marketing}
                  onCheckedChange={(val) => updateConsents({ marketing: val })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="animate-fade-in">
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

        <TabsContent value="warranties" className="animate-fade-in">
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
