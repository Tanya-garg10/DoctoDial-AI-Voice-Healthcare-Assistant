import { X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TranscriptDisplayProps {
  transcript: string;
  onClear: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function TranscriptDisplay({
  transcript,
  onClear,
  onAnalyze,
  isAnalyzing,
}: TranscriptDisplayProps) {
  if (!transcript) return null;

  const wordCount = transcript.trim().split(/\s+/).length;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="glass rounded-2xl p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Your symptoms</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-foreground text-lg leading-relaxed mb-4">
          "{transcript}"
        </p>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {wordCount} words
          </Badge>
          
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing || wordCount < 3}
            className={cn(
              "transition-all",
              isAnalyzing && "animate-shimmer"
            )}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Analyzing...
              </>
            ) : (
              'Analyze Symptoms'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
