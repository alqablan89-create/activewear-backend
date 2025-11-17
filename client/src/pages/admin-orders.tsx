import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Eye, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: string;
  selectedColor?: string;
  selectedSize?: string;
  product: {
    nameEn: string;
    nameAr: string;
    images?: string[];
  };
}

interface Order {
  id: string;
  userId: string;
  status: string;
  total: string;
  discountAmount: string;
  discountCode?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: string;
  createdAt: string;
  items?: OrderItem[];
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  delivered: 'bg-green-500/10 text-green-700 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-700 border-red-500/20',
};

export default function AdminOrders() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await apiRequest('PUT', `/api/admin/orders/${orderId}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({ title: 'Order status updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating order status', description: error.message, variant: 'destructive' });
    },
  });

  const handleViewDetails = async (order: Order) => {
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`);
      if (!res.ok) throw new Error('Failed to fetch order details');
      const detailedOrder = await res.json();
      setSelectedOrder(detailedOrder);
      setDetailsOpen(true);
    } catch (error) {
      toast({ title: 'Error loading order details', variant: 'destructive' });
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-semibold">Orders Management</h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  All Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="hidden md:grid grid-cols-[120px_180px_1fr_180px_140px_120px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                      <div>Order ID</div>
                      <div>Customer</div>
                      <div>Items</div>
                      <div>Total</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>

                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="grid md:grid-cols-[120px_180px_1fr_180px_140px_120px] gap-4 p-4 border rounded-md hover-elevate"
                        data-testid={`order-row-${order.id}`}
                      >
                        <div className="font-mono text-sm truncate" data-testid={`text-order-id-${order.id}`}>
                          #{order.id.slice(0, 8)}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium truncate" data-testid={`text-customer-${order.id}`}>
                            {order.customerName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Order #{order.id.slice(0, 8)}
                        </div>

                        <div>
                          <p className="font-semibold" data-testid={`text-total-${order.id}`}>
                            ${parseFloat(order.total).toFixed(2)}
                          </p>
                          {parseFloat(order.discountAmount || '0') > 0 && (
                            <p className="text-xs text-primary">
                              -${parseFloat(order.discountAmount).toFixed(2)} discount
                            </p>
                          )}
                        </div>

                        <div>
                          <Select
                            value={order.status}
                            onValueChange={(status) => handleStatusChange(order.id, status)}
                          >
                            <SelectTrigger
                              className={`h-8 ${statusColors[order.status as keyof typeof statusColors]}`}
                              data-testid={`select-status-${order.id}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                            data-testid={`button-view-${order.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View complete order information including items, customer details, and shipping address
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono" data-testid="text-detail-order-id">
                    #{selectedOrder.id.slice(0, 12)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p data-testid="text-detail-date">
                    {format(new Date(selectedOrder.createdAt), 'PPP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={statusColors[selectedOrder.status as keyof typeof statusColors]}
                    data-testid="badge-detail-status"
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-semibold text-lg" data-testid="text-detail-total">
                    ${parseFloat(selectedOrder.total).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customerName}</p>
                  {selectedOrder.customerEmail && (
                    <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customerEmail}</p>
                  )}
                  {selectedOrder.customerPhone && (
                    <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customerPhone}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm whitespace-pre-line">{selectedOrder.shippingAddress}</p>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => {
                      const productName = i18n.language === 'ar' ? item.product.nameAr : item.product.nameEn;
                      return (
                        <div key={item.id} className="flex gap-3 p-3 border rounded-md">
                          <div className="w-16 h-16 rounded bg-muted flex-shrink-0">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0]}
                                alt={productName}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{productName}</p>
                            {(item.selectedColor || item.selectedSize) && (
                              <p className="text-sm text-muted-foreground">
                                {item.selectedColor && `Color: ${item.selectedColor}`}
                                {item.selectedColor && item.selectedSize && ' | '}
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                              </p>
                            )}
                            <p className="text-sm">
                              Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      ${(parseFloat(selectedOrder.total) + parseFloat(selectedOrder.discountAmount || '0')).toFixed(2)}
                    </span>
                  </div>
                  {parseFloat(selectedOrder.discountAmount || '0') > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>
                        Discount {selectedOrder.discountCode && `(${selectedOrder.discountCode})`}
                      </span>
                      <span>-${parseFloat(selectedOrder.discountAmount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${parseFloat(selectedOrder.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
