import { useEffect, useState } from 'react';
import { Package, Heart, ShoppingBag, TrendingUp } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../lib/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ProductCard } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

export function BuyerDashboard() {
  const { user, orders, wishlist, addToCart, addToWishlist, removeFromWishlist, products } = useApp();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'browse');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [activeTab, searchParams]);

  const myOrders = orders.filter(order => order.buyerId === user?.id);
  
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

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    toast.success('Added to wishlist!');
  };

  // Cultural consultant recommendations
  const recommendations = products.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Welcome, {user?.name}!</h1>
        <p className="text-muted-foreground">Manage your orders and discover new handcrafted treasures</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  {myOrders.length}
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
                <p className="text-sm text-muted-foreground">Wishlist Items</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  {wishlist.length}
                </p>
              </div>
              <Heart className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  {myOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <ShoppingBag className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl" style={{ fontWeight: 600, color: '#B8860B' }}>
                  ₹{myOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8" style={{ color: '#C19A6B', opacity: 0.5 }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="browse">Browse Products</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
              <CardDescription>Browse handcrafted items from all artisans</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No products available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      isInWishlist={wishlist.some(w => w.id === product.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>Track your order status and history</CardDescription>
            </CardHeader>
            <CardContent>
              {myOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No orders yet. Start shopping to see your orders here!
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="mb-1">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
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

                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="text-sm">
                          <p className="text-muted-foreground">Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground mr-2">Total:</span>
                          <span style={{ color: '#B8860B', fontWeight: 600 }}>₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Order Tracking */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className={`flex flex-col items-center ${order.status === 'pending' || order.status === 'shipped' || order.status === 'delivered' ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${order.status === 'pending' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-accent text-white' : 'bg-gray-200'}`}>
                              1
                            </div>
                            <p className="text-xs">Pending</p>
                          </div>
                          <div className={`flex-1 h-0.5 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-accent' : 'bg-gray-200'}`}></div>
                          <div className={`flex flex-col items-center ${order.status === 'shipped' || order.status === 'delivered' ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-accent text-white' : 'bg-gray-200'}`}>
                              2
                            </div>
                            <p className="text-xs">Shipped</p>
                          </div>
                          <div className={`flex-1 h-0.5 ${order.status === 'delivered' ? 'bg-accent' : 'bg-gray-200'}`}></div>
                          <div className={`flex flex-col items-center ${order.status === 'delivered' ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${order.status === 'delivered' ? 'bg-accent text-white' : 'bg-gray-200'}`}>
                              3
                            </div>
                            <p className="text-xs">Delivered</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Wishlist</CardTitle>
              <CardDescription>Save items for later</CardDescription>
            </CardHeader>
            <CardContent>
              {wishlist.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Your wishlist is empty. Add items you love!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((product) => (
                    <div key={product.id}>
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        isInWishlist={true}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => {
                          removeFromWishlist(product.id);
                          toast.success('Removed from wishlist');
                        }}
                      >
                        Remove from Wishlist
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cultural Consultant Recommendations</CardTitle>
              <CardDescription>Handpicked items based on cultural significance and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={wishlist.some(w => w.id === product.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}