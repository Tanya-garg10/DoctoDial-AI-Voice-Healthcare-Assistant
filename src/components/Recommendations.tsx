import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface RecommendationsProps {
  recommendations: string[];
  disclaimer: string;
}

export function Recommendations({ recommendations, disclaimer }: RecommendationsProps) {
  if (!recommendations.length) return null;

  return (
    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-doctor" />
          <h3 className="font-semibold text-foreground">Recommendations</h3>
        </div>

        <ul className="space-y-3">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-homecare flex-shrink-0 mt-0.5" />
              <span className="text-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/50 rounded-xl p-4 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          ⚠️ {disclaimer}
        </p>
      </div>
    </div>
  );
}
