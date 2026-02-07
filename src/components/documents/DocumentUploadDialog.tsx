import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Upload } from 'lucide-react'
import { DocumentCategory, DocumentVisibility } from '@/types'

interface DocumentUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  unitId?: string
  userId: string
  onUpload: (file: File, meta: any) => Promise<void>
  categories: DocumentCategory[]
}

export function DocumentUploadDialog({
  open,
  onOpenChange,
  projectId,
  unitId,
  userId,
  onUpload,
  categories,
}: DocumentUploadDialogProps) {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>(categories[0] || 'Projetos')
  const [visibility, setVisibility] = useState<DocumentVisibility>('INTERNAL')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    try {
      await onUpload(file, {
        projectId,
        unitId,
        title: file.name,
        description,
        category,
        visibility,
        userId,
      })
      onOpenChange(false)
      // Reset form
      setFile(null)
      setDescription('')
      setVisibility('INTERNAL')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload de Documento</DialogTitle>
          <DialogDescription>
            {unitId
              ? 'Adicionar documento para a unidade.'
              : 'Adicionar documento ao projeto.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Arquivo (PDF, PNG, JPG - Máx 20MB)</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o conteúdo do documento..."
            />
          </div>

          <div className="grid gap-2">
            <Label>Visibilidade</Label>
            <RadioGroup
              value={visibility}
              onValueChange={(v) => setVisibility(v as DocumentVisibility)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INTERNAL" id="internal" />
                <Label htmlFor="internal" className="font-normal">
                  Interno (Apenas Admin/Master)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SHARED" id="shared" />
                <Label htmlFor="shared" className="font-normal">
                  Compartilhado (Visível ao Proprietário)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PUBLIC" id="public" />
                <Label htmlFor="public" className="font-normal">
                  Público (Disponível para Download no Portal)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!file || loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
