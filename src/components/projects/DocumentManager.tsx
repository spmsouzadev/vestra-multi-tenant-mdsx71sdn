import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { DocumentCategory, ProjectDocument } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
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
  Eye,
  History,
  Search,
  Lock,
  Unlock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface DocumentManagerProps {
  projectId: string
}

export function DocumentManager({ projectId }: DocumentManagerProps) {
  const {
    user,
    documents,
    documentLogs,
    addDocument,
    updateDocumentVisibility,
    logDocumentAction,
  } = useAppStore()
  const [selectedCategory, setSelectedCategory] =
    useState<DocumentCategory>('Projetos')
  const [searchTerm, setSearchTerm] = useState('')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [viewingDoc, setViewingDoc] = useState<ProjectDocument | null>(null)
  const [viewingLogs, setViewingLogs] = useState<ProjectDocument | null>(null)
  const { toast } = useToast()

  const categories: DocumentCategory[] = [
    'Projetos',
    'Habite-se',
    'ART',
    'Manuais',
    'Garantias',
    'Vistorias',
  ]

  // Upload Form State
  const [uploadData, setUploadData] = useState<{
    description: string
    tags: string
    visible: boolean
    file: File | null
  }>({
    description: '',
    tags: '',
    visible: false,
    file: null,
  })

  const projectDocuments = documents.filter((d) => d.projectId === projectId)
  const filteredDocuments = projectDocuments.filter(
    (d) =>
      d.category === selectedCategory &&
      (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))),
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setUploadData((prev) => ({ ...prev, file: null }))
      return
    }

    // File Type Validation (Extension Check as backup to accept attribute)
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      toast({
        variant: 'destructive',
        title: 'Tipo de arquivo inválido',
        description: 'Apenas arquivos .pdf, .png e .jpg são permitidos.',
      })
      e.target.value = '' // Reset input
      setUploadData((prev) => ({ ...prev, file: null }))
      return
    }

    // File Size Validation (20MB)
    const maxSize = 20 * 1024 * 1024 // 20MB in bytes
    if (file.size > maxSize) {
      toast({
        variant: 'destructive',
        title: 'Arquivo muito grande',
        description: 'O arquivo deve ter no máximo 20MB.',
      })
      e.target.value = '' // Reset input
      setUploadData((prev) => ({ ...prev, file: null }))
      return
    }

    setUploadData((prev) => ({ ...prev, file }))
  }

  const handleUpload = () => {
    if (!uploadData.file) {
      toast({
        variant: 'destructive',
        title: 'Arquivo ausente',
        description: 'Por favor, selecione um arquivo para enviar.',
      })
      return
    }

    const fileSizeMB = (uploadData.file.size / (1024 * 1024)).toFixed(2)
    const fileType =
      uploadData.file.name.split('.').pop()?.toLowerCase() || 'unknown'

    const newDoc: ProjectDocument = {
      id: Math.random().toString(),
      projectId,
      name: uploadData.file.name,
      description: uploadData.description,
      category: selectedCategory,
      version: 1,
      tags: uploadData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isVisibleToOwners: uploadData.visible,
      url: '#', // Mock URL
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Admin',
      size: `${fileSizeMB} MB`,
      type: fileType,
    }

    addDocument(newDoc)
    setIsUploadOpen(false)
    setUploadData({ description: '', tags: '', visible: false, file: null })
    toast({
      title: 'Documento enviado',
      description: 'O arquivo foi adicionado com sucesso.',
    })
  }

  const handleDownload = (doc: ProjectDocument) => {
    logDocumentAction({
      id: Math.random().toString(),
      documentId: doc.id,
      action: 'DOWNLOAD',
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      timestamp: new Date().toISOString(),
    })
    toast({
      title: 'Download iniciado',
      description: `Baixando ${doc.name}...`,
    })
  }

  const handleView = (doc: ProjectDocument) => {
    logDocumentAction({
      id: Math.random().toString(),
      documentId: doc.id,
      action: 'VIEW',
      userId: user?.id || 'sys',
      userName: user?.name || 'System',
      timestamp: new Date().toISOString(),
    })
    setViewingDoc(doc)
  }

  const handleVisibilityChange = (doc: ProjectDocument, checked: boolean) => {
    updateDocumentVisibility(doc.id, checked)
    toast({
      description: `Visibilidade do documento atualizada.`,
    })
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
              {projectDocuments.filter((d) => d.category === cat).length}
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
              placeholder="Buscar documentos ou tags..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Documento - {selectedCategory}</DialogTitle>
                <DialogDescription>
                  Adicione um novo arquivo a esta pasta.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">Arquivo</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.png,.jpg"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Formatos permitidos: PDF, PNG, JPG (Máx. 20MB)
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Resumo em uma linha do que se trata o arquivo."
                    value={uploadData.description}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    placeholder="arquitetura, revisão, bloco a"
                    value={uploadData.tags}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, tags: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center justify-between border p-3 rounded-md">
                  <div className="space-y-0.5">
                    <Label>Visível aos Proprietários</Label>
                    <p className="text-xs text-muted-foreground">
                      O arquivo ficará disponível no portal do cliente
                    </p>
                  </div>
                  <Switch
                    checked={uploadData.visible}
                    onCheckedChange={(checked) =>
                      setUploadData({ ...uploadData, visible: checked })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpload} disabled={!uploadData.file}>
                  Enviar Arquivo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* File List */}
        <ScrollArea className="flex-1 p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Nome</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>Tags</TableHead>
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
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
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
                          onClick={() => handleView(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                          onClick={() => setViewingLogs(doc)}
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
        </ScrollArea>
      </div>

      {/* Viewer Dialog */}
      <Dialog
        open={!!viewingDoc}
        onOpenChange={(open) => !open && setViewingDoc(null)}
      >
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{viewingDoc?.name}</DialogTitle>
            <DialogDescription>
              {viewingDoc?.description || 'Visualização do documento'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 bg-slate-100 rounded-md flex items-center justify-center border-2 border-dashed border-slate-300">
            <div className="text-center">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                Visualizador de PDF Mock
              </p>
              <p className="text-slate-400 text-sm">{viewingDoc?.name}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Logs Dialog */}
      <Dialog
        open={!!viewingLogs}
        onOpenChange={(open) => !open && setViewingLogs(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Histórico do Documento</DialogTitle>
            <DialogDescription>
              Registro de atividades para {viewingLogs?.name}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {documentLogs
                .filter((log) => log.documentId === viewingLogs?.id)
                .map((log) => (
                  <div
                    key={log.id}
                    className="flex gap-4 text-sm pb-4 border-b last:border-0"
                  >
                    <div className="min-w-24 text-slate-500 text-xs mt-1">
                      {format(new Date(log.timestamp), 'dd/MM/yy HH:mm')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        {log.action}
                        {log.action === 'PERMISSION_CHANGE' && (
                          <Lock className="h-3 w-3" />
                        )}
                        {log.action === 'DOWNLOAD' && (
                          <Download className="h-3 w-3" />
                        )}
                        {log.action === 'VIEW' && <Eye className="h-3 w-3" />}
                        {log.action === 'UPLOAD' && (
                          <Upload className="h-3 w-3" />
                        )}
                      </p>
                      <p className="text-slate-600">{log.userName}</p>
                      {log.details && (
                        <p className="text-xs text-slate-500 mt-1">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
