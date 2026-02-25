import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingBag, Calendar, Users, Package, TrendingUp, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useApp } from '../lib/context';

export function NewHomepage() {
  const { products, users } = useApp();

  const activeSellers = users.filter((u) => u.role === 'seller' && !u.blocked);
  const sellerIdsFromProducts = new Set(products.map((product) => product.sellerId).filter(Boolean));
  const sellerCount = Math.max(activeSellers.length, sellerIdsFromProducts.size);
  const totalProducts = products.length;
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <section 
        className="relative h-[700px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1759607236409-1df137ecb3b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMGFydGlzYW4lMjBtYXJrZXR8ZW58MXx8fHwxNzY0Njg4MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6 text-5xl md:text-6xl lg:text-7xl">
              Discover Authentic Tribal Handicrafts
            </h1>
            <p className="text-white/90 text-xl md:text-2xl mb-8 leading-relaxed">
              Connect directly with skilled artisans and bring home unique, handcrafted treasures that tell a story
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-8 py-4 bg-gradient-to-r from-bronze-gold to-goldenrod text-white hover:shadow-2xl transition-all rounded-xl flex items-center gap-2 text-lg"
              >
                <ShoppingBag size={24} />
                Explore Products
                <ArrowRight size={24} />
              </Link>
              <Link
                to="/exhibitions"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 transition-all rounded-xl flex items-center gap-2 text-lg"
              >
                <Calendar size={24} />
                View Exhibitions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-gradient-to-r from-bronze-gold via-goldenrod to-bronze-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white transform hover:scale-105 transition-transform">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Users size={48} />
                </div>
              </div>
              <div className="text-5xl md:text-6xl mb-2" style={{ fontWeight: 700 }}>
                {sellerCount}+
              </div>
              <div className="text-xl md:text-2xl opacity-90">Skilled Artisans</div>
            </div>
            
            <div className="text-center text-white transform hover:scale-105 transition-transform">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Package size={48} />
                </div>
              </div>
              <div className="text-5xl md:text-6xl mb-2" style={{ fontWeight: 700 }}>
                {totalProducts}+
              </div>
              <div className="text-xl md:text-2xl opacity-90">Unique Products</div>
            </div>
            
            <div className="text-center text-white transform hover:scale-105 transition-transform">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Star size={48} />
                </div>
              </div>
              <div className="text-5xl md:text-6xl mb-2" style={{ fontWeight: 700 }}>
                5+
              </div>
              <div className="text-xl md:text-2xl opacity-90">Craft Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-warm-ivory dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-4xl md:text-5xl">Featured Products</h2>
            <p className="text-lg md:text-xl text-deep-terracotta/70 dark:text-warm-ivory/70 max-w-2xl mx-auto">
              Handpicked treasures from our talented artisans
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-deep-terracotta/60">No products available yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.stock && product.stock < 5 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                          Low Stock
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60 mb-3">
                        by {product.artisan}
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl text-bronze-gold" style={{ fontWeight: 600 }}>
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-xs px-3 py-1 bg-bronze-gold/10 text-bronze-gold rounded-full">
                          {product.category}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Stock: {product.stock || 0} units
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-bronze-gold to-goldenrod text-white hover:shadow-2xl transition-all rounded-xl text-lg"
                >
                  View All Products
                  <ArrowRight size={24} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Exhibitions Section */}
      <section className="py-20 bg-gradient-to-br from-deep-terracotta/5 to-bronze-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-4xl md:text-5xl">Upcoming Exhibitions</h2>
            <p className="text-lg md:text-xl text-deep-terracotta/70 dark:text-warm-ivory/70 max-w-2xl mx-auto">
              Experience the rich heritage of tribal crafts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Mock exhibitions - will be replaced with real data */}
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-64 overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1643295577643-b46e7b3f17db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBleGhpYml0aW9ufGVufDB8fHx8MTczMzk3MDM4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Exhibition"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-3">Traditional Crafts Exhibition {idx + 1}</h3>
                  <p className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60 mb-4">
                    Experience the beauty of traditional handicrafts from tribal artisans
                  </p>
                  <div className="flex items-center gap-2 text-sm text-bronze-gold mb-2">
                    <Calendar size={16} />
                    <span>Coming Soon</span>
                  </div>
                  <div className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60">
                    Location TBD
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/exhibitions"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-bronze-gold to-goldenrod text-white hover:shadow-2xl transition-all rounded-xl text-lg"
            >
              View All Exhibitions
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-deep-terracotta via-bronze-gold to-goldenrod text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="mb-6 text-4xl md:text-5xl">Join Our Artisan Community</h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Are you an artisan? Showcase your crafts to customers worldwide
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-deep-terracotta hover:bg-warm-ivory transition-all rounded-xl text-lg shadow-2xl"
          >
            <Users size={24} />
            Become an Artisan
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}
