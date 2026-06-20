import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Trophy, CalendarDays, Users, Zap, TrendingUp, Star, Activity, Loader2 } from 'lucide-react'
import { getEvents, getAnalyticsSummary } from '@/api'

const STATUS_COLORS = { upcoming: 'secondary', live: 'destructive', completed: 'default', cancelled: 'outline' }

function StatCard({ icon: Icon, label, value, sub, color = 'text-primary' }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`size-9 rounded-lg bg-muted flex items-center justify-center ${color}`}>
            <Icon className="size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [summary, setSummary] = useState({
    totalFans: 0,
    totalEvents: 0,
    liveEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [eventsRes, summaryRes] = await Promise.all([
          getEvents(),
          getAnalyticsSummary()
        ])
        setEvents(eventsRes.data)
        setSummary(summaryRes.data)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    )
  }

  const liveCount = events.filter(e => e.status === 'live').length

  // Helper for formatting ticket volume representation
  const formatTickets = (count) => {
    if (count >= 100000) {
      return `${(count / 100000).toFixed(1)}L`
    }
    return count.toLocaleString('en-IN')
  }

  // Helper for formatting revenue
  const formatRevenue = (rev) => {
    const val = parseFloat(rev)
    if (isNaN(val)) return '₹0'
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)}Cr`
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`
    }
    return `₹${val.toLocaleString('en-IN')}`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="size-5 text-primary" />
          <h1 className="text-xl font-bold">Dashboard</h1>
          {liveCount > 0 && <Badge variant="destructive" className="animate-pulse">{liveCount} LIVE</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span> ·{' '}
          <Badge variant="outline" className="text-xs">{user?.role}</Badge>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Total Events" value={summary.totalEvents} sub="Across all sports" color="text-blue-500" />
        <StatCard icon={Zap} label="Live Now" value={summary.liveEvents} sub="Active matches" color="text-red-500" />
        <StatCard icon={Users} label="Registered Fans" value={summary.totalFans.toLocaleString('en-IN')} sub="Active accounts" color="text-green-500" />
        <StatCard icon={TrendingUp} label="Tickets Sold" value={formatTickets(summary.totalTicketsSold)} sub={`${formatRevenue(summary.totalRevenue)} revenue`} color="text-orange-500" />
      </div>

      <Separator />

      {/* Upcoming & Live Events */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="size-4 text-primary" />
          <h2 className="text-base font-semibold">Upcoming & Live Events</h2>
        </div>
        <div className="flex flex-col gap-3">
          {events.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No events currently configured.
              </CardContent>
            </Card>
          ) : (
            events.slice(0, 5).map(event => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap md:flex-nowrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-sm truncate">{event.title}</p>
                        <Badge variant={STATUS_COLORS[event.status]} className="text-[10px] shrink-0">
                          {event.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{event.venue}</p>
                      {event.home_team && (
                        <p className="text-xs font-medium mt-1 text-foreground">{event.home_team} vs {event.away_team}</p>
                      )}
                    </div>
                    <div className="text-left md:text-right shrink-0">
                      <Badge variant="outline" className="text-xs mb-1">{event.sport}</Badge>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {event.tickets_sold?.toLocaleString()} / {event.capacity?.toLocaleString()} seats
                      </p>
                    </div>
                  </div>

                  {/* Occupancy bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Occupancy</span>
                      <span>{event.capacity ? Math.round((event.tickets_sold / event.capacity) * 100) : 0}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${event.capacity ? (event.tickets_sold / event.capacity) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Cloud Infrastructure Badge */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Star className="size-4 text-primary" />
            AWS Infrastructure Status
          </CardTitle>
          <CardDescription className="text-xs">All systems operational</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'EC2 Instance', status: 'Running', color: 'text-green-500' },
              { label: 'RDS MySQL', status: 'Available', color: 'text-green-500' },
              { label: 'S3 Bucket', status: 'Active', color: 'text-green-500' },
              { label: 'CloudWatch', status: 'Monitoring', color: 'text-blue-500' },
            ].map(s => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                <div className="flex items-center gap-1">
                  <span className={`size-1.5 rounded-full bg-current ${s.color}`} />
                  <p className={`text-xs font-semibold ${s.color}`}>{s.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
