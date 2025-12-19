import { type Condition } from '@/services/symptomAnalysis';
import { FileSearch, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ConditionsListProps {
  conditions: Condition[];
}

export function ConditionsList({ conditions }: ConditionsListProps) {
  if (!conditions.length) return null;

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-4">
        <FileSearch className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Possible Conditions</h3>
      </div>

      <div className="space-y-4">
        {conditions.map((condition, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium text-foreground">{condition.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round(condition.probability * 100)}% match
              </span>
            </div>
            
            <Progress 
              value={condition.probability * 100} 
              className="h-2 mb-2"
            />
            
            <p className="text-sm text-muted-foreground pl-6">
              {condition.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
