import useAppStore from '@/stores/useAppStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, HardHat, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Projects() {
  const { getFilteredProjects } = useAppStore()
  const projects = getFilteredProjects()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus empreendimentos imobiliários
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Novo Projeto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-56 group">
              <img
                src={project.imageUrl}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-slate-900/80 hover:bg-slate-900 border-0">
                  {project.status}
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold text-lg">
                    {project.completionPercentage}%
                  </span>
                  <span className="text-xs uppercase tracking-wide opacity-80">
                    Concluído
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/30 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${project.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {project.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs uppercase">
                    Entrega
                  </span>
                  <div className="flex items-center gap-1.5 font-medium mt-0.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {new Date(project.deliveryDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs uppercase">
                    Unidades
                  </span>
                  <div className="flex items-center gap-1.5 font-medium mt-0.5">
                    <HardHat className="h-3.5 w-3.5 text-muted-foreground" />
                    {project.totalUnits} Total
                  </div>
                </div>
              </div>
              <Button className="w-full" asChild variant="outline">
                <Link to={`/projects/${project.id}`}>Gerenciar Unidades</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
