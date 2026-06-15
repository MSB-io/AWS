import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { register as registerApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const SPORTS = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Hockey', 'Kabaddi', 'Badminton']

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'fan', team_fav: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target?.value ?? e }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await registerApi(form)
      login(data.token, data.user)
      toast.success(`Welcome to FanEngage, ${data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Trophy className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">FanEngage</h1>
          <p className="text-sm text-muted-foreground">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Register</CardTitle>
            <CardDescription>Join the platform as a fan, manager, or admin</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="register-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input id="reg-name" placeholder="John Doe" value={form.name} onChange={set('name')} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reg-password">Password</Label>
                <Input id="reg-password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={6} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reg-role">Role</Label>
                <Select value={form.role} onValueChange={set('role')}>
                  <SelectTrigger id="reg-role"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fan">Fan</SelectItem>
                    <SelectItem value="manager">Event Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reg-sport">Favourite Sport</Label>
                <Select value={form.team_fav} onValueChange={set('team_fav')}>
                  <SelectTrigger id="reg-sport"><SelectValue placeholder="Select a sport" /></SelectTrigger>
                  <SelectContent>
                    {SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button form="register-form" type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 data-icon="inline-start" className="animate-spin" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
