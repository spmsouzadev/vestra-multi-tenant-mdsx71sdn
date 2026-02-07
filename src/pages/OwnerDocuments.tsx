import { useState, useEffect } from 'react'
import useAppStore from '@/stores/useAppStore'
import { documentService } from '@/services/documentService'
import { ProjectDocument } from '@/types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Search, FileText, Loader2, Filter } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export default function OwnerDocuments() {
  const { user, units } = useAppStore()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<ProjectDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchDocs = async () => {
      setLoading(true)
      try {
        // Determine owner's units
        // In mock: unit.ownerId === user.id
        // In real: fetching logic in service
        const myUnitIds = units
          .filter((u) => u.ownerId === user.id)
          .map((u) => u.id)

        const docs = await documentService.getOwnerDocuments(myUnitIds)
        setDocuments(docs)
      } catch (err) {
        console.error(err)
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao carregar documentos.',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDocs()
  }, [user, units])

  const filteredDocs = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDownload = async (doc: ProjectDocument) => {
    try {
      const path = await documentService.getLatestVersionPath(doc.id)
      if (path) {
        const url = await documentService.getDownloadUrl(path)
        if (url) window.open(url, '_blank')
      } else {
        toast({
          variant: 'destructive',
          description: 'Arquivo não disponível.',
        })
      }
    } catch (e) {
      toast({ variant: 'destructive', description: 'Erro ao baixar arquivo.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Meus Documentos</h1>
        <p className="text-muted-foreground">
          Acesse contratos, plantas e manuais das suas unidades.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filtros
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-32 text-muted-foreground"
                    >
                      Nenhum documento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div>{doc.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {doc.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.category}</Badge>
                      </TableCell>
                      <TableCell>{doc.tags[0] || '-'}</TableCell>
                      <TableCell>
                        {format(new Date(doc.createdAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleDownload(doc)}>
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
