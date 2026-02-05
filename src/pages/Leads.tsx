import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Lead, LeadStatus } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Navigate } from 'react-router-dom'

export default function Leads() {
  const { user, leads, updateLeadStatus, approveLead } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { toast } = useToast()

  if (!user || user.role !== 'MASTER') {
    return <Navigate to="/dashboard" replace />
  }

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            Novo
          </Badge>
        )
      case 'CONTACTED':
        return (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 hover:bg-amber-200"
          >
            Em Atendimento
          </Badge>
        )
      case 'APPROVED':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Aprovado
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 hover:bg-red-200"
          >
            Rejeitado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleStatusUpdate = (id: string, status: LeadStatus) => {
    updateLeadStatus(id, status)
    toast({
      title: 'Status Atualizado',
      description: `O lead foi marcado como ${status}.`,
    })
    // Close sheet if open and status is rejected or just close for UX
    if (status === 'REJECTED') {
      setIsSheetOpen(false)
    }
  }

  const handleApprove = (id: string) => {
    approveLead(id)
    toast({
      title: 'Lead Aprovado!',
      description: 'Uma nova construtora (Tenant) foi criada com sucesso.',
      variant: 'default',
      className: 'bg-green-500 text-white border-none',
    })
    setIsSheetOpen(false)
  }

  const openDetails = (lead: Lead) => {
    setSelectedLead(lead)
    setIsSheetOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Gestão de Leads (CRM)
          </h1>
          <p className="text-muted-foreground">
            Gerencie as solicitações de contato da Landing Page
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, responsável ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os Status</SelectItem>
            <SelectItem value="NEW">Novo</SelectItem>
            <SelectItem value="CONTACTED">Em Atendimento</SelectItem>
            <SelectItem value="APPROVED">Aprovado</SelectItem>
            <SelectItem value="REJECTED">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Razão Social</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground"
                >
                  Nenhum lead encontrado com os filtros atuais.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    {lead.businessName}
                    <div className="text-xs text-muted-foreground">
                      {lead.cnpj}
                    </div>
                  </TableCell>
                  <TableCell>{lead.managerName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{lead.email}</span>
                      <span className="text-xs text-muted-foreground">
                        {lead.whatsapp}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{lead.location}</TableCell>
                  <TableCell className="capitalize">{lead.plan}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDetails(lead)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Detalhes do Lead</SheetTitle>
            <SheetDescription>
              Informações completas da solicitação
            </SheetDescription>
          </SheetHeader>

          {selectedLead && (
            <div className="py-6 space-y-6">
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedLead.status)}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(selectedLead.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-bold">
                        Tipo
                      </span>
                      <p className="font-medium capitalize">
                        {selectedLead.companyType}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-bold">
                        Unidades/Ano
                      </span>
                      <p className="font-medium">
                        {selectedLead.unitsPerMonth}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Empresa
                    </span>
                    <p className="font-medium">{selectedLead.businessName}</p>
                    <p className="text-sm text-slate-500">
                      {selectedLead.cnpj}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Responsável
                    </span>
                    <p className="font-medium">{selectedLead.managerName}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-bold">
                        Email
                      </span>
                      <p className="text-sm font-medium break-all">
                        {selectedLead.email}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-bold">
                        WhatsApp
                      </span>
                      <p className="text-sm font-medium">
                        {selectedLead.whatsapp}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Localização
                    </span>
                    <p className="font-medium">{selectedLead.location}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">
                      Plano de Interesse
                    </span>
                    <p className="font-medium capitalize text-primary">
                      {selectedLead.plan}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {selectedLead.status !== 'APPROVED' &&
                selectedLead.status !== 'REJECTED' && (
                  <SheetFooter className="flex-col gap-2 sm:flex-col">
                    {selectedLead.status === 'NEW' && (
                      <Button
                        className="w-full bg-amber-500 hover:bg-amber-600"
                        onClick={() =>
                          handleStatusUpdate(selectedLead.id, 'CONTACTED')
                        }
                      >
                        Marcar como Em Atendimento
                      </Button>
                    )}
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() =>
                          handleStatusUpdate(selectedLead.id, 'REJECTED')
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" /> Rejeitar
                      </Button>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(selectedLead.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Aprovar
                      </Button>
                    </div>
                  </SheetFooter>
                )}

              {selectedLead.status === 'APPROVED' && (
                <div className="bg-green-50 p-4 rounded border border-green-200 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">
                    Este lead já foi convertido em Cliente.
                  </p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
