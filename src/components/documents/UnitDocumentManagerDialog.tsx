import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Unit, ProjectDocument } from '@/types'
import { documentService } from '@/services/documentService'
import { DocumentUploadDialog } from './DocumentUploadDialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Upload, Download, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'

interface UnitDocumentManagerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: Unit | null
  projectId: string
}

export function UnitDocumentManagerDialog({
  open,
  onOpenChange,
  unit,
  projectId,
}: UnitDocumentManagerDialogProps) {
  const { user } = useAppStore()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<ProjectDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  const loadDocs = async () => {
    if (!unit) return
    setLoading(true)
    try {
      const docs = await documentService.getDocuments(projectId, unit.id)
      setDocuments(docs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && unit) {
      loadDocs()
    }
  }, [open, unit])

  const handleUpload = async (file: File, meta: any) => {
    await documentService.uploadDocument(file, meta)
    await loadDocs()
    toast({ title: 'Sucesso', description: 'Documento adicionado à unidade.' })
  }

  const handleDownload = async (doc: ProjectDocument) => {
    try {
      const path = await documentService.getLatestVersionPath(doc.id)
      if (path) {
        const url = await documentService.getDownloadUrl(path)
        if (url) window.open(url, '_blank')
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível baixar o arquivo.',
      })
    }
  }

  if (!unit || !user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Documentos da Unidade {unit.number}</DialogTitle>
          <DialogDescription>
            Gerencie arquivos específicos desta unidade (Contratos, Plantas,
            etc).
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Novo Documento
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="border rounded-md max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Visibilidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center h-24 text-muted-foreground"
                    >
                      Nenhum documento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            doc.visibility === 'INTERNAL'
                              ? 'bg-slate-500'
                              : 'bg-green-500'
                          }
                        >
                          {doc.visibility === 'INTERNAL'
                            ? 'Interno'
                            : doc.visibility === 'SHARED'
                              ? 'Compartilhado'
                              : 'Público'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <DocumentUploadDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          projectId={projectId}
          unitId={unit.id}
          userId={user.id}
          onUpload={handleUpload}
          categories={[
            'Projetos',
            'Habite-se',
            'ART',
            'Manuais',
            'Garantias',
            'Vistorias',
          ]}
        />
      </DialogContent>
    </Dialog>
  )
}
