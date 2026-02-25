import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t" style={{ backgroundColor: '#3E2723' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="mb-4" style={{ color: '#B8860B' }}>About HaandiCrafts</h3>
            <p className="text-sm" style={{ color: '#FFF8F2', opacity: 0.8 }}>
              Bringing Indian heritage to modern homes. We connect artisans with conscious buyers who appreciate authentic craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4" style={{ color: '#B8860B' }}>Quick Links</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#FFF8F2', opacity: 0.8 }}>
              <li>About Us</li>
              <li>Artisan Stories</li>
              <li>Sustainability</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="mb-4" style={{ color: '#B8860B' }}>Connect With Us</h3>
            <div className="flex gap-4 mb-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: '#B8860B' }} />
              <Instagram className="h-5 w-5 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: '#B8860B' }} />
              <Twitter className="h-5 w-5 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: '#B8860B' }} />
              <Mail className="h-5 w-5 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: '#B8860B' }} />
            </div>
            <p className="text-sm" style={{ color: '#FFF8F2', opacity: 0.8 }}>
              support@haandicrafts.com
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm" style={{ borderColor: 'rgba(255, 248, 242, 0.1)', color: '#FFF8F2', opacity: 0.6 }}>
          © 2025 HaandiCrafts. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
