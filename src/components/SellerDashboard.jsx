import { useState } from 'react';
import { Package, DollarSign, Star, Plus, Edit, Trash2, LayoutDashboard, ShoppingBag, ListOrdered, Boxes } from 'lucide-react';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { productsAPI } from '../lib/api';

export function SellerDashboard() {
  const { user, orders, products, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
  });

  const CATEGORY_OPTIONS = [
    { value: 'pottery', label: 'Pottery' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'paintings', label: 'Paintings' },
    { value: 'sculptures', label: 'Sculptures' },
    { value: 'baskets', label: 'Basketry' },
    { value: 'metalwork', label: 'Metalwork' },
    { value: 'woodcarving', label: 'Wood Carving' },
    { value: 'other', label: 'Other' },
  ];

  const normalizeCategory = (value) => {
    const raw = (value ?? '').toString().trim().toLowerCase();
    if (!raw) return '';
    if (raw === 'basketry') return 'baskets';
    if (raw === 'wood carving') return 'woodcarving';
    return raw;
  };

  const isLikelyMongoId = (value) => {
    const s = (value ?? '').toString();
    return /^[a-f\d]{24}$/i.test(s);
  };

  const normalizeApiProductToContext = (raw) => ({
    id: raw.id || raw._id,
    name: raw.name,
    description: raw.description,
    price: Number(raw.price) || 0,
    category: raw.category,
    image: (Array.isArray(raw.images) && raw.images[0]) || raw.image || 'https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9',
    artisan: raw.sellerName || raw.seller?.shopName || raw.seller?.name || user?.name || 'Unknown',
    sellerId: raw.seller?._id || raw.seller?.id || user?.id || '',
    stock: typeof raw.stock === 'number' ? raw.stock : Number(raw.stock) || 0,
  });

  const myProducts = products.filter(p => p.sellerId === user?.id);
  const myOrders = orders.filter(order => 
    order.products.some(p => myProducts.find(mp => mp.id === p.id))
  );

  const totalEarnings = myOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = myOrders.filter(o => o.status === 'pending').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const normalizedCategory = normalizeCategory(formData.category);
    if (!normalizedCategory) {
      toast.error('Please select a valid category');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: normalizedCategory,
      stock: Number(formData.stock),
      images: formData.image ? [formData.image] : [],
    };

    // Always keep AppContext in sync, but prefer persisting to backend so products show up
    // for other users (e.g., consultants) on the Explore Products page.
    try {
      if (editingProduct && isLikelyMongoId(editingProduct.id)) {
        const updated = await productsAPI.update(editingProduct.id, payload);
        updateProduct(normalizeApiProductToContext(updated));
        toast.success('Product updated successfully!');
      } else if (!editingProduct) {
        const created = await productsAPI.create(payload);
        addProduct(normalizeApiProductToContext(created));
        toast.success('Product added to inventory successfully!');
      } else {
        // Legacy/local-only product
        const productData = {
          id: editingProduct?.id || `product-${Date.now()}`,
          name: payload.name,
          description: payload.description,
          price: payload.price,
          category: payload.category,
          image: payload.images?.[0] || 'https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9',
          artisan: user?.name || 'Unknown',
          sellerId: user?.id || '',
          stock: payload.stock,
        };
        updateProduct(productData);
        toast.success('Product updated successfully!');
      }
    } catch (e) {
      console.error('SellerDashboard product save failed:', e);

      // Fallback to local-only mode (still useful if backend is down).
      const productData = {
        id: editingProduct?.id || `product-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        price: payload.price,
        category: payload.category,
        image: payload.images?.[0] || 'https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9',
        artisan: user?.name || 'Unknown',
        sellerId: user?.id || '',
        stock: payload.stock,
      };

      if (editingProduct) {
        updateProduct(productData);
        toast.success('Product updated locally (backend unavailable)');
      } else {
        addProduct(productData);
        toast.success('Product added locally (backend unavailable)');
      }
    }

    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', category: '', image: '', stock: '' });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: normalizeCategory(product.category),
      image: product.image,
      stock: product.stock?.toString() || '0',
    });
    setIsDialogOpen(true);
  };

  const categoryLabelByValue = CATEGORY_OPTIONS.reduce((acc, c) => {
    acc[c.value] = c.label;
    return acc;
  }, {});

  const getCategoryLabel = (value) => {
    const normalized = normalizeCategory(value);
    return categoryLabelByValue[normalized] || (normalized ? normalized.replace(/\b\w/g, (m) => m.toUpperCase()) : '');
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      (async () => {
        try {
          if (isLikelyMongoId(productId)) {
            await productsAPI.delete(productId);
          }
          deleteProduct(productId);
          toast.success('Product deleted successfully');
        } catch (e) {
          console.error('SellerDashboard delete failed:', e);
          // Still delete locally so seller UI remains usable.
          deleteProduct(productId);
          toast.success('Product deleted locally (backend unavailable)');
        }
      })();
    }
  };

  const handleUpdateOrderStatus = (orderId, status) => {
    updateOrderStatus(orderId, status);
    toast.success(`Order marked as ${status}!`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <aside className="w-64 border-r" style={{ backgroundColor: '#3E2723' }}>
        <div className="p-6">
          <h2 className="mb-6" style={{ color: '#B8860B' }}>Seller Panel</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-primary text-white' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-primary text-white' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <ListOrdered className="h-5 w-5" />
              <span>Orders Received</span>
              {pendingOrders > 0 && (
                <Badge className="ml-auto bg-red-500">{pendingOrders}</Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'products' 
                  ? 'bg-primary text-white' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>My Products</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'inventory' 
                  ? 'bg-primary text-white' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Boxes className="h-5 w-5" />
              <span>Inventory</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'orders' && 'Orders Received'}
                {activeTab === 'products' && 'My Products'}
                {activeTab === 'inventory' && 'Inventory Management'}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === 'overview' && 'Manage your products and orders'}
                {activeTab === 'orders' && 'View and manage customer orders'}
                {activeTab === 'products' && 'Manage your product catalog'}
                {activeTab === 'inventory' && 'Track your product stock levels'}
              </p>
            </div>
            {activeTab === 'products' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-gold rounded-2xl" onClick={() => {
                    setEditingProduct(null);
                    setFormData({ name: '', description: '', price: '', category: '', image: '', stock: '' });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                      {editingProduct ? 'Update product details' : 'Add a new handcrafted item to your store'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Hand-Painted Vase"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your product..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL (optional)</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <Button className="w-full gradient-gold rounded-2xl" onClick={handleSubmit}>
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Products</p>
                        <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                          {myProducts.length}
                        </p>
                      </div>
                      <Package className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                        <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                          ₹{totalEarnings.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Orders</p>
                        <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                          {pendingOrders}
                        </p>
                      </div>
                      <Package className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                          {myOrders.length}
                        </p>
                      </div>
                      <Star className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {myOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders yet. Keep creating amazing products!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="mb-1">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">From: {order.buyerName}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <p className="text-sm mt-1" style={{ color: '#B8860B', fontWeight: 600 }}>
                              ₹{order.total.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>Orders Received</CardTitle>
                <CardDescription>Manage and update order status</CardDescription>
              </CardHeader>
              <CardContent>
                {myOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders yet. Keep creating amazing products!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="mb-1">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">From: {order.buyerName}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Contact: {order.shippingDetails.phone} | {order.shippingDetails.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Address: {order.shippingDetails.address}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          {order.products.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 text-sm">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div className="flex-1">
                                <p>{item.name}</p>
                                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <p style={{ color: '#B8860B' }}>₹{item.price * item.quantity}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                className="gradient-gold"
                                onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                              >
                                Mark as Shipped
                              </Button>
                            )}
                            {order.status === 'shipped' && (
                              <Button
                                size="sm"
                                className="gradient-gold"
                                onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                              >
                                Mark as Delivered
                              </Button>
                            )}
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground mr-2">Total:</span>
                            <span style={{ color: '#B8860B', fontWeight: 600 }}>₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                {myProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No products yet. Click "Add Product" to get started!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myProducts.map((product) => (
                      <Card key={product.id}>
                        <div className="aspect-square overflow-hidden">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span style={{ color: '#B8860B', fontWeight: 600 }}>
                              ₹{product.price.toLocaleString()}
                            </span>
                            <Badge variant="outline">{getCategoryLabel(product.category)}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
                <CardDescription>Track your product stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                {myProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No products in inventory yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1">{product.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{getCategoryLabel(product.category)}</Badge>
                            <span className="text-sm text-muted-foreground">
                              ₹{product.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Stock</p>
                          <p className={`text-2xl ${(product.stock || 0) < 5 ? 'text-red-600' : 'text-green-600'}`} style={{ fontWeight: 600 }}>
                            {product.stock || 0}
                          </p>
                          {(product.stock || 0) < 5 && (
                            <Badge className="bg-red-100 text-red-800 mt-1">Low Stock</Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Update Stock
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}