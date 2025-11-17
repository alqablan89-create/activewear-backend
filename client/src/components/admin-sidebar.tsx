import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  Home,
} from 'lucide-react';

export function AdminSidebar() {
  const { t } = useTranslation();
  const [location] = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: t('admin.dashboard'), href: '/admin' },
    { icon: Package, label: t('admin.products'), href: '/admin/products' },
    { icon: FolderTree, label: t('admin.categories'), href: '/admin/categories' },
    { icon: ShoppingCart, label: t('admin.orders'), href: '/admin/orders' },
    { icon: Users, label: t('admin.users'), href: '/admin/users' },
    { icon: Tag, label: t('admin.discounts'), href: '/admin/discounts' },
    { icon: Settings, label: t('admin.settings'), href: '/admin/settings' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/">
          <div className="flex items-center gap-2 hover-elevate active-elevate-2 p-2 rounded-md">
            <Home className="h-5 w-5" />
            <span className="font-bold text-lg">Lift Me Up</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.href}
                    data-testid={`link-admin-${item.href.split('/').pop() || 'dashboard'}`}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
