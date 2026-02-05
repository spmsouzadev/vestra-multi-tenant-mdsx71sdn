import { useParams, Link } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  HardHat,
  FileText,
  CheckSquare,
  Shield,
  Activity,
} from 'lucide-react'
import { ProjectTimeline } from '@/components/projects/ProjectTimeline'
import { DocumentManager } from '@/components/projects/DocumentManager'
import { UnitList } from '@/components/projects/UnitList'
import { useState } from 'react'
import { format } from 'date-fns'

export default function ProjectDetails() {
  const { projectId } = useParams()
  const { projects } = useAppStore()

  const project = projects.find((p) => p.id === projectId)
  const [activeTab, setActiveTab] = useState('units')

  if (!project)
    return <div className="p-8 text-center">Projeto não encontrado</div>

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-start gap-4 mb-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link to="/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {project.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {project.city} -{' '}
                  {project.state}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" /> {project.manager}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Entrega Prevista:{' '}
                  {format(new Date(project.deliveryDate), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="text-lg py-1 px-4 border-slate-300"
              >
                {project.completionPercentage}% Concluído
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Component */}
      <Card>
        <CardContent className="pt-6">
          <ProjectTimeline currentPhase={project.phase} />
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Tabs
        defaultValue="units"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-slate-100">
          <TabsTrigger value="units" className="py-2 gap-2">
            <HardHat className="h-4 w-4" /> Unidades
          </TabsTrigger>
          <TabsTrigger value="documents" className="py-2 gap-2">
            <FileText className="h-4 w-4" /> Documentos
          </TabsTrigger>
          <TabsTrigger value="inspections" className="py-2 gap-2">
            <CheckSquare className="h-4 w-4" /> Vistorias
          </TabsTrigger>
          <TabsTrigger value="warranties" className="py-2 gap-2">
            <Shield className="h-4 w-4" /> Garantias
          </TabsTrigger>
          <TabsTrigger value="reports" className="py-2 gap-2">
            <Activity className="h-4 w-4" /> Relatórios
          </TabsTrigger>
        </TabsList>

        {/* Units Tab */}
        <TabsContent value="units" className="space-y-4 animate-fade-in">
          <UnitList projectId={project.id} />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="animate-fade-in">
          <DocumentManager projectId={project.id} />
        </TabsContent>

        {/* Placeholders for other tabs */}
        <TabsContent value="inspections" className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <CheckSquare className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">
              Módulo de Vistorias
            </h3>
            <p className="text-slate-500">
              Em breve você poderá gerenciar as vistorias de entrega aqui.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="warranties" className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <Shield className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">
              Módulo de Garantias
            </h3>
            <p className="text-slate-500">
              Em breve você poderá gerenciar os chamados de garantia aqui.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <Activity className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">
              Relatórios Gerenciais
            </h3>
            <p className="text-slate-500">
              Em breve você terá acesso a dashboards avançados aqui.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
