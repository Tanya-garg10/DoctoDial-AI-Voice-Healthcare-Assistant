import { type Symptom } from '@/services/symptomAnalysis';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SymptomsListProps {
  symptoms: Symptom[];
}

const severityConfig = {
  mild: {
    variant: 'secondary' as const,
    className: 'bg-homecare/10 text-homecare border-homecare/20',
  },
  moderate: {
    variant: 'secondary' as const,
    className: 'bg-doctor/10 text-doctor border-doctor/20',
  },
  severe: {
    variant: 'secondary' as const,
    className: 'bg-emergency/10 text-emergency border-emergency/20',
  },
};

export function SymptomsList({ symptoms }: SymptomsListProps) {
  if (!symptoms.length) return null;

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Detected Symptoms</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom, index) => (
          <Badge
            key={index}
            variant={severityConfig[symptom.severity].variant}
            className={cn(
              "px-3 py-1.5 text-sm font-medium border",
              severityConfig[symptom.severity].className
            )}
          >
            {symptom.name}
            <span className="ml-2 opacity-70 text-xs capitalize">
              ({symptom.severity})
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
