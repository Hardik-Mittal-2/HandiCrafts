# 🎨 HaandiCrafts - Tribal Artisan Marketplace

A full-stack marketplace platform connecting tribal artisans, buyers, and cultural consultants. Built with React + Vite for the frontend and Node.js + Express + MongoDB for the backend.

![Royal Earthy Elegance Theme](https://img.shields.io/badge/Theme-Royal%20Earthy%20Elegance-C19A6B)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## ✨ Features

### 🔐 Multi-Role Authentication System
- **Admin**: Platform management, user oversight, analytics
- **Seller (Artisan)**: Product management, order handling, earnings tracking
- **Buyer (Customer)**: Browse products, manage cart, track orders
- **Consultant**: Exhibition management, bulk orders, product recommendations

### 🛍️ Core Functionality
- **Real-time Updates**: Instant notifications for new products, orders, and status changes (Socket.IO)
- **Product Marketplace**: Browse, search, and filter handicraft products
- **Shopping Cart & Wishlist**: Save favorites and manage purchases
- **Order Management**: Complete order lifecycle (Pending → Confirmed → Shipped → Delivered)
- **Payment Options**: Cash on Delivery (COD) and UPI
- **Exhibition System**: Register for cultural exhibitions and craft fairs
- **Analytics Dashboard**: Sales charts (daily/weekly/monthly/yearly)
- **Admin Tools**: User management, product flagging, sales metrics
- **Responsive Design**: Works seamlessly on desktop and mobile

### 🎨 Design System
**Royal Earthy Elegance** theme with:
- Bronze Gold (#C19A6B)
- Deep Terracotta (#8B5E3C)
- Warm Ivory (#FFF8F2)
- Goldenrod (#B8860B)
- Typography: Cormorant Garamond (headings) + Poppins (body)
- Dark/Light theme toggle

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript/JavaScript
- **Vite** for fast development and building
- **Tailwind CSS 4.0** for styling
- **Recharts** for data visualization
- **Socket.IO Client** for real-time features
- **Lucide React** for icons
- **Sonner** for toast notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.IO** for real-time communication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher) - Local or Atlas
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd haandicrafts
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI, JWT_SECRET, etc.

# Seed the database with sample data
npm run seed

# Start the server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to root directory
cd ..

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access the Application

Open `http://localhost:5173` in your browser and login with sample credentials:

**Admin**
- Email: `admin@haandicrafts.com`
- Password: `admin123`

**Seller (Pottery)**
- Email: `ramesh@artisan.com`
- Password: `seller123`

**Buyer**
- Email: `priya@buyer.com`
- Password: `buyer123`

**Consultant**
- Email: `maya@consultant.com`
- Password: `consultant123`

## 📁 Project Structure

```
haandicrafts/
├── src/                      # Frontend source
│   ├── components/          # React components
│   │   ├── BuyerDashboard.tsx
│   │   ├── SellerDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── ConsultantDashboard.tsx
│   │   ├── Header.tsx
│   │   ├── Login.tsx
│   │   └── ...
│   ├── lib/                 # Utilities and context
│   │   ├── api.ts          # API client
│   │   ├── context.tsx     # App state management
│   │   └── theme-context.tsx
│   ├── styles/
│   │   └── globals.css     # Global styles
│   └── App.tsx             # Main app component
│
├── server/                  # Backend source
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Exhibition.js
│   │   └── Wishlist.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── exhibitions.js
│   │   ├── admin.js
│   │   └── wishlist.js
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js           # Main server
│   ├── seed.js             # Database seeder
│   └── package.json
│
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Seller/Consultant)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/products/:id/flag` - Flag as overpriced (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/seller/stats` - Get seller statistics

### Exhibitions
- `GET /api/exhibitions` - Get all exhibitions
- `POST /api/exhibitions` - Create exhibition (Admin/Consultant)
- `POST /api/exhibitions/:id/register` - Register for exhibition
- `GET /api/exhibitions/my-registrations` - Get registrations

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/block` - Block/unblock user
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/sales` - Get sales analytics

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

## 📊 Database Models

### User
- Multi-role support (buyer, seller, admin, consultant)
- Password hashing with bcrypt
- Block/unblock functionality
- Statistics tracking (orders, spent, earnings)

### Product
- Category-based organization
- Stock management
- Seller association
- Rating and review tracking
- Overpriced flagging (admin feature)

### Order
- Auto-generated order numbers
- Multi-item support
- Shipping address validation
- Status tracking with history
- Bulk order support for consultants

### Exhibition
- Event management
- Participant registration and approval
- Organizer role
- Status tracking (upcoming, ongoing, completed)

## 🎯 User Roles & Permissions

### Admin
- ✅ View all users, products, and orders
- ✅ Block/unblock user accounts
- ✅ Flag overpriced products
- ✅ Access platform analytics
- ✅ Monitor suspicious activities

### Seller (Artisan)
- ✅ Add, edit, and delete products
- ✅ Manage product inventory
- ✅ View and update order status
- ✅ Access earnings analytics
- ✅ Register for exhibitions
- ✅ Real-time order notifications

### Buyer (Customer)
- ✅ Browse and search products
- ✅ Add to cart and wishlist
- ✅ Place orders (COD/UPI)
- ✅ Track order status
- ✅ View order history
- ✅ Real-time order updates

### Consultant
- ✅ Create and manage exhibitions
- ✅ Place bulk orders
- ✅ Add and sell products
- ✅ Track buyer activity
- ✅ Recommend products to buyers
- ✅ Approve artisan participation

## 🔔 Real-time Features

The app uses Socket.IO for real-time updates:

- **New Product Alerts**: Customers see new products instantly
- **Order Notifications**: Sellers receive immediate order alerts
- **Status Updates**: Buyers get real-time order status changes
- **User Blocking**: Blocked users are notified immediately
- **Exhibition Updates**: New exhibitions broadcast to all users

## 🎨 Theme Customization

The app features a **Dark/Light Theme Toggle**:

```javascript
// In your component
import { useTheme } from './lib/theme-context';

const { theme, toggleTheme } = useTheme();
```

Colors automatically adapt based on theme preference.

## 🧪 Testing

### Manual Testing
1. Register as different user roles
2. Create products as a seller
3. Place orders as a buyer
4. Manage users as admin
5. Create exhibitions as consultant

### API Testing
Use Postman, cURL, or the integrated frontend to test endpoints.

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
cd server
# Set environment variables
# Deploy using platform-specific commands
```

### Environment Variables

**Frontend (.env)**
```
VITE_API_URL=https://your-backend-url.com
VITE_WS_URL=https://your-backend-url.com
```

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/haandicrafts
JWT_SECRET=your_super_secret_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Account blocking for suspicious activity

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ for empowering tribal artisans and preserving traditional crafts.

## 🆘 Support

For issues and questions:
- Open a GitHub issue
- Email: support@haandicrafts.com

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Product reviews and ratings
- [ ] Advanced search with filters
- [ ] Multi-language support
- [ ] AI-powered product recommendations
- [ ] Video product demonstrations
- [ ] Live chat support

---

**HaandiCrafts** - Connecting Artisans with the World 🌍✨
