import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Download, Upload, History } from 'lucide-react'
import { DocumentVersion } from '@/types'
import { documentService } from '@/services/documentService'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface DocumentVersionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentId: string
  currentVersion: number
  onVersionUpload: (file: File) => Promise<void>
}

export function DocumentVersionsDialog({
  open,
  onOpenChange,
  documentId,
  currentVersion,
  onVersionUpload,
}: DocumentVersionsDialogProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const loadVersions = async () => {
    if (!documentId) return
    setLoading(true)
    try {
      const data = await documentService.getVersions(documentId)
      setVersions(data)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar histórico.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) loadVersions()
  }, [open, documentId])

  const handleDownload = async (path: string) => {
    try {
      const url = await documentService.getDownloadUrl(path)
      if (url) window.open(url, '_blank')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao gerar link.',
      })
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await onVersionUpload(file)
      await loadVersions()
      toast({ title: 'Sucesso', description: 'Nova versão enviada.' })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha no envio.',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Histórico de Versões</DialogTitle>
          <DialogDescription>
            Gerencie as versões deste documento.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-2 border-b">
          <div className="text-sm font-medium">
            Versão Atual: v{currentVersion}.0
          </div>
          <div className="relative">
            <Input
              type="file"
              id="version-upload"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <Button asChild disabled={uploading} variant="outline" size="sm">
              <label htmlFor="version-upload" className="cursor-pointer">
                {uploading ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-3 w-3" />
                )}
                Nova Versão
              </label>
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {versions.map((ver) => (
                <div
                  key={ver.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded border"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">
                        v{ver.versionNumber}.0
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(ver.createdAt), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {ver.fileName} ({(ver.fileSize / 1024 / 1024).toFixed(2)}{' '}
                      MB)
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(ver.filePath)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
