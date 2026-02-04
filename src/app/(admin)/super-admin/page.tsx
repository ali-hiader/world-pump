import { format } from 'date-fns'
import { Boxes, Package, PackageOpen, ShoppingCart, TrendingUp, Users } from 'lucide-react'

import { getAdminAnalyticsStats, getAdminSignupStats } from '@/actions/analytics'
import SignupChart from '@/components/admin/signup-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import KPICard from '@/components/ui/kpi-card'

export const dynamic = 'force-dynamic'

interface SignupStat {
   date: string
   count: number
}

export default async function SuperAdminDashboard() {
   const [signupStats, stats] = await Promise.all([getAdminSignupStats(), getAdminAnalyticsStats()])

   const chartData = (signupStats as SignupStat[])?.map((stat) => ({
      date: format(new Date(stat.date), 'MMM d'),
      signups: stat.count,
   }))

   return (
      <main className="space-y-6">
         <hgroup>
            <h2 className="text-4xl font-bold tracking-tight headingFont">Dashboard</h2>
            <p className="text-muted-foreground">Overview of your application performance</p>
         </hgroup>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
               title="Total Products"
               value={stats.totalProducts}
               isLoading={false}
               icon={Package}
            />
            <KPICard
               title="Active Products"
               value={stats.activeProducts}
               isLoading={false}
               icon={TrendingUp}
            />
            <KPICard
               title="Total Accessories"
               value={stats.totalAccessories}
               isLoading={false}
               icon={PackageOpen}
            />
            <KPICard
               title="Active Accessories"
               value={stats.activeAccessories}
               isLoading={false}
               icon={Boxes}
            />
            <KPICard
               title="Total Orders"
               value={stats.totalOrders}
               isLoading={false}
               icon={ShoppingCart}
            />
            <KPICard title="Total Users" value={stats.totalUsers} isLoading={false} icon={Users} />
         </div>

         <Card>
            <CardHeader>
               <CardTitle>User registrations</CardTitle>
               <CardDescription>
                  Daily user registration activity over the last 30 days
               </CardDescription>
            </CardHeader>
            <CardContent>
               <SignupChart data={chartData} />
            </CardContent>
         </Card>
      </main>
   )
}
