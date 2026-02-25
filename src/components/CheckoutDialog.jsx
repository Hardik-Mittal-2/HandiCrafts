import { useState } from 'react';
import { useApp } from '../lib/context';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

export function CheckoutDialog({ isOpen, onClose, onSuccess }) {
  const { cart, addOrder, clearCart, user } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = () => {
    // Validation
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate phone number
    if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Create order for each seller
    const sellerOrders = {};
    
    cart.forEach(item => {
      if (!sellerOrders[item.sellerId]) {
        sellerOrders[item.sellerId] = [];
      }
      sellerOrders[item.sellerId].push(item);
    });

    // Create separate orders for each seller
    Object.entries(sellerOrders).forEach(([sellerId, items]) => {
      const orderTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      const order = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        buyerId: user?.id || '',
        buyerName: formData.name,
        sellerId: sellerId,
        products: items,
        total: orderTotal,
        status: 'pending',
        isBulkOrder: user?.role === 'consultant',
        shippingDetails: formData,
        paymentMethod,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      };

      addOrder(order);
    });

    clearCart();
    onSuccess();
    onClose();
    
    // Reset form
    setFormData({
      name: user?.name || '',
      phone: '',
      email: user?.email || '',
      address: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Complete your order</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="address">Shipping Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter complete address with pincode"
              rows={3}
            />
          </div>

          <div>
            <Label className="mb-3 block">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex-1 cursor-pointer">
                  <div>
                    <p>Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay when you receive</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex-1 cursor-pointer">
                  <div>
                    <p>UPI Payment</p>
                    <p className="text-xs text-muted-foreground">Pay via UPI apps</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <span>Order Total</span>
              <span className="text-2xl" style={{ color: '#B8860B', fontWeight: 600 }}>
                ₹{total.toLocaleString()}
              </span>
            </div>

            <Button className="w-full gradient-gold rounded-2xl" onClick={handleSubmit}>
              Place Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}