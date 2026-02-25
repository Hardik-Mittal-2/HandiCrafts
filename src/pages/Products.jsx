import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const normalizeProduct = (raw) => ({
  id: raw.id || raw._id,
  name: raw.name,
  description: raw.description,
  price: raw.price,
  category: raw.category,
  images: raw.images || (raw.image ? [raw.image] : []),
  artisan: {
    id: raw.artisan?.id || raw.seller?.id || raw.seller?._id || '',
    name: raw.artisan?.name || raw.sellerName || raw.seller?.shopName || raw.seller?.name || 'Unknown Artisan',
  },
  stock: typeof raw.stock === 'number' ? raw.stock : 0,
});

const normalizeContextProduct = (raw) => ({
  id: raw.id || raw._id,
  name: raw.name,
  description: raw.description,
  price: raw.price,
  category: raw.category,
  images: raw.images || (raw.image ? [raw.image] : []),
  artisan: {
    id: raw.sellerId || raw.artisan?.id || raw.seller?.id || raw.seller?._id || '',
    name: raw.artisan?.name || raw.artisan || raw.sellerName || raw.seller?.shopName || raw.seller?.name || 'Unknown Artisan',
  },
  stock: typeof raw.stock === 'number' ? raw.stock : 0,
});

export const Products = () => {
  const { products: contextProducts, user, addToCart } = useApp();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  const canBuy = user?.role === 'buyer' || user?.role === 'consultant';

  const CATEGORY_OPTIONS = [
    { value: 'all', label: 'All' },
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

  const CATEGORY_LABELS = CATEGORY_OPTIONS.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});

  const normalizeCategory = (value: unknown) => {
    const raw = (value ?? '').toString().trim().toLowerCase();
    if (!raw) return '';
    // Handle legacy/UI synonyms.
    if (raw === 'basketry') return 'baskets';
    if (raw === 'wood carving') return 'woodcarving';
    return raw;
  };

  const getCategoryLabel = (value: unknown) => {
    const normalized = normalizeCategory(value);
    if (!normalized) return '';
    return CATEGORY_LABELS[normalized] || normalized.replace(/\b\w/g, (m) => m.toUpperCase());
  };

  useEffect(() => {
    // Show locally-managed products immediately (e.g., created in SellerDashboard).
    if (Array.isArray(contextProducts) && contextProducts.length > 0) {
      setProducts(contextProducts.map(normalizeContextProduct));
      setIsLoading(false);
    }

    // Still attempt to fetch from backend; if it succeeds it will replace local list.
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);

      const data = await response.json();
      const rawProducts = Array.isArray(data) ? data : data.products || [];
      const artisanOnlyProducts = rawProducts
        .filter((product) => {
          const role = product?.seller?.role;
          return !role || role === 'seller';
        })
        .map(normalizeProduct);

      // Merge backend products with local (context) products so local items don't disappear
      // when the backend is reachable but returns an empty list.
      const local = Array.isArray(contextProducts) ? contextProducts.map(normalizeContextProduct) : [];
      const byId = new Map();
      // Prefer backend version when ids collide.
      for (const p of local) byId.set(p.id, p);
      for (const p of artisanOnlyProducts) byId.set(p.id, p);
      setProducts(Array.from(byId.values()));
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fall back to locally-managed products if backend isn't available.
      if (Array.isArray(contextProducts) && contextProducts.length > 0) {
        setProducts(contextProducts.map(normalizeContextProduct));
      } else {
        setProducts([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.artisan.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => normalizeCategory(product.category) === normalizeCategory(selectedCategory)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="mb-4">Explore Our Products</h1>
          <p className="text-lg text-deep-terracotta/70 dark:text-warm-ivory/70">
            Discover unique handcrafted treasures from skilled tribal artisans
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deep-terracotta/40" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deep-terracotta/40" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface appearance-none"
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-deep-terracotta/40 pointer-events-none" size={20} />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-deep-terracotta/40 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-bronze-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-deep-terracotta/60 dark:text-warm-ivory/60">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
                    by {product.artisan?.name}
                  </p>
                  <p className="text-sm text-deep-terracotta/50 dark:text-warm-ivory/50 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl text-bronze-gold">₹{product.price}</span>
                    <span className="text-sm px-3 py-1 bg-bronze-gold/10 text-bronze-gold rounded-full">
                      {getCategoryLabel(product.category)}
                    </span>
                  </div>
                  {product.stock < 10 && product.stock > 0 && (
                    <p className="text-xs text-red-600 mt-2">Only {product.stock} left in stock!</p>
                  )}
                  {product.stock === 0 && (
                    <p className="text-xs text-red-600 mt-2">Out of stock</p>
                  )}

                  {canBuy && (
                    <div className="mt-3">
                      <Button
                        type="button"
                        size="sm"
                        className="w-full gradient-gold"
                        disabled={product.stock === 0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          if (product.stock === 0) {
                            toast.error('This product is out of stock');
                            return;
                          }

                          addToCart({
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            image: product.images?.[0] || '',
                            artisan: product.artisan?.name || 'Unknown Artisan',
                            category: product.category,
                            sellerId: product.artisan?.id || '',
                            stock: product.stock,
                          });
                          toast.success('Added to cart!');
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-dark-surface rounded-xl">
            <p className="text-xl text-deep-terracotta/60 dark:text-warm-ivory/60 mb-4">
              No products found matching your criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-bronze-gold hover:bg-goldenrod text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
