import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext(undefined);

const STORAGE_KEYS = {
  cart: 'haandicrafts.cart',
  wishlist: 'haandicrafts.wishlist',
  orders: 'haandicrafts.orders',
  products: 'haandicrafts.products',
  users: 'haandicrafts.users',
};

function readLocalStorageJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocalStorageJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write failures (e.g., storage disabled/quota exceeded)
  }
}

const mockProducts = [];

const mockUsers = [
  { id: 'seller1', name: 'Artisan Collective 1', email: 'seller1@example.com', role: 'seller' },
  { id: 'seller2', name: 'Artisan Collective 2', email: 'seller2@example.com', role: 'seller' },
  { id: 'consultant1', name: 'Cultural Expert', email: 'consultant@example.com', role: 'consultant' },
];

function sanitizeUsersList(input) {
  const list = Array.isArray(input) ? input : [];
  // Remove legacy placeholder rows that can show up in dashboards.
  return list.filter((u) => {
    const email = (u?.email || '').toString().trim().toLowerCase();
    const name = (u?.name || '').toString().trim().toLowerCase();
    const id = (u?.id || '').toString().trim().toLowerCase();
    if (email === 'buyer@example.com') return false;
    if (name === 'john doe') return false;
    if (id === 'buyer1') return false;
    return true;
  });
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    const stored = readLocalStorageJSON(STORAGE_KEYS.cart, []);
    return Array.isArray(stored) ? stored : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const stored = readLocalStorageJSON(STORAGE_KEYS.wishlist, []);
    return Array.isArray(stored) ? stored : [];
  });
  const [orders, setOrders] = useState(() => {
    const stored = readLocalStorageJSON(STORAGE_KEYS.orders, []);
    return Array.isArray(stored) ? stored : [];
  });
  const [products, setProducts] = useState(() => {
    const stored = readLocalStorageJSON(STORAGE_KEYS.products, mockProducts);
    return Array.isArray(stored) ? stored : mockProducts;
  });
  const [users, setUsers] = useState(() => {
    const stored = readLocalStorageJSON(STORAGE_KEYS.users, mockUsers);
    const sanitizedStored = sanitizeUsersList(stored);
    return sanitizedStored.length > 0 ? sanitizedStored : sanitizeUsersList(mockUsers);
  });

  useEffect(() => {
    // Ensure old placeholder users are removed from persisted storage as well.
    const stored = readLocalStorageJSON(STORAGE_KEYS.users, mockUsers);
    const sanitized = sanitizeUsersList(stored);
    if (Array.isArray(stored) && sanitized.length !== stored.length) {
      writeLocalStorageJSON(STORAGE_KEYS.users, sanitized);
      setUsers(sanitized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    writeLocalStorageJSON(STORAGE_KEYS.cart, cart);
  }, [cart]);

  useEffect(() => {
    writeLocalStorageJSON(STORAGE_KEYS.wishlist, wishlist);
  }, [wishlist]);

  useEffect(() => {
    writeLocalStorageJSON(STORAGE_KEYS.orders, orders);
  }, [orders]);

  useEffect(() => {
    writeLocalStorageJSON(STORAGE_KEYS.products, products);
  }, [products]);

  useEffect(() => {
    writeLocalStorageJSON(STORAGE_KEYS.users, users);
  }, [users]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const addOrder = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? product : p))
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateUserStatus = (userId, blocked) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, blocked } : u))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        orders,
        addOrder,
        updateOrderStatus,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        users,
        updateUserStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
