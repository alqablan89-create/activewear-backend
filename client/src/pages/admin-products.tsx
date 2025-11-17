import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { Product, Category } from '@shared/schema';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
// import { ObjectUploader } from '@/components/object-uploader';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProducts() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    categoryId: '',
    price: '',
    compareAtPrice: '',
    images: [] as string[],
    videoUrl: '',
    colors: [] as string[],
    sizes: [] as string[],
    stockQuantity: 0,
    isNew: false,
    isFeatured: false,
    isOnSale: false,
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest('POST', '/api/admin/products', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: 'Product created successfully' });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating product', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest('PUT', `/api/admin/products/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: 'Product updated successfully' });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating product', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: 'Product deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      categoryId: '',
      price: '',
      compareAtPrice: '',
      images: [],
      videoUrl: '',
      colors: [],
      sizes: [],
      stockQuantity: 0,
      isNew: false,
      isFeatured: false,
      isOnSale: false,
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      descriptionEn: product.descriptionEn || '',
      descriptionAr: product.descriptionAr || '',
      categoryId: product.categoryId,
      price: product.price,
      compareAtPrice: product.compareAtPrice || '',
      images: product.images || [],
      videoUrl: product.videoUrl || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      stockQuantity: product.stockQuantity,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      compareAtPrice: formData.compareAtPrice || formData.price,
    };
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleImageUpload = async () => {
    const res = await apiRequest('POST', '/api/objects/upload');
    const data = await res.json();
    return { method: 'PUT' as const, url: data.uploadURL };
  };

  const handleUploadComplete = (result: any) => {
    const uploadedUrls = result.successful.map((file: any) => file.uploadURL);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
    toast({ title: 'Images uploaded successfully' });
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
              <h1 className="text-2xl font-semibold" data-testid="text-products-title">
                {t('admin.products')}
              </h1>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2" data-testid="button-add-product">
                  <Plus className="h-4 w-4" />
                  {t('admin.addProduct')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? t('admin.editProduct') : t('admin.addProduct')}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nameEn">Product Name (English)</Label>
                      <Input
                        id="nameEn"
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        required
                        data-testid="input-name-en"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameAr">Product Name (Arabic)</Label>
                      <Input
                        id="nameAr"
                        value={formData.nameAr}
                        onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                        required
                        data-testid="input-name-ar"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="descriptionEn">Description (English)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      data-testid="input-description-en"
                    />
                  </div>

                  <div>
                    <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                    <Textarea
                      id="descriptionAr"
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                      data-testid="input-description-ar"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                        <SelectTrigger id="category" data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                        data-testid="input-stock"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        data-testid="input-price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="comparePrice">Compare at Price ($)</Label>
                      <Input
                        id="comparePrice"
                        type="number"
                        step="0.01"
                        value={formData.compareAtPrice}
                        onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                        data-testid="input-compare-price"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.images[0] || ''}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value ? [e.target.value] : [] })}
                      placeholder="Enter image URL"
                      data-testid="input-image-url"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a direct image URL for the product
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isNew">New Arrival</Label>
                    <Switch
                      id="isNew"
                      checked={formData.isNew}
                      onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked })}
                      data-testid="switch-is-new"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isFeatured">Featured</Label>
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                      data-testid="switch-is-featured"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isOnSale">On Sale</Label>
                    <Switch
                      id="isOnSale"
                      checked={formData.isOnSale}
                      onCheckedChange={(checked) => setFormData({ ...formData, isOnSale: checked })}
                      data-testid="switch-is-sale"
                    />
                  </div>

                  <Button type="submit" className="w-full" data-testid="button-save-product">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-md" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{product.nameEn}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-square rounded-md overflow-hidden bg-muted">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.nameEn} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">${parseFloat(product.price).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Stock: {product.stockQuantity}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => handleEdit(product)}
                          data-testid={`button-edit-${product.id}`}
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 gap-2"
                          onClick={() => deleteMutation.mutate(product.id)}
                          data-testid={`button-delete-${product.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No products found. Create your first product!
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
