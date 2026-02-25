import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const Exhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/exhibitions');
      if (response.ok) {
        const data = await response.json();
        setExhibitions(data.exhibitions || []);
      }
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      setExhibitions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExhibitions = exhibitions.filter((exhibition) => {
    if (filter === 'all') return true;
    return exhibition.status === filter;
  });

  const getStatusBadge = (status) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-600',
      ongoing: 'bg-green-100 text-green-600',
      completed: 'bg-gray-100 text-gray-600',
    };
    return colors[status] || colors.upcoming;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="mb-4">Cultural Exhibitions</h1>
          <p className="text-lg text-deep-terracotta/70 dark:text-warm-ivory/70">
            Experience the rich heritage and artistry of tribal handicrafts
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-lg transition-colors capitalize ${
                filter === status
                  ? 'bg-bronze-gold text-white'
                  : 'bg-white dark:bg-dark-surface text-deep-terracotta dark:text-warm-ivory hover:bg-bronze-gold/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Exhibitions Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-bronze-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-deep-terracotta/60 dark:text-warm-ivory/60">Loading exhibitions...</p>
          </div>
        ) : filteredExhibitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExhibitions.map((exhibition) => (
              <Link
                key={exhibition.id}
                to={`/exhibitions/${exhibition.id}`}
                className="group bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="h-64 overflow-hidden relative">
                  <ImageWithFallback
                    src={exhibition.images[0] || 'https://images.unsplash.com/photo-1643295577643-b46e7b3f17db'}
                    alt={exhibition.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full ${getStatusBadge(exhibition.status)} backdrop-blur-sm`}>
                    {exhibition.status}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-3">{exhibition.title}</h3>
                  <p className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60 mb-4 line-clamp-2">
                    {exhibition.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-bronze-gold">
                      <Calendar size={16} />
                      <span>
                        {new Date(exhibition.startDate).toLocaleDateString()} -{' '}
                        {new Date(exhibition.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-deep-terracotta/60 dark:text-warm-ivory/60">
                      <MapPin size={16} />
                      <span>{exhibition.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-deep-terracotta/60 dark:text-warm-ivory/60">
                      <Users size={16} />
                      <span>{exhibition.products?.length || 0} Products Featured</span>
                    </div>
                  </div>

                  {exhibition.consultant && (
                    <div className="mt-4 pt-4 border-t border-bronze-gold/20">
                      <p className="text-xs text-deep-terracotta/50 dark:text-warm-ivory/50">
                        Curated by {exhibition.consultant.name}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-dark-surface rounded-xl">
            <Calendar size={64} className="mx-auto mb-4 text-bronze-gold/30" />
            <p className="text-xl text-deep-terracotta/60 dark:text-warm-ivory/60 mb-4">
              No {filter !== 'all' && filter} exhibitions found
            </p>
            <button
              onClick={() => setFilter('all')}
              className="px-6 py-3 bg-bronze-gold hover:bg-goldenrod text-white rounded-lg transition-colors"
            >
              View All Exhibitions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
