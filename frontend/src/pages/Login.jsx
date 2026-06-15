import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { login as loginApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trophy, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

// Mock users for demo when DB is unavailable
const MOCK_USERS = {
  'admin@fanengage.com': { password: 'admin123', role: 'admin', name: 'Admin User', id: 1 },
  'manager@fanengage.com': { password: 'manager123', role: 'manager', name: 'Event Manager', id: 2 },
  'fan@fanengage.com': { password: 'fan123', role: 'fan', name: 'Sports Fan', id: 3 },
}

function makeMockToken(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + 86400 * 7 }))
  return `${header}.${payload}.mock_signature`
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await loginApi(form)
      login(data.token, data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      // Fallback to mock login if backend unavailable
      const mockUser = MOCK_USERS[form.email]
      if (mockUser && mockUser.password === form.password) {
        const userData = { id: mockUser.id, name: mockUser.name, email: form.email, role: mockUser.role }
        const token = makeMockToken(userData)
        login(token, userData)
        toast.success(`Welcome back, ${mockUser.name}! (demo mode)`)
        navigate('/dashboard')
      } else {
        setError(err.response?.data?.message || 'Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Trophy className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">FanEngage</h1>
          <p className="text-sm text-muted-foreground">Sports Fan Platform Cloud</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button form="login-form" type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 data-icon="inline-start" className="animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
            </p>
          </CardFooter>
        </Card>

        {/* Demo hint */}
        <div className="mt-4 rounded-lg border bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground font-medium mb-1.5">Demo credentials:</p>
          <div className="flex flex-col gap-1">
            {Object.entries(MOCK_USERS).map(([email, u]) => (
              <button
                key={email}
                type="button"
                className="text-xs text-left text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setForm({ email, password: u.password })}
              >
                <span className="font-mono">{email}</span> · {u.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
