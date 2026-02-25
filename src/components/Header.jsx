import { ShoppingCart, Heart, User, LogOut, LayoutDashboard, Store, Menu, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../lib/context';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../lib/theme-context';

export function Header({ onCartClick, onWishlistClick }) {
  const { user, cart, wishlist, setUser } = useApp();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardLabel = user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard';

  const handleLogout = () => {
    logout();
    setUser(null);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/exhibitions', label: 'Exhibitions' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-[#B8860B]" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              HaandiCrafts
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors hover:text-bronze-gold ${
                  location.pathname === link.to ? 'text-bronze-gold' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {!user && (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="gradient-gold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {(user?.role === 'buyer' || user?.role === 'consultant') && (
              <>
                <Link to="/dashboard" className="hidden md:flex">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    My Dashboard
                  </Button>
                </Link>
                {user?.role === 'buyer' && (
                  <Link to="/dashboard?tab=wishlist">
                    <Button variant="ghost" size="icon" className="relative">
                      <Heart className="h-5 w-5" />
                      {wishlist.length > 0 && (
                        <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center" style={{ backgroundColor: '#B8860B' }}>
                          {wishlist.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={onCartClick}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center" style={{ backgroundColor: '#B8860B' }}>
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </>
            )}

            {user && user.role !== 'buyer' && user.role !== 'consultant' && (
              <Link to="/dashboard" className="hidden md:flex">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {dashboardLabel}
                </Button>
              </Link>
            )}
            
            {user && (
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="hidden md:flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {!user && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-2 transition-colors hover:text-bronze-gold ${
                    location.pathname === link.to ? 'text-bronze-gold' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <div className="flex flex-col gap-2 mt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full gradient-gold">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}