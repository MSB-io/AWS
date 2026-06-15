import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, CalendarDays, BarChart3, Bell, ShieldCheck, LogOut, Trophy, Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['fan', 'manager', 'admin'] },
  { to: '/events', icon: CalendarDays, label: 'Events', roles: ['fan', 'manager', 'admin'] },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['manager', 'admin'] },
  { to: '/alerts', icon: Bell, label: 'Alerts', roles: ['fan', 'manager', 'admin'] },
  { to: '/admin', icon: ShieldCheck, label: 'Admin', roles: ['admin'] },
]

const roleColors = { fan: 'secondary', manager: 'default', admin: 'destructive' }

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filtered = navItems.filter(n => n.roles.includes(user?.role))

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow">
          <Trophy className="size-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-bold text-sm leading-none">FanEngage</p>
          <p className="text-xs text-muted-foreground">Sports Platform</p>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {filtered.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Separator />

      {/* User */}
      <div className="p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 bg-muted/50">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{user?.name}</p>
            <Badge variant={roleColors[user?.role] || 'secondary'} className="text-[10px] h-4 px-1 mt-0.5">
              {user?.role}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={handleLogout}>
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 border-r bg-card flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-card border-r z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile Topbar */}
        <header className="flex md:hidden items-center gap-3 px-4 h-14 border-b bg-card shrink-0">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-primary" />
            <span className="font-bold text-sm">FanEngage</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
