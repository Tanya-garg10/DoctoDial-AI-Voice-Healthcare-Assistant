import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  isListening: boolean;
  onToggle: () => void;
  isSupported: boolean;
  interimTranscript: string;
  disabled?: boolean;
}

export function VoiceRecorder({
  isListening,
  onToggle,
  isSupported,
  interimTranscript,
  disabled,
}: VoiceRecorderProps) {
  if (!isSupported) {
    return (
      <div className="text-center p-6 rounded-2xl bg-destructive/10 border border-destructive/20">
        <MicOff className="w-12 h-12 mx-auto mb-3 text-destructive" />
        <p className="text-destructive font-medium">
          Voice input not supported in this browser
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Please use Chrome, Edge, or Safari for voice features
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Main record button */}
      <div className="relative">
        {/* Pulse rings when recording */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
          </>
        )}
        
        <Button
          onClick={onToggle}
          disabled={disabled}
          size="lg"
          className={cn(
            "relative z-10 w-24 h-24 rounded-full transition-all duration-300 shadow-lg",
            isListening
              ? "bg-destructive hover:bg-destructive/90 shadow-emergency"
              : "bg-primary hover:bg-primary/90 shadow-glow hover:shadow-xl"
          )}
        >
          {isListening ? (
            <Square className="w-8 h-8 fill-current" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </Button>
      </div>

      {/* Status text */}
      <div className="text-center">
        <p className={cn(
          "font-semibold text-lg transition-colors",
          isListening ? "text-destructive" : "text-foreground"
        )}>
          {isListening ? "Listening..." : "Tap to speak"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {isListening 
            ? "Speak clearly in Hindi or English" 
            : "Describe your symptoms"}
        </p>
      </div>

      {/* Voice visualization when recording */}
      {isListening && (
        <div className="flex items-center justify-center gap-1 h-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="voice-bar w-2 bg-primary rounded-full"
              style={{ height: '8px' }}
            />
          ))}
        </div>
      )}

      {/* Interim transcript */}
      {interimTranscript && (
        <div className="w-full max-w-md p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground italic">
            "{interimTranscript}"
          </p>
        </div>
      )}
    </div>
  );
}
