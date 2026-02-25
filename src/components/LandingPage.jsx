import { useState } from 'react';
import { useApp } from '../lib/context';
import { Hero } from './Hero';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function LandingPage({ onNavigate }) {
  const { products, addToCart, addToWishlist, wishlist } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Pottery', 'Textiles', 'Metalwork', 'Wood Carving', 'Basketry'];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div>
      <Hero onExplore={() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      }} />

      <section id="products" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-4">Discover Authentic Handicrafts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every piece is handcrafted with love by skilled artisans across India. Support traditional craftsmanship and bring home a piece of heritage.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap gap-2 p-2 rounded-2xl" style={{ backgroundColor: '#FFFBF5' }}>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'gradient-gold rounded-xl' : 'rounded-xl'}
              >
                {category === 'all' ? 'All Products' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
              isInWishlist={wishlist.some(w => w.id === product.id)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No products found in this category.
          </div>
        )}
      </section>

      {/* Featured Artisans Section */}
      <section className="py-16" style={{ backgroundColor: '#FFFBF5' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Featured Artisans</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the talented craftspeople behind our beautiful products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Rajesh Kumar', 'Meera Devi', 'Suresh Patel'].map((artisan, index) => (
              <div key={artisan} className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-4" style={{ 
                  background: `linear-gradient(135deg, #B8860B 0%, #C19A6B 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontFamily: 'Cormorant Garamond, serif'
                }}>
                  {artisan.charAt(0)}
                </div>
                <h3 className="mb-2">{artisan}</h3>
                <p className="text-sm text-muted-foreground">
                  {index === 0 ? 'Master Potter' : index === 1 ? 'Textile Weaver' : 'Brass Artisan'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
