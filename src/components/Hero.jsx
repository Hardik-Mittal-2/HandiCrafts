import { Button } from './ui/button';

export function Hero({ onExplore }) {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, #B8860B 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, #C19A6B 0%, transparent 70%)' }}></div>
      </div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <div className="mb-6">
          <h1 
            className="mb-4" 
            style={{ 
              fontFamily: 'Cormorant Garamond, serif', 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              fontWeight: 700,
              color: '#3E2723',
              lineHeight: 1.2
            }}
          >
            Bringing Indian Heritage
            <br />
            <span style={{ color: '#B8860B' }}>to Modern Homes</span>
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#8B5E3C' }}>
            Discover authentic handcrafted treasures from India's finest artisans. Each piece tells a story of tradition, culture, and exceptional craftsmanship.
          </p>
        </div>

        <Button
          size="lg"
          className="gradient-gold rounded-2xl px-8 py-6"
          onClick={onExplore}
        >
          Explore Our Collection
        </Button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#B8860B', fontFamily: 'Cormorant Garamond, serif' }}>
              500+
            </div>
            <div className="text-sm text-muted-foreground">Artisans</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#B8860B', fontFamily: 'Cormorant Garamond, serif' }}>
              2000+
            </div>
            <div className="text-sm text-muted-foreground">Products</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#B8860B', fontFamily: 'Cormorant Garamond, serif' }}>
              15+
            </div>
            <div className="text-sm text-muted-foreground">States</div>
          </div>
        </div>
      </div>
    </section>
  );
}
