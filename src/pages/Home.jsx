import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Package, Award, ShoppingBag, Calendar, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [stats, setStats] = useState({
    totalArtisans: 0,
    totalProducts: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API calls
      // Mock data for now
      setStats({
        totalArtisans: 543,
        totalProducts: 2187,
        totalCategories: 15,
      });

      // Fetch products
      const productsRes = await fetch('/api/products?limit=8');
      if (productsRes.ok) {
        const data = await productsRes.json();
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
      }

      // Fetch exhibitions
      const exhibitionsRes = await fetch('/api/exhibitions?status=upcoming&limit=3');
      if (exhibitionsRes.ok) {
        const data = await exhibitionsRes.json();
        setExhibitions(data.exhibitions || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1753982862264-c4cd78f9e8b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMHBvdHRlcnklMjB0ZXh0aWxlfGVufDF8fHx8MTc2NDY4NzM1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Tribal Handicrafts"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-terracotta/90 to-bronze-gold/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="mb-6">
            Discover Authentic Tribal Handicrafts
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect directly with skilled artisans and bring home unique, handcrafted treasures that tell a story
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="px-8 py-4 bg-white text-deep-terracotta hover:bg-warm-ivory transition-colors rounded-lg flex items-center gap-2"
            >
              Explore Products
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/exhibitions"
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 transition-colors rounded-lg flex items-center gap-2"
            >
              View Exhibitions
              <Calendar size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-bronze-gold to-goldenrod">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="flex justify-center mb-4">
                <Users size={48} />
              </div>
              <div className="text-5xl mb-2">{stats.totalArtisans}+</div>
              <div className="text-xl opacity-90">Skilled Artisans</div>
            </div>
            <div className="text-center text-white">
              <div className="flex justify-center mb-4">
                <Package size={48} />
              </div>
              <div className="text-5xl mb-2">{stats.totalProducts}+</div>
              <div className="text-xl opacity-90">Unique Products</div>
            </div>
            <div className="text-center text-white">
              <div className="flex justify-center mb-4">
                <Award size={48} />
              </div>
              <div className="text-5xl mb-2">{stats.totalCategories}+</div>
              <div className="text-xl opacity-90">Craft Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-warm-ivory dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Featured Products</h2>
            <p className="text-lg text-deep-terracotta/70 dark:text-warm-ivory/70">
              Handpicked treasures from our talented artisans
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={product.images[0] || 'https://images.unsplash.com/photo-1760726744405-b955b568ba3e'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60 mb-2">
                    by {product.artisan?.name || 'Unknown'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl text-bronze-gold">₹{product.price}</span>
                    <span className="text-sm px-3 py-1 bg-bronze-gold/10 text-bronze-gold rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {products.length === 0 && (
            <div className="text-center mb-12 text-deep-terracotta/60 dark:text-warm-ivory/60">
              No products available yet.
            </div>
          )}

          <div className="text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-bronze-gold hover:bg-goldenrod text-white rounded-lg transition-colors"
            >
              View All Products
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Exhibitions Section */}
      <section className="py-20 bg-gradient-to-br from-bronze-gold/5 to-goldenrod/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Upcoming Exhibitions</h2>
            <p className="text-lg text-deep-terracotta/70 dark:text-warm-ivory/70">
              Experience the rich heritage of tribal crafts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {exhibitions.length > 0 ? (
              exhibitions.map((exhibition) => (
                <Link
                  key={exhibition.id}
                  to={`/exhibitions/${exhibition.id}`}
                  className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="h-64 overflow-hidden">
                    <ImageWithFallback
                      src={exhibition.images[0] || 'https://images.unsplash.com/photo-1643295577643-b46e7b3f17db'}
                      alt={exhibition.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl mb-3">{exhibition.title}</h3>
                    <p className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60 mb-4 line-clamp-2">
                      {exhibition.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-bronze-gold mb-2">
                      <Calendar size={16} />
                      <span>{new Date(exhibition.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60">
                      {exhibition.location}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Mock exhibitions
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="h-64 overflow-hidden bg-bronze-gold/10">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1643295577643-b46e7b3f17db"
                      alt="Exhibition"
                      className="w-full h-full object-cover"
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
              ))
            )}
          </div>

          <div className="text-center">
            <Link
              to="/exhibitions"
              className="inline-flex items-center gap-2 px-8 py-4 bg-bronze-gold hover:bg-goldenrod text-white rounded-lg transition-colors"
            >
              View All Exhibitions
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-deep-terracotta to-bronze-gold text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6">Join Our Artisan Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Are you an artisan? Showcase your crafts to customers worldwide
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-deep-terracotta hover:bg-warm-ivory transition-colors rounded-lg"
          >
            Become an Artisan
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};
