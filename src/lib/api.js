// Mock API for pure React frontend (no backend required)

// Mock data
const mockProducts = [
  {
    _id: '1',
    name: 'Handcrafted Pottery Vase',
    description: 'Beautiful handmade ceramic vase with traditional patterns',
    price: 2500,
    images: ['/placeholder.svg'],
    category: 'Pottery',
    seller: { _id: 's1', name: 'Artisan Crafts', email: 'artisan@example.com' },
    stock: 10,
    isOverpriced: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Embroidered Silk Scarf',
    description: 'Hand-embroidered silk scarf with floral motifs',
    price: 1800,
    images: ['/placeholder.svg'],
    category: 'Textiles',
    seller: { _id: 's2', name: 'Silk Weavers', email: 'silk@example.com' },
    stock: 25,
    isOverpriced: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'Wooden Carved Elephant',
    description: 'Intricately carved wooden elephant statue',
    price: 3500,
    images: ['/placeholder.svg'],
    category: 'Wood Craft',
    seller: { _id: 's1', name: 'Artisan Crafts', email: 'artisan@example.com' },
    stock: 5,
    isOverpriced: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '4',
    name: 'Brass Lamp',
    description: 'Traditional brass lamp with intricate engravings',
    price: 4200,
    images: ['/placeholder.svg'],
    category: 'Metal Craft',
    seller: { _id: 's3', name: 'Metal Masters', email: 'metal@example.com' },
    stock: 8,
    isOverpriced: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '5',
    name: 'Hand-painted Jewelry Box',
    description: 'Beautifully painted wooden jewelry box',
    price: 1200,
    images: ['/placeholder.svg'],
    category: 'Wood Craft',
    seller: { _id: 's2', name: 'Silk Weavers', email: 'silk@example.com' },
    stock: 15,
    isOverpriced: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6',
    name: 'Terracotta Wall Hanging',
    description: 'Decorative terracotta wall piece with rural themes',
    price: 900,
    images: ['/placeholder.svg'],
    category: 'Pottery',
    seller: { _id: 's1', name: 'Artisan Crafts', email: 'artisan@example.com' },
    stock: 20,
    isOverpriced: false,
    createdAt: new Date().toISOString(),
  },
];

const mockExhibitions = [];

// Helper to get/set users from localStorage for persistence
const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('mockUsers') || '{}');
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};

// Helper to get/set tickets from localStorage for persistence
const getStoredTickets = () => {
  try {
    return JSON.parse(localStorage.getItem('mockTickets') || '[]');
  } catch {
    return [];
  }
};

const saveTickets = (tickets) => {
  localStorage.setItem('mockTickets', JSON.stringify(tickets));
};

// Helper to get/set exhibitions from localStorage for persistence
const getStoredExhibitions = () => {
  try {
    return JSON.parse(localStorage.getItem('mockExhibitions') || '[]');
  } catch {
    return [];
  }
};

const saveExhibitions = (exhibitions) => {
  localStorage.setItem('mockExhibitions', JSON.stringify(exhibitions));
};

let mockOrders = [];
let mockWishlist = [];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Socket mock (no-op)
export const connectSocket = () => ({ on: () => {}, emit: () => {}, disconnect: () => {} });
export const disconnectSocket = () => {};
export const getSocket = () => null;

