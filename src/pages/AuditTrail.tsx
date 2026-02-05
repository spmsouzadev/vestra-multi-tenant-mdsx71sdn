import useAppStore from '@/stores/useAppStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AuditTrail() {
  const { auditLogs } = useAppStore()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Trilha de Auditoria
        </h1>
        <p className="text-muted-foreground">
          Registro global de atividades na plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Eventos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="pl-6 text-muted-foreground text-sm">
                    <div>{new Date(log.timestamp).toLocaleString()}</div>
                    <div className="text-xs">
                      {formatDistanceToNow(new Date(log.timestamp), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.userName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                      {log.entityType}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-md truncate" title={log.details}>
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
