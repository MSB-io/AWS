import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CalendarDays, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const SPORTS = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Hockey', 'Kabaddi', 'Badminton']
const STATUS_COLORS = { upcoming: 'secondary', live: 'destructive', completed: 'default', cancelled: 'outline' }

const INITIAL_EVENTS = [
  { id: 1, title: 'IPL 2025 Final', sport: 'Cricket', venue: 'Wankhede Stadium, Mumbai', event_date: '2025-05-25T19:00', status: 'live', home_team: 'MI', away_team: 'CSK', tickets_sold: 32000, capacity: 35000, ticket_price: 2500 },
  { id: 2, title: 'ISL Semi-Final', sport: 'Football', venue: 'Salt Lake Stadium, Kolkata', event_date: '2025-06-10T17:30', status: 'upcoming', home_team: 'ATKMB', away_team: 'MCFC', tickets_sold: 65000, capacity: 68000, ticket_price: 800 },
  { id: 3, title: 'Pro Kabaddi League Final', sport: 'Kabaddi', venue: 'EKA Arena, Ahmedabad', event_date: '2025-06-20T20:00', status: 'upcoming', home_team: 'Gujarat Giants', away_team: 'Bengaluru Bulls', tickets_sold: 8000, capacity: 10000, ticket_price: 499 },
  { id: 4, title: 'Badminton National Championship', sport: 'Badminton', venue: 'Siri Fort Sports Complex, Delhi', event_date: '2025-04-15T10:00', status: 'completed', home_team: '', away_team: '', tickets_sold: 3000, capacity: 3200, ticket_price: 250 },
  { id: 5, title: 'Pro Basketball League', sport: 'Basketball', venue: 'NSCI Dome, Mumbai', event_date: '2025-07-05T18:00', status: 'upcoming', home_team: 'Mumbai Heroes', away_team: 'Delhi Dunkers', tickets_sold: 2400, capacity: 4000, ticket_price: 350 },
]

const EMPTY_FORM = { title: '', sport: '', venue: '', event_date: '', status: 'upcoming', home_team: '', away_team: '', capacity: 50000, tickets_sold: 0, ticket_price: 499 }

export default function EventsPage() {
  const { user } = useAuth()
  const isManager = ['manager', 'admin'].includes(user?.role)
  const isAdmin = user?.role === 'admin'

  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [search, setSearch] = useState('')
  const [filterSport, setFilterSport] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDialog, setShowDialog] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const filtered = events.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase())
    const matchSport = filterSport === 'all' || e.sport === filterSport
    const matchStatus = filterStatus === 'all' || e.status === filterStatus
    return matchSearch && matchSport && matchStatus
  })

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowDialog(true) }
  const openEdit = (ev) => { setEditing(ev); setForm({ ...ev }); setShowDialog(true) }

  const handleSave = () => {
    if (!form.title || !form.sport || !form.venue || !form.event_date) {
      toast.error('Please fill all required fields'); return
    }
    if (editing) {
      setEvents(evs => evs.map(e => e.id === editing.id ? { ...e, ...form } : e))
      toast.success('Event updated')
    } else {
      setEvents(evs => [...evs, { ...form, id: Date.now() }])
      toast.success('Event created')
    }
    setShowDialog(false)
  }

  const handleDelete = (id) => {
    setEvents(evs => evs.filter(e => e.id !== id))
    toast.success('Event deleted')
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target?.value ?? e }))

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="size-5 text-primary" />
            <h1 className="text-xl font-bold">Events</h1>
          </div>
          <p className="text-sm text-muted-foreground">{filtered.length} events found</p>
        </div>
        {isManager && (
          <Button size="sm" onClick={openCreate}>
            <Plus data-icon="inline-start" />
            Add Event
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            id="events-search"
            placeholder="Search events…"
            className="pl-8 h-8 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterSport} onValueChange={setFilterSport}>
          <SelectTrigger id="filter-sport" className="h-8 text-sm w-36">
            <Filter className="size-3 mr-1 text-muted-foreground" /><SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger id="filter-status" className="h-8 text-sm w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead className="hidden md:table-cell">Sport</TableHead>
                <TableHead className="hidden lg:table-cell">Venue</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Tickets</TableHead>
                {isManager && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(event => (
                <TableRow key={event.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{event.title}</p>
                    {event.home_team && (
                      <p className="text-xs text-muted-foreground">{event.home_team} vs {event.away_team}</p>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs">{event.sport}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-40 truncate">
                    {event.venue}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_COLORS[event.status]} className="text-xs">
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs">
                    <div>
                      <span className="font-medium">{event.tickets_sold?.toLocaleString()}</span>
                      <span className="text-muted-foreground"> / {event.capacity?.toLocaleString()}</span>
                    </div>
                    <div className="h-1 w-20 rounded-full bg-muted mt-1 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (event.tickets_sold / event.capacity) * 100)}%` }} />
                    </div>
                  </TableCell>
                  {isManager && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => openEdit(event)}>
                          <Edit className="size-3.5" />
                        </Button>
                        {isAdmin && (
                          <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" onClick={() => handleDelete(event.id)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12 text-sm">
                    No events found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Event' : 'Create Event'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-title">Title *</Label>
              <Input id="ev-title" value={form.title} onChange={set('title')} placeholder="IPL Final 2025" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-sport">Sport *</Label>
                <Select value={form.sport} onValueChange={set('sport')}>
                  <SelectTrigger id="ev-sport"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-status">Status</Label>
                <Select value={form.status} onValueChange={set('status')}>
                  <SelectTrigger id="ev-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['upcoming','live','completed','cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-venue">Venue *</Label>
              <Input id="ev-venue" value={form.venue} onChange={set('venue')} placeholder="Wankhede Stadium, Mumbai" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-date">Date & Time *</Label>
              <Input id="ev-date" type="datetime-local" value={form.event_date} onChange={set('event_date')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-home">Home Team</Label>
                <Input id="ev-home" value={form.home_team} onChange={set('home_team')} placeholder="Team A" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-away">Away Team</Label>
                <Input id="ev-away" value={form.away_team} onChange={set('away_team')} placeholder="Team B" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-capacity">Capacity</Label>
                <Input id="ev-capacity" type="number" value={form.capacity} onChange={set('capacity')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-price">Ticket Price (₹)</Label>
                <Input id="ev-price" type="number" value={form.ticket_price} onChange={set('ticket_price')} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Create Event'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