// Authentication API
export const authAPI = {
  register: async (data) => {
    await delay(300);
    const users = getStoredUsers();
    
    // Check if email already exists
    if (users[data.email]) {
      throw new Error('Email already registered');
    }
    
    const user = {
      _id: 'u' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role || 'buyer',
      isBlocked: false,
      blockReason: '',
      createdAt: new Date().toISOString(),
      token: 'mock-token-' + Date.now(),
    };
    users[user.email] = { ...user, password: data.password };
    saveUsers(users);
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  login: async (email, password) => {
    await delay(300);
    const users = getStoredUsers();
    
    // Check registered users first
    if (users[email]) {
      if (users[email].password !== password) {
        throw new Error('Invalid email or password');
      }
      if (users[email].isBlocked) {
        throw new Error(`Account is blocked. Reason: ${users[email].blockReason || 'Contact admin'}`);
      }
      const user = { ...users[email] };
      delete user.password;
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    
    // Demo admin account (always available)
    if (email === 'admin@demo.com' && password === 'demo123') {
      const user = { _id: 'demo-admin', name: 'Demo Admin', email: 'admin@demo.com', role: 'admin', token: 'demo-token-' + Date.now() };
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid email or password');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    await delay(100);
    const user = localStorage.getItem('user');
    if (user) return JSON.parse(user);
    throw new Error('Not authenticated');
  },

  updateProfile: async (data) => {
    await delay(300);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params) => {
    await delay(200);
    let products = [...mockProducts];
    if (params?.category) {
      products = products.filter(p => p.category === params.category);
    }
    if (params?.search) {
      const search = params.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }
    return { products, total: products.length };
  },

  getById: async (id) => {
    await delay(100);
    const product = mockProducts.find(p => p._id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  create: async (data) => {
    await delay(300);
    const newProduct = {
      _id: 'p' + Date.now(),
      ...data,
      images: data.images || ['/placeholder.svg'],
      seller: JSON.parse(localStorage.getItem('user') || '{}'),
      createdAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  update: async (id, data) => {
    await delay(300);
    const index = mockProducts.findIndex(p => p._id === id);
    if (index === -1) throw new Error('Product not found');
    mockProducts[index] = { ...mockProducts[index], ...data };
    return mockProducts[index];
  },

  delete: async (id) => {
    await delay(200);
    const index = mockProducts.findIndex(p => p._id === id);
    if (index !== -1) mockProducts.splice(index, 1);
    return { message: 'Product deleted' };
  },

  flag: async (id, isOverpriced) => {
    await delay(200);
    const product = mockProducts.find(p => p._id === id);
    if (product) product.isOverpriced = isOverpriced;
    return product;
  },
};

// Orders API
export const ordersAPI = {
  create: async (data) => {
    await delay(300);
    const order = {
      _id: 'o' + Date.now(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      buyer: JSON.parse(localStorage.getItem('user') || '{}'),
    };
    mockOrders.push(order);
    return order;
  },

  getAll: async () => {
    await delay(200);
    return mockOrders;
  },

  getById: async (id) => {
    await delay(100);
    const order = mockOrders.find(o => o._id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },

  updateStatus: async (id, status, note) => {
    await delay(200);
    const order = mockOrders.find(o => o._id === id);
    if (order) {
      order.status = status;
      if (note) order.note = note;
    }
    return order;
  },

  getSellerStats: async (period = 'daily') => {
    await delay(200);
    return {
      totalSales: 15000,
      totalOrders: 12,
      pendingOrders: 3,
      completedOrders: 9,
      chartData: [
        { date: '2026-02-20', sales: 2500, orders: 2 },
        { date: '2026-02-21', sales: 3200, orders: 3 },
        { date: '2026-02-22', sales: 1800, orders: 1 },
        { date: '2026-02-23', sales: 4100, orders: 4 },
        { date: '2026-02-24', sales: 3400, orders: 2 },
      ],
    };
  },
};

// Exhibitions API
export const exhibitionsAPI = {
  getAll: async (status) => {
    await delay(200);
    const exhibitions = getStoredExhibitions();
    if (status) {
      return exhibitions.filter(e => e.status === status);
    }
    return exhibitions;
  },

  create: async (data) => {
    await delay(300);
    const exhibition = {
      _id: 'e' + Date.now(),
      ...data,
      participants: [],
    };
    const exhibitions = getStoredExhibitions();
    exhibitions.push(exhibition);
    saveExhibitions(exhibitions);
    return exhibition;
  },

  update: async (id, data) => {
    await delay(300);
    const exhibitions = getStoredExhibitions();
    const index = exhibitions.findIndex(e => e._id === id);
    if (index !== -1) {
      exhibitions[index] = { ...exhibitions[index], ...data };
      saveExhibitions(exhibitions);
      return exhibitions[index];
    }
    throw new Error('Exhibition not found');
  },

  delete: async (id) => {
    await delay(200);
    const exhibitions = getStoredExhibitions();
    const filtered = exhibitions.filter(e => e._id !== id);
    saveExhibitions(filtered);
    return { message: 'Exhibition deleted' };
  },

  register: async (id, booth) => {
    await delay(300);
    const exhibition = mockExhibitions.find(e => e._id === id);
    if (exhibition) {
      exhibition.participants.push({
        user: JSON.parse(localStorage.getItem('user') || '{}'),
        booth,
        status: 'pending',
      });
    }
    return exhibition;
  },

  updateParticipant: async (exhibitionId, participantId, status) => {
    await delay(200);
    return { message: 'Participant updated' };
  },

  getMyRegistrations: async () => {
    await delay(200);
    return [];
  },
};

// Wishlist API
export const wishlistAPI = {
  get: async () => {
    await delay(100);
    return mockWishlist;
  },

  add: async (productId) => {
    await delay(200);
    const product = mockProducts.find(p => p._id === productId);
    if (product && !mockWishlist.find(w => w._id === productId)) {
      mockWishlist.push(product);
    }
    return mockWishlist;
  },

  remove: async (productId) => {
    await delay(200);
    mockWishlist = mockWishlist.filter(w => w._id !== productId);
    return mockWishlist;
  },
};

// Admin API
export const adminAPI = {
  getUsers: async (role, search) => {
    await delay(200);
    const users = getStoredUsers();
    let userList = Object.values(users).map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
    
    // Filter by role if specified (skip if 'all' or empty)
    if (role && role !== 'all') {
      userList = userList.filter(u => u.role === role);
    }
    
    // Filter by search if specified
    if (search) {
      const searchLower = search.toLowerCase();
      userList = userList.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }
    
    return userList;
  },

  blockUser: async (id, isBlocked, reason) => {
    await delay(200);
    const users = getStoredUsers();
    
    // Find user by id
    for (const email in users) {
      if (users[email]._id === id) {
        users[email].isBlocked = isBlocked;
        users[email].blockReason = reason || '';
        saveUsers(users);
        return { message: isBlocked ? 'User blocked' : 'User unblocked', user: users[email] };
      }
    }
    
    throw new Error('User not found');
  },

  getStats: async () => {
    await delay(200);
    const users = getStoredUsers();
    const userCount = Object.keys(users).length;
    return {
      totalUsers: userCount,
      totalProducts: mockProducts.length,
      totalOrders: mockOrders.length,
      totalRevenue: mockOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      newUsers: userCount,
      pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
    };
  },

  getSales: async (period = 'daily') => {
    await delay(200);
    return [
      { date: '2026-02-20', sales: 12500 },
      { date: '2026-02-21', sales: 18200 },
      { date: '2026-02-22', sales: 9800 },
      { date: '2026-02-23', sales: 21100 },
      { date: '2026-02-24', sales: 15400 },
      { date: '2026-02-25', sales: 19000 },
    ];
  },

  getAllOrders: async () => {
    await delay(200);
    return mockOrders;
  },

  getTickets: async () => {
    await delay(200);
    return getStoredTickets();
  },

  reviewTicket: async (ticketId, status, adminResponse) => {
    await delay(200);
    const tickets = getStoredTickets();
    const index = tickets.findIndex(t => t._id === ticketId);
    if (index !== -1) {
      tickets[index].status = status;
      tickets[index].adminResponse = adminResponse || '';
      tickets[index].reviewedAt = new Date().toISOString();
      saveTickets(tickets);
      
      // If approved, automatically unblock the user
      if (status === 'Approved') {
        const users = getStoredUsers();
        const ticketEmail = tickets[index].email;
        if (users[ticketEmail]) {
          users[ticketEmail].isBlocked = false;
          users[ticketEmail].blockReason = '';
          saveUsers(users);
        }
      }
      
      return { message: 'Ticket reviewed', ticket: tickets[index] };
    }
    throw new Error('Ticket not found');
  },
};

// Support Tickets API
export const ticketsAPI = {
  create: async (data) => {
    await delay(300);
    
    // Convert file to data URL for storage
    let proofDataUrl = null;
    let proofFileName = null;
    if (data.proof) {
      proofFileName = data.proof.name;
      proofDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(data.proof);
      });
    }
    
    const ticket = { 
      _id: 't' + Date.now(), 
      email: data.email,
      message: data.message,
      proofFileName: proofFileName,
      proofDataUrl: proofDataUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const tickets = getStoredTickets();
    tickets.push(ticket);
    saveTickets(tickets);
    return ticket;
  },
};
