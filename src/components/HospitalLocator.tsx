import { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Hospital {
  name: string;
  address: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  phone?: string;
}

interface HospitalLocatorProps {
  urgency: 'emergency' | 'doctor' | 'homecare';
}

// Mock hospitals data - in production, this would use Google Places API
const mockHospitals: Hospital[] = [
  {
    name: 'Apollo Hospital',
    address: '21, Greams Lane, Off Greams Road',
    distance: '1.2 km',
    rating: 4.5,
    isOpen: true,
    phone: '+91 44 2829 0200',
  },
  {
    name: 'Fortis Healthcare',
    address: '154/9, Opp. IIT Main Gate, Sarjapur Road',
    distance: '2.8 km',
    rating: 4.3,
    isOpen: true,
    phone: '+91 80 6621 4444',
  },
  {
    name: 'Max Super Speciality Hospital',
    address: 'Press Enclave Road, Saket',
    distance: '3.5 km',
    rating: 4.6,
    isOpen: false,
    phone: '+91 11 2651 5050',
  },
];

export function HospitalLocator({ urgency }: HospitalLocatorProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching hospitals
    const timer = setTimeout(() => {
      setHospitals(mockHospitals);
      setLoading(false);
    }, 1000);

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User location:', position.coords);
          // In production, use this to fetch nearby hospitals
        },
        (error) => {
          console.log('Location error:', error);
          setLocationError('Location access denied. Showing default results.');
        }
      );
    }

    return () => clearTimeout(timer);
  }, []);

  const openMaps = (hospital: Hospital) => {
    const query = encodeURIComponent(`${hospital.name} ${hospital.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  if (urgency === 'homecare') {
    return null;
  }

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            {urgency === 'emergency' ? 'Nearest Emergency Rooms' : 'Nearby Hospitals'}
          </h3>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          <Navigation className="w-4 h-4 mr-1" />
          Map View
        </Button>
      </div>

      {locationError && (
        <p className="text-xs text-muted-foreground mb-3">{locationError}</p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl animate-shimmer" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {hospitals.map((hospital, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer group"
              onClick={() => openMaps(hospital)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {hospital.name}
                    </h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      hospital.isOpen
                        ? "bg-homecare/10 text-homecare"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {hospital.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{hospital.address}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      {hospital.distance}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      ⭐ {hospital.rating}
                    </span>
                  </div>
                </div>

                {hospital.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${hospital.phone}`;
                    }}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
