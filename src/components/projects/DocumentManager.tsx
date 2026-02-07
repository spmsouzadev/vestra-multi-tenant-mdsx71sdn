import { useState, useEffect } from 'react'
import useAppStore from '@/stores/useAppStore'
import { DocumentCategory, ProjectDocument, DocumentVisibility } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Folder,
  FileText,
  Upload,
  Download,
  History,
  Search,
  Lock,
  Unlock,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { documentService } from '@/services/documentService'
import { DocumentUploadDialog } from '@/components/documents/DocumentUploadDialog'
import { DocumentVersionsDialog } from '@/components/documents/DocumentVersionsDialog'
import { Switch } from '@/components/ui/switch'

interface DocumentManagerProps {
  projectId: string
}

export function DocumentManager({ projectId }: DocumentManagerProps) {
  const { user } = useAppStore()
  const [selectedCategory, setSelectedCategory] =
    useState<DocumentCategory>('Projetos')
  const [searchTerm, setSearchTerm] = useState('')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [versionDialogDoc, setVersionDialogDoc] =
    useState<ProjectDocument | null>(null)
  const { toast } = useToast()

  const [documents, setDocuments] = useState<ProjectDocument[]>([])
  const [loading, setLoading] = useState(false)

  const categories: DocumentCategory[] = [
    'Projetos',
    'Habite-se',
    'ART',
    'Manuais',
    'Garantias',
    'Vistorias',
  ]

  const loadDocuments = async () => {
    // Basic UUID validation before calling service
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!projectId || !uuidRegex.test(projectId)) {
      console.warn('Invalid Project ID for DocumentManager:', projectId)
      // We don't error out, just don't fetch. Service handles it too, but saving a call.
      setDocuments([])
      return
    }

    setLoading(true)
    try {
      const docs = await documentService.getDocuments(projectId)
      setDocuments(docs)
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar documentos.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [projectId])

  const filteredDocuments = documents.filter(
    (d) =>
      d.category === selectedCategory &&
      d.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUpload = async (file: File, meta: any) => {
    await documentService.uploadDocument(file, meta)
    await loadDocuments()
    toast({
      title: 'Upload concluído',
      description: 'Documento adicionado com sucesso.',
    })
  }

  const handleVersionUpload = async (file: File) => {
    if (!versionDialogDoc || !user) return
    await documentService.uploadNewVersion(
      versionDialogDoc.id,
      file,
      user.id,
      versionDialogDoc.version,
    )
    await loadDocuments()
    // Refresh version dialog if open?
    // Actually the dialog reloads itself when open.
  }

  const handleDownload = async (doc: ProjectDocument) => {
    try {
      const path = await documentService.getLatestVersionPath(doc.id)
      if (path) {
        const url = await documentService.getDownloadUrl(path)
        if (url) window.open(url, '_blank')
      } else {
        toast({
          variant: 'destructive',
          description: 'Arquivo não encontrado.',
        })
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao baixar arquivo.',
      })
    }
  }

  const handleVisibilityChange = async (
    doc: ProjectDocument,
    checked: boolean,
  ) => {
    // Toggle between INTERNAL and SHARED/PUBLIC.
    // Simplified logic: If becoming visible -> SHARED. If hiding -> INTERNAL.
    const newVisibility: DocumentVisibility = checked ? 'SHARED' : 'INTERNAL'
    try {
      await documentService.updateVisibility(doc.id, newVisibility)
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id
            ? { ...d, visibility: newVisibility, isVisibleToOwners: checked }
            : d,
        ),
      )
      toast({ description: `Visibilidade alterada para ${newVisibility}` })
    } catch (e) {
      toast({
        variant: 'destructive',
        description: 'Erro ao alterar visibilidade',
      })
    }
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden bg-white">
      {/* Sidebar Categories */}
      <div className="w-64 bg-slate-50 border-r p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-sm text-slate-500 mb-2 uppercase tracking-wider">
          Pastas
        </h3>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              selectedCategory === cat
                ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )}
          >
            <Folder
              className={cn(
                'h-4 w-4',
                selectedCategory === cat
                  ? 'text-primary fill-primary/20'
                  : 'text-slate-400',
              )}
            />
            {cat}
            <span className="ml-auto text-xs text-slate-400">
              {documents.filter((d) => d.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar documentos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>

        {/* File List */}
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Carregando...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Nome</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Visibilidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Nenhum documento encontrado nesta pasta.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="group">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-red-50 text-red-600 flex items-center justify-center">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span
                              className="truncate max-w-[200px]"
                              title={doc.name}
                            >
                              {doc.name}
                            </span>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              <span>{doc.size}</span>
                              {doc.description && (
                                <span
                                  className="truncate max-w-[150px] border-l pl-2"
                                  title={doc.description}
                                >
                                  {doc.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">v{doc.version}.0</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(doc.createdAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={doc.isVisibleToOwners}
                            onCheckedChange={(checked) =>
                              handleVisibilityChange(doc, checked)
                            }
                            className="scale-75"
                          />
                          {doc.isVisibleToOwners ? (
                            <Unlock className="h-3 w-3 text-green-500" />
                          ) : (
                            <Lock className="h-3 w-3 text-slate-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setVersionDialogDoc(doc)}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </div>

      {user && (
        <DocumentUploadDialog
          open={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          projectId={projectId}
          userId={user.id}
          onUpload={handleUpload}
          categories={categories}
        />
      )}

      {versionDialogDoc && (
        <DocumentVersionsDialog
          open={!!versionDialogDoc}
          onOpenChange={(o) => !o && setVersionDialogDoc(null)}
          documentId={versionDialogDoc.id}
          currentVersion={versionDialogDoc.version}
          onVersionUpload={handleVersionUpload}
        />
      )}
    </div>
  )
}
