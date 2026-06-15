import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, TrendingUp, Users, IndianRupee } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const engagementData = [
  { month: 'Jan', fans: 820, bookings: 340, views: 1200 },
  { month: 'Feb', fans: 932, bookings: 420, views: 1400 },
  { month: 'Mar', fans: 1100, bookings: 580, views: 1800 },
  { month: 'Apr', fans: 1340, bookings: 720, views: 2200 },
  { month: 'May', fans: 1680, bookings: 940, views: 2800 },
  { month: 'Jun', fans: 2100, bookings: 1140, views: 3500 },
]

const topEventsData = [
  { name: 'IPL Final', tickets: 32000, revenue: 8000000 },
  { name: 'ISL Semi', tickets: 65000, revenue: 5200000 },
  { name: 'Pro Kabaddi', tickets: 8000, revenue: 3992000 },
  { name: 'Basketball PL', tickets: 2400, revenue: 840000 },
  { name: 'Badminton NC', tickets: 3000, revenue: 750000 },
]

const sportBreakdown = [
  { name: 'Cricket', value: 45 },
  { name: 'Football', value: 28 },
  { name: 'Kabaddi', value: 12 },
  { name: 'Basketball', value: 8 },
  { name: 'Others', value: 7 },
]

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']

function StatCard({ icon: Icon, label, value, sub, trend }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
          <div className="size-9 rounded-lg bg-muted flex items-center justify-center text-primary">
            <Icon className="size-4" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="size-3 text-green-500" />
            <span className="text-xs text-green-500 font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="size-5 text-primary" />
          <h1 className="text-xl font-bold">Analytics</h1>
        </div>
        <p className="text-sm text-muted-foreground">Platform performance insights · Last 6 months</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Fans" value="12,480" sub="Registered users" trend="+18% vs last month" />
        <StatCard icon={BarChart3} label="Total Events" value="24" sub="Across all sports" trend="+4 this quarter" />
        <StatCard icon={IndianRupee} label="Total Revenue" value="₹1.87Cr" sub="Ticket sales" trend="+22% vs last month" />
        <StatCard icon={TrendingUp} label="Engagements" value="48,320" sub="Views, bookings, shares" trend="+35% vs last month" />
      </div>

      {/* Charts */}
      <Tabs defaultValue="engagement">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Top Events</TabsTrigger>
          <TabsTrigger value="sports">Sports Mix</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Fan Engagement Trend</CardTitle>
              <CardDescription className="text-xs">Monthly fans, bookings and page views</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={engagementData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="fans" stroke="#6366f1" strokeWidth={2} dot={false} name="New Fans" />
                  <Line type="monotone" dataKey="bookings" stroke="#f59e0b" strokeWidth={2} dot={false} name="Bookings" />
                  <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} dot={false} name="Page Views" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Events by Tickets Sold</CardTitle>
              <CardDescription className="text-xs">Highest performing events this season</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topEventsData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                    formatter={(val) => [val.toLocaleString(), 'Tickets']}
                  />
                  <Bar dataKey="tickets" fill="#6366f1" radius={[4, 4, 0, 0]} name="Tickets Sold" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Fan Interest by Sport</CardTitle>
              <CardDescription className="text-xs">Distribution of fan engagement across sports</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={sportBreakdown} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                    {sportBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Event Performance Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Event</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">Tickets</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Revenue</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">Performance</th>
              </tr>
            </thead>
            <tbody>
              {topEventsData.map((ev, i) => (
                <tr key={ev.name} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-medium text-xs">{ev.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right text-xs font-medium">{ev.tickets.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs hidden md:table-cell text-muted-foreground">
                    ₹{(ev.revenue / 100000).toFixed(1)}L
                  </td>
                  <td className="p-3 text-right">
                    <Badge variant={i === 0 ? 'default' : i < 3 ? 'secondary' : 'outline'} className="text-[10px]">
                      {i === 0 ? '🏆 Top' : i < 3 ? '⭐ High' : 'Normal'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
