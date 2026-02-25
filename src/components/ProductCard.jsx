import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductCard({ product, onAddToCart, onAddToWishlist, isInWishlist }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: '#FFFBF5' }}>
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {onAddToWishlist && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => onAddToWishlist(product)}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
          </Button>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">by {product.artisan}</p>
        <div className="flex items-center justify-between">
          <div>
            <span style={{ color: '#B8860B', fontWeight: 600, fontSize: '1.125rem' }}>
              ₹{product.price.toLocaleString()}
            </span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#F5E6D3', color: '#8B5E3C' }}>
            {product.category}
          </span>
        </div>
      </CardContent>

      {onAddToCart && (
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full gradient-gold rounded-2xl"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
