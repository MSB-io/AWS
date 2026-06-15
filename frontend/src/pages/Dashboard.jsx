import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Trophy, CalendarDays, Users, Zap, TrendingUp, Star, Activity } from 'lucide-react'

// Mock data displayed when not connected to backend
const MOCK_UPCOMING = [
  { id: 1, title: 'IPL 2025 Final', sport: 'Cricket', venue: 'Wankhede Stadium, Mumbai', event_date: '2025-05-25', status: 'upcoming', home_team: 'MI', away_team: 'CSK', tickets_sold: 32000, capacity: 35000 },
  { id: 2, title: 'ISL Semi-Final', sport: 'Football', venue: 'Salt Lake Stadium, Kolkata', event_date: '2025-06-10', status: 'live', home_team: 'ATKMB', away_team: 'MCFC', tickets_sold: 65000, capacity: 68000 },
  { id: 3, title: 'Pro Kabaddi League', sport: 'Kabaddi', venue: 'EKA Arena, Ahmedabad', event_date: '2025-06-20', status: 'upcoming', home_team: 'Gujarat Giants', away_team: 'Bengaluru Bulls', tickets_sold: 8000, capacity: 10000 },
]

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

  const liveCount = MOCK_UPCOMING.filter(e => e.status === 'live').length

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
        <StatCard icon={CalendarDays} label="Total Events" value="24" sub="3 this week" color="text-blue-500" />
        <StatCard icon={Zap} label="Live Now" value={liveCount} sub="Real-time" color="text-red-500" />
        <StatCard icon={Users} label="Registered Fans" value="12,480" sub="+320 today" color="text-green-500" />
        <StatCard icon={TrendingUp} label="Tickets Sold" value="1.2L" sub="₹6.2Cr revenue" color="text-orange-500" />
      </div>

      <Separator />

      {/* Upcoming & Live Events */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="size-4 text-primary" />
          <h2 className="text-base font-semibold">Upcoming & Live Events</h2>
        </div>
        <div className="flex flex-col gap-3">
          {MOCK_UPCOMING.map(event => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
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
                  <div className="text-right shrink-0">
                    <Badge variant="outline" className="text-xs mb-1">{event.sport}</Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {event.tickets_sold.toLocaleString()} / {event.capacity.toLocaleString()} seats
                    </p>
                  </div>
                </div>

                {/* Occupancy bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Occupancy</span>
                    <span>{Math.round((event.tickets_sold / event.capacity) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(event.tickets_sold / event.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
