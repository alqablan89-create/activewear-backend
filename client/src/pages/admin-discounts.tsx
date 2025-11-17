import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { DiscountCode, Product } from '@shared/schema';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function AdminDiscounts() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'bundle',
    value: '',
    minPurchase: '',
    isActive: true,
    expiresAt: '',
    bundleProducts: [] as string[],
  });

  const { data: discounts, isLoading } = useQuery<DiscountCode[]>({
    queryKey: ['/api/admin/discounts'],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        code: data.code,
        type: data.type,
        value: data.value,
        minPurchase: data.minPurchase || null,
        isActive: data.isActive,
        expiresAt: data.expiresAt || null,
        bundleProducts: data.type === 'bundle' ? data.bundleProducts : null,
      };
      const res = await apiRequest('POST', '/api/admin/discounts', payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/discounts'] });
      toast({ title: 'Discount code created successfully' });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating discount code', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const payload = {
        code: data.code,
        type: data.type,
        value: data.value,
        minPurchase: data.minPurchase || null,
        isActive: data.isActive,
        expiresAt: data.expiresAt || null,
        bundleProducts: data.type === 'bundle' ? data.bundleProducts : null,
      };
      const res = await apiRequest('PUT', `/api/admin/discounts/${id}`, payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/discounts'] });
      toast({ title: 'Discount code updated successfully' });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating discount code', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/discounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/discounts'] });
      toast({ title: 'Discount code deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting discount code', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minPurchase: '',
      isActive: true,
      expiresAt: '',
      bundleProducts: [],
    });
    setEditingDiscount(null);
  };

  const handleEdit = (discount: DiscountCode) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      type: discount.type as 'percentage' | 'fixed' | 'bundle',
      value: discount.value,
      minPurchase: discount.minPurchase || '',
      isActive: discount.isActive,
      expiresAt: discount.expiresAt ? format(new Date(discount.expiresAt), "yyyy-MM-dd'T'HH:mm") : '',
      bundleProducts: discount.bundleProducts || [],
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDiscount) {
      updateMutation.mutate({ id: editingDiscount.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const formatValue = (discount: DiscountCode) => {
    if (discount.type === 'percentage') {
      return `${parseFloat(discount.value).toFixed(0)}%`;
    }
    return `AED ${parseFloat(discount.value).toFixed(2)}`;
  };

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-semibold" data-testid="text-discounts-title">
                {t('admin.discounts')}
              </h1>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2" data-testid="button-add-discount">
                  <Plus className="h-4 w-4" />
                  Add Discount Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingDiscount ? 'Edit Discount Code' : 'Add Discount Code'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="code">Discount Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., SAVE20"
                      required
                      data-testid="input-code"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed' | 'bundle') => setFormData({ ...formData, type: value })}>
                      <SelectTrigger id="type" data-testid="select-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="bundle">Bundle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="value">
                      {formData.type === 'percentage' ? 'Discount Percentage *' : 'Discount Amount (AED) *'}
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder={formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 50.00'}
                      required
                      data-testid="input-value"
                    />
                    {formData.type === 'percentage' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter a number between 0 and 100
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="minPurchase">Minimum Purchase (AED)</Label>
                    <Input
                      id="minPurchase"
                      type="number"
                      step="0.01"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                      placeholder="Optional"
                      data-testid="input-min-purchase"
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiresAt">Expiry Date & Time</Label>
                    <Input
                      id="expiresAt"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      data-testid="input-expires-at"
                    />
                  </div>

                  {formData.type === 'bundle' && (
                    <div>
                      <Label htmlFor="bundleProducts">Bundle Products</Label>
                      <Select 
                        value={formData.bundleProducts[0] || ''} 
                        onValueChange={(value) => {
                          if (value && !formData.bundleProducts.includes(value)) {
                            setFormData({ ...formData, bundleProducts: [...formData.bundleProducts, value] });
                          }
                        }}
                      >
                        <SelectTrigger id="bundleProducts" data-testid="select-bundle-products">
                          <SelectValue placeholder="Add products to bundle" />
                        </SelectTrigger>
                        <SelectContent>
                          {products?.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.bundleProducts.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.bundleProducts.map((productId) => {
                            const product = products?.find(p => p.id === productId);
                            return product ? (
                              <Badge key={productId} variant="secondary" className="gap-2">
                                {product.nameEn}
                                <button
                                  type="button"
                                  onClick={() => setFormData({ 
                                    ...formData, 
                                    bundleProducts: formData.bundleProducts.filter(id => id !== productId) 
                                  })}
                                  className="ml-1 hover:text-destructive"
                                >
                                  ×
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Active</Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      data-testid="switch-is-active"
                    />
                  </div>

                  <Button type="submit" className="w-full" data-testid="button-save-discount">
                    {editingDiscount ? 'Update Discount Code' : 'Create Discount Code'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-64 rounded-md" />
                </CardContent>
              </Card>
            ) : discounts && discounts.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Discount Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead data-testid="header-code">Code</TableHead>
                        <TableHead data-testid="header-type">Type</TableHead>
                        <TableHead data-testid="header-value">Value</TableHead>
                        <TableHead data-testid="header-status">Status</TableHead>
                        <TableHead data-testid="header-expiry">Expiry</TableHead>
                        <TableHead data-testid="header-min-purchase">Min Purchase</TableHead>
                        <TableHead data-testid="header-actions">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {discounts.map((discount) => (
                        <TableRow key={discount.id} data-testid={`row-discount-${discount.id}`}>
                          <TableCell className="font-medium" data-testid={`text-code-${discount.id}`}>
                            {discount.code}
                          </TableCell>
                          <TableCell data-testid={`text-type-${discount.id}`}>
                            <Badge variant="outline">
                              {discount.type.charAt(0).toUpperCase() + discount.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`text-value-${discount.id}`}>
                            {formatValue(discount)}
                          </TableCell>
                          <TableCell data-testid={`badge-status-${discount.id}`}>
                            <Badge variant={discount.isActive ? "default" : "secondary"}>
                              {discount.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`text-expiry-${discount.id}`}>
                            {discount.expiresAt 
                              ? format(new Date(discount.expiresAt), 'MMM dd, yyyy HH:mm')
                              : 'No expiry'}
                          </TableCell>
                          <TableCell data-testid={`text-min-purchase-${discount.id}`}>
                            {discount.minPurchase 
                              ? `AED ${parseFloat(discount.minPurchase).toFixed(2)}`
                              : 'None'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(discount)}
                                data-testid={`button-edit-${discount.id}`}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteMutation.mutate(discount.id)}
                                data-testid={`button-delete-${discount.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No discount codes found. Create your first discount code!
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
