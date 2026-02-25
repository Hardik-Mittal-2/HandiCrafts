import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../lib/context';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CartSheet({ isOpen, onClose, onCheckout }) {
  const { cart, updateCartQuantity, removeFromCart } = useApp();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="h-16 w-16 mb-4" style={{ color: '#C19A6B', opacity: 0.3 }} />
              <p className="text-muted-foreground mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add some beautiful handicrafts to get started!</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                    <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">by {item.artisan}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <span style={{ color: '#B8860B', fontWeight: 600 }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl" style={{ color: '#B8860B', fontWeight: 600 }}>
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                <Button
                  className="w-full gradient-gold rounded-2xl"
                  onClick={() => {
                    onCheckout();
                    onClose();
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
