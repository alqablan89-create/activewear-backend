import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { t } = useTranslation();

  const { data: stats } = useQuery<{
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
  }>({
    queryKey: ['/api/admin/stats'],
  });

  const statCards = [
    {
      title: t('admin.totalRevenue'),
      value: `$${stats?.totalRevenue.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: t('admin.totalOrders'),
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: t('admin.totalProducts'),
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-purple-600',
    },
    {
      title: t('admin.totalUsers'),
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-orange-600',
    },
  ];

  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 7000 },
  ];

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-2xl font-semibold" data-testid="text-dashboard-title">
              {t('admin.dashboard')}
            </h1>
            <div />
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid={`stat-${index}`}>
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
