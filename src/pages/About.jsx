import React from 'react';
import { Heart, Users, Award, Target, Eye, Zap } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Authenticity',
      description: 'Every product tells a unique story of traditional craftsmanship',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Empowering tribal artisans and preserving cultural heritage',
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Handpicked products meeting the highest standards of excellence',
    },
    {
      icon: Target,
      title: 'Fair Trade',
      description: 'Ensuring artisans receive fair compensation for their work',
    },
  ];

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Cultural Advisor',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    },
    {
      name: 'Meera Devi',
      role: 'Artisan Relations',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    },
    {
      name: 'Vikram Patel',
      role: 'Technology Lead',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1760726744405-b955b568ba3e"
            alt="About HaandiCrafts"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-terracotta/90 to-bronze-gold/80"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="mb-6">About HaandiCrafts</h1>
          <p className="text-xl">
            Connecting the world with authentic tribal handicrafts while empowering artisan communities
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-bronze-gold to-goldenrod rounded-full flex items-center justify-center mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h2 className="mb-4">Our Mission</h2>
              <p className="text-deep-terracotta/70 dark:text-warm-ivory/70 leading-relaxed">
                To create a sustainable marketplace that celebrates and preserves traditional tribal handicrafts 
                while providing artisans with fair economic opportunities and global market access. We bridge the 
                gap between skilled craftspeople and appreciative customers worldwide.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-bronze-gold to-goldenrod rounded-full flex items-center justify-center mb-6">
                <Eye size={32} className="text-white" />
              </div>
              <h2 className="mb-4">Our Vision</h2>
              <p className="text-deep-terracotta/70 dark:text-warm-ivory/70 leading-relaxed">
                To become the world's leading platform for authentic tribal handicrafts, where every purchase 
                contributes to preserving cultural heritage, empowering artisan communities, and promoting 
                sustainable traditional craftsmanship for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-bronze-gold/5 to-goldenrod/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Core Values</h2>
            <p className="text-lg text-deep-terracotta/70 dark:text-warm-ivory/70">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-bronze-gold to-goldenrod rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl mb-3">{value.title}</h3>
                  <p className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Story</h2>
          </div>

          <div className="space-y-6 text-deep-terracotta/70 dark:text-warm-ivory/70 leading-relaxed">
            <p>
              HaandiCrafts was born from a simple yet powerful vision: to create a bridge between talented 
              tribal artisans and the global market while preserving India's rich cultural heritage. Founded 
              in 2024, we recognized that countless skilled craftspeople were struggling to reach customers 
              who would truly appreciate their work.
            </p>
            
            <p>
              Our journey began in rural India, visiting artisan communities and understanding their challenges. 
              We discovered that despite creating extraordinary handcrafted items, these artisans lacked access 
              to modern market channels and fair pricing. Meanwhile, customers worldwide were seeking authentic, 
              ethically-made products with cultural significance.
            </p>
            
            <p>
              Today, HaandiCrafts has grown into a thriving marketplace connecting over 500 artisans with 
              customers around the world. We've facilitated thousands of transactions, ensuring fair compensation 
              for artisans while providing customers with unique, authentic handicrafts. Every purchase on our 
              platform directly supports artisan families and helps preserve traditional crafting techniques.
            </p>
            
            <p>
              We're not just a marketplace – we're a movement dedicated to cultural preservation, economic 
              empowerment, and sustainable craftsmanship. Join us in celebrating the extraordinary artistry 
              of tribal handicrafts.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-bronze-gold/5 to-goldenrod/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Meet Our Team</h2>
            <p className="text-lg text-deep-terracotta/70 dark:text-warm-ivory/70">
              Passionate individuals dedicated to our mission
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl mb-2">{member.name}</h3>
                  <p className="text-sm text-bronze-gold">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-deep-terracotta to-bronze-gold text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6">Join Our Community</h2>
          <p className="text-xl mb-8">
            Whether you're an artisan, customer, or cultural consultant, there's a place for you at HaandiCrafts
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="px-8 py-4 bg-white text-deep-terracotta hover:bg-warm-ivory transition-colors rounded-lg"
            >
              Get Started Today
            </a>
            <a
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 transition-colors rounded-lg"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
