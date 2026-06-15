import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldCheck, Users, Server, Database, HardDrive, Trash2, UserCheck, Cloud } from 'lucide-react'
import { toast } from 'sonner'

const INITIAL_FANS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', team_fav: 'Cricket', created_at: '2025-01-10' },
  { id: 2, name: 'Rahul Verma', email: 'rahul@example.com', team_fav: 'Football', created_at: '2025-02-14' },
  { id: 3, name: 'Ananya Patel', email: 'ananya@example.com', team_fav: 'Kabaddi', created_at: '2025-03-01' },
  { id: 4, name: 'Karan Singh', email: 'karan@example.com', team_fav: 'Cricket', created_at: '2025-03-22' },
  { id: 5, name: 'Sneha Mehta', email: 'sneha@example.com', team_fav: 'Badminton', created_at: '2025-04-08' },
]

const IAM_USERS = [
  { name: 'fanengage-ec2-role', type: 'IAM Role', permissions: ['S3:PutObject', 'CloudWatch:PutMetricData'], attached: 'EC2 Instance' },
  { name: 'fanengage-admin', type: 'IAM User', permissions: ['EC2:*', 'RDS:*', 'S3:*', 'CloudWatch:*'], attached: 'Admin Console' },
  { name: 'fanengage-readonly', type: 'IAM User', permissions: ['EC2:Describe', 'RDS:Describe', 'S3:GetObject'], attached: 'Monitoring' },
]

const INFRA = [
  { label: 'EC2 Instance', value: 't2.micro', detail: 'Ubuntu 22.04 LTS · us-east-1a', icon: Server, status: 'Running', color: 'text-green-500' },
  { label: 'RDS MySQL', value: 'db.t3.micro', detail: 'MySQL 8.0 · Multi-AZ: No · Free Tier', icon: Database, status: 'Available', color: 'text-green-500' },
  { label: 'S3 Bucket', value: 'fanengage-backups', detail: '2.3 GB used · 5 GB limit (Free Tier)', icon: HardDrive, status: 'Active', color: 'text-green-500' },
  { label: 'VPC', value: '10.0.0.0/16', detail: '2 subnets · Internet Gateway attached', icon: Cloud, status: 'Active', color: 'text-blue-500' },
]

export default function AdminPage() {
  const [fans, setFans] = useState(INITIAL_FANS)

  const handleDeleteFan = (id) => {
    setFans(prev => prev.filter(f => f.id !== id))
    toast.success('Fan account removed')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="size-5 text-primary" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <Badge variant="destructive">Admin Only</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Manage users, IAM policies, and AWS infrastructure</p>
      </div>

      <Tabs defaultValue="fans">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="fans">Fan Users</TabsTrigger>
          <TabsTrigger value="iam">IAM & Security</TabsTrigger>
          <TabsTrigger value="infra">Infrastructure</TabsTrigger>
        </TabsList>

        {/* Fans Tab */}
        <TabsContent value="fans" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="size-4" /> Registered Fans
              </CardTitle>
              <CardDescription className="text-xs">{fans.length} fans registered on the platform</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Fav Sport</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fans.map(fan => (
                    <TableRow key={fan.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {fan.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">{fan.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{fan.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">{fan.team_fav}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {new Date(fan.created_at).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" onClick={() => handleDeleteFan(fan.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IAM Tab */}
        <TabsContent value="iam" className="mt-4">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <UserCheck className="size-4" /> IAM Users & Roles
                </CardTitle>
                <CardDescription className="text-xs">AWS Identity and Access Management configuration</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {IAM_USERS.map(iam => (
                  <div key={iam.name} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-sm font-mono">{iam.name}</p>
                        <p className="text-xs text-muted-foreground">{iam.attached}</p>
                      </div>
                      <Badge variant={iam.type === 'IAM Role' ? 'default' : 'secondary'} className="text-xs">
                        {iam.type}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {iam.permissions.map(p => (
                        <Badge key={p} variant="outline" className="text-[10px] font-mono">{p}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="size-4 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Security Groups Active</p>
                    <p className="text-xs text-green-600/80 dark:text-green-500/80 mt-1">
                      EC2 SG: Ports 22 (SSH), 80 (HTTP), 5000 (API) open<br />
                      RDS SG: Port 3306 only accessible from EC2 Security Group<br />
                      All other inbound traffic is blocked by default
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Infrastructure Tab */}
        <TabsContent value="infra" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INFRA.map(item => {
              const Icon = item.icon
              return (
                <Card key={item.label}>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Icon className={`size-5 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                          <div className="flex items-center gap-1">
                            <span className={`size-1.5 rounded-full bg-current ${item.color}`} />
                            <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                          </div>
                        </div>
                        <p className="font-bold text-sm font-mono">{item.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Linux Admin section */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Linux Administration</CardTitle>
              <CardDescription className="text-xs">EC2 instance configuration and scheduled tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'OS User: ubuntu', detail: 'Primary EC2 user · sudo access', status: 'Active' },
                  { label: 'Cron: backup-db.sh', detail: 'Daily at 02:00 AM UTC · mysqldump → S3', status: 'Scheduled' },
                  { label: 'Cron: monitor.sh', detail: 'Every 5 minutes · CPU/Memory → CloudWatch', status: 'Scheduled' },
                  { label: 'Service: nginx.service', detail: 'Auto-start enabled · Reverse proxy on port 80', status: 'Active' },
                  { label: 'Service: fanengage-api', detail: 'Managed by PM2 · Restart on crash', status: 'Active' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0 gap-4">
                    <div>
                      <p className="text-xs font-mono font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{item.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
