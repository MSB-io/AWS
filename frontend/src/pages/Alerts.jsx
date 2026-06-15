import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const SEVERITY_CONFIG = {
  critical: { variant: 'destructive', icon: ShieldAlert, label: 'Critical', color: 'text-red-500' },
  high: { variant: 'destructive', icon: AlertCircle, label: 'High', color: 'text-orange-500' },
  medium: { variant: 'default', icon: AlertTriangle, label: 'Medium', color: 'text-yellow-500' },
  low: { variant: 'secondary', icon: Info, label: 'Low', color: 'text-blue-500' },
}

const INITIAL_ALERTS = [
  { id: 1, type: 'performance', message: 'EC2 CPU utilization exceeded 85% threshold for 5 minutes. Consider scaling.', severity: 'high', resolved: false, source: 'CloudWatch', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: 2, type: 'security', message: 'Unusual login attempt detected from IP 203.45.67.89. Login blocked by IAM policy.', severity: 'critical', resolved: false, source: 'AWS IAM', created_at: new Date(Date.now() - 35 * 60000).toISOString() },
  { id: 3, type: 'event', message: 'IPL Final tickets are 91% sold. Only 3,000 tickets remaining.', severity: 'medium', resolved: false, source: 'FanEngage Platform', created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 4, type: 'system', message: 'RDS automated backup completed successfully. Snapshot stored in S3.', severity: 'low', resolved: true, source: 'AWS RDS', created_at: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: 5, type: 'performance', message: 'Memory usage on EC2 reached 72%. Monitor for potential issues.', severity: 'medium', resolved: false, source: 'CloudWatch', created_at: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: 6, type: 'system', message: 'S3 backup script executed. Daily database backup uploaded successfully.', severity: 'low', resolved: true, source: 'Cron Job', created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
]

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function AlertsPage() {
  const { user } = useAuth()
  const isManager = ['manager', 'admin'].includes(user?.role)
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [filter, setFilter] = useState('all') // all | unresolved | resolved

  const displayed = alerts.filter(a => {
    if (filter === 'unresolved') return !a.resolved
    if (filter === 'resolved') return a.resolved
    return true
  })

  const handleResolve = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a))
    toast.success('Alert marked as resolved')
  }

  const unresolved = alerts.filter(a => !a.resolved).length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="size-5 text-primary" />
            <h1 className="text-xl font-bold">Alerts</h1>
            {unresolved > 0 && <Badge variant="destructive">{unresolved}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">System, security and event notifications</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 rounded-lg border p-1 bg-muted/30">
          {[['all', 'All'], ['unresolved', 'Active'], ['resolved', 'Resolved']].map(([val, lbl]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                filter === val ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { sev: 'critical', count: alerts.filter(a => a.severity === 'critical' && !a.resolved).length },
          { sev: 'high', count: alerts.filter(a => a.severity === 'high' && !a.resolved).length },
          { sev: 'medium', count: alerts.filter(a => a.severity === 'medium' && !a.resolved).length },
          { sev: 'low', count: alerts.filter(a => a.severity === 'low').length },
        ].map(({ sev, count }) => {
          const cfg = SEVERITY_CONFIG[sev]
          const Icon = cfg.icon
          return (
            <Card key={sev} className="hover:shadow-sm transition-shadow cursor-pointer" onClick={() => setFilter('all')}>
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <Icon className={cn('size-4 shrink-0', cfg.color)} />
                <div>
                  <p className="text-lg font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{sev}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alert List */}
      <div className="flex flex-col gap-3">
        {displayed.map(alert => {
          const cfg = SEVERITY_CONFIG[alert.severity]
          const Icon = cfg.icon
          return (
            <Card key={alert.id} className={cn('transition-opacity', alert.resolved && 'opacity-60')}>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Icon className={cn('size-4 shrink-0 mt-0.5', cfg.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={cfg.variant} className="text-[10px]">{cfg.label}</Badge>
                      <Badge variant="outline" className="text-[10px] capitalize">{alert.type}</Badge>
                      <span className="text-xs text-muted-foreground">{alert.source}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{timeAgo(alert.created_at)}</span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    {alert.resolved && (
                      <div className="flex items-center gap-1 mt-2 text-green-600">
                        <CheckCircle className="size-3" />
                        <span className="text-xs font-medium">Resolved</span>
                      </div>
                    )}
                  </div>
                  {isManager && !alert.resolved && (
                    <Button variant="outline" size="sm" className="shrink-0 h-7 text-xs" onClick={() => handleResolve(alert.id)}>
                      Resolve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
        {displayed.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground text-sm">
              No alerts in this category
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
