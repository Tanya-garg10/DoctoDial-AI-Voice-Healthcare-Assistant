import { AlertTriangle, Stethoscope, Home, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UrgencyCardProps {
  urgency: 'emergency' | 'doctor' | 'homecare';
  reason: string;
  onViewRemedies?: () => void;
}

const urgencyConfig = {
  emergency: {
    icon: AlertTriangle,
    title: 'Emergency',
    subtitle: 'Seek immediate medical attention',
    bgClass: 'bg-gradient-to-br from-emergency to-red-600',
    shadowClass: 'shadow-emergency',
    action: 'Call Emergency Services',
    actionNumber: '112',
    iconBg: 'bg-emergency-foreground/20',
  },
  doctor: {
    icon: Stethoscope,
    title: 'Consult a Doctor',
    subtitle: 'Schedule an appointment within 24-48 hours',
    bgClass: 'bg-gradient-to-br from-doctor to-amber-600',
    shadowClass: 'shadow-doctor',
    action: 'Find Nearby Doctors',
    iconBg: 'bg-doctor-foreground/20',
  },
  homecare: {
    icon: Home,
    title: 'Home Care',
    subtitle: 'Can be managed at home with rest',
    bgClass: 'bg-gradient-to-br from-homecare to-emerald-600',
    shadowClass: 'shadow-homecare',
    action: 'View Remedies',
    iconBg: 'bg-homecare-foreground/20',
  },
};

export function UrgencyCard({ urgency, reason, onViewRemedies }: UrgencyCardProps) {
  const config = urgencyConfig[urgency];
  const Icon = config.icon;

  const handleAction = () => {
    if (urgency === 'emergency') {
      window.location.href = `tel:112`;
    } else if (urgency === 'homecare' && onViewRemedies) {
      onViewRemedies();
    }
  };

  return (
    <div 
      className={cn(
        "rounded-2xl p-6 text-white animate-fade-in-up",
        config.bgClass,
        config.shadowClass
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-xl", config.iconBg)}>
          <Icon className="w-8 h-8" />
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">{config.title}</h2>
          <p className="text-white/90 text-sm mb-3">{config.subtitle}</p>
          <p className="text-white/80 text-sm leading-relaxed">{reason}</p>
        </div>
      </div>

      <div className="mt-6">
        <Button
          onClick={handleAction}
          variant="secondary"
          className={cn(
            "w-full font-semibold",
            urgency === 'emergency' && "bg-white text-emergency hover:bg-white/90"
          )}
        >
          {urgency === 'emergency' && <Phone className="w-4 h-4 mr-2" />}
          {config.action}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
