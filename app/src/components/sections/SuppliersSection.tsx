import { useEffect, useState } from 'react';
import { MapPin, TrendingUp, Shield } from 'lucide-react';
import { suppliers } from '@/data/mapData';

export function SuppliersSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out'
        }}
      >
        <h2 className="font-cinzel text-2xl text-paper tracking-[0.15em] uppercase">
          Suppliers & Allies
        </h2>
        <p className="text-paper/60 text-sm mt-2">
          Trusted partners in the Shelby Company network
        </p>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier, index) => (
          <div
            key={supplier.id}
            className="ledger-card group overflow-hidden"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `all 0.6s ease-out ${0.1 * (index + 1)}s`
            }}
          >
            {/* Image */}
            <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
              <img
                src={supplier.image}
                alt={supplier.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
              
              {/* Trust Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-charcoal/80 backdrop-blur-sm px-3 py-1.5 border border-smoke">
                <Shield className="w-3 h-3 text-brass" />
                <span className="text-xs text-paper font-cinzel tracking-wider">
                  {supplier.trustLevel}% Trust
                </span>
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="font-cinzel text-lg text-paper tracking-wider group-hover:text-brass transition-colors">
                {supplier.name}
              </h3>
              <p className="text-brass text-sm mt-1">{supplier.role}</p>
              
              <div className="flex items-center gap-2 mt-3 text-paper/40">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{supplier.location}</span>
              </div>

              <p className="text-paper/60 text-sm mt-4 leading-relaxed">
                {supplier.description}
              </p>

              {/* Trust Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-paper/40 uppercase tracking-wider">Relationship</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">Strong</span>
                  </div>
                </div>
                <div className="h-1 bg-smoke overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brass to-brass-light transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? `${supplier.trustLevel}%` : '0%',
                      transitionDelay: `${0.5 + index * 0.2}s`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Partnership Stats */}
      <div
        className="ledger-card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out 0.5s'
        }}
      >
        <h3 className="font-cinzel text-sm text-paper tracking-[0.15em] uppercase mb-6">
          Partnership Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Partners', value: '12', change: '+2 this year' },
            { label: 'Avg Trust Level', value: '84%', change: '+5% growth' },
            { label: 'Territories Covered', value: '8', change: 'Stable' },
            { label: 'Years of Alliance', value: '6+', change: 'Since 1915' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                transition: `all 0.4s ease-out ${0.6 + index * 0.1}s`
              }}
            >
              <p className="font-cinzel text-2xl text-brass">{stat.value}</p>
              <p className="text-paper/60 text-xs uppercase tracking-wider mt-1">{stat.label}</p>
              <p className="text-paper/40 text-xs mt-1">{stat.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div
        className="relative py-12 text-center"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s ease-out 0.8s'
        }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-8 bg-gradient-to-b from-transparent to-brass/30" />
        <blockquote className="font-cinzel text-xl text-paper/80 italic tracking-wide max-w-2xl mx-auto">
          "In this business, trust is more valuable than gold. We choose our allies carefully."
        </blockquote>
        <p className="text-brass text-sm mt-4 font-cinzel tracking-wider">— Thomas Shelby</p>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-px h-8 bg-gradient-to-t from-transparent to-brass/30" />
      </div>
    </div>
  );
}
