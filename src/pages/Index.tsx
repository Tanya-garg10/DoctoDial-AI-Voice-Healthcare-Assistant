import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Heart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { analyzeSymptoms, type AnalysisResult } from '@/services/symptomAnalysis';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { UrgencyCard } from '@/components/UrgencyCard';
import { SymptomsList } from '@/components/SymptomsList';
import { ConditionsList } from '@/components/ConditionsList';
import { Recommendations } from '@/components/Recommendations';
import { HospitalLocator } from '@/components/HospitalLocator';

const Index = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState('en-IN');
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showRemedies, setShowRemedies] = useState(false);

  const handleSpeechResult = useCallback((text: string) => {
    setTranscript((prev) => prev + (prev ? ' ' : '') + text);
  }, []);

  const handleSpeechError = useCallback((error: string) => {
    toast({
      title: 'Speech Error',
      description: error === 'not-allowed' ? 'Please allow microphone access' : error,
      variant: 'destructive',
    });
  }, [toast]);

  const { isListening, interimTranscript, isSupported, toggleListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onError: handleSpeechError,
    language,
  });

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeSymptoms(transcript, language);
      setResult(analysis);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setTranscript('');
    setResult(null);
    setShowRemedies(false);
  };

  return (
    <>
      <Helmet>
        <title>DoctoDial - AI Healthcare Triage</title>
        <meta name="description" content="Voice-based AI healthcare triage app. Describe your symptoms in Hindi or English and get instant medical guidance." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">DoctoDial</span>
            </div>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {!result ? (
            <div className="space-y-8">
              {/* Hero */}
              <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-foreground mb-3">
                  How are you feeling?
                </h1>
                <p className="text-lg text-muted-foreground">
                  Speak or type your symptoms for instant AI-powered health guidance
                </p>
              </div>

              {/* Voice Recorder */}
              <VoiceRecorder
                isListening={isListening}
                onToggle={toggleListening}
                isSupported={isSupported}
                interimTranscript={interimTranscript}
                disabled={isAnalyzing}
              />

              {/* Transcript */}
              <TranscriptDisplay
                transcript={transcript}
                onClear={() => setTranscript('')}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Reset button */}
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Start New Assessment
              </Button>

              {/* Urgency Card */}
              <UrgencyCard 
                urgency={result.urgency} 
                reason={result.urgencyReason} 
                onViewRemedies={() => setShowRemedies(true)}
              />

              {/* Symptoms */}
              <SymptomsList symptoms={result.symptoms} />

              {/* Conditions */}
              <ConditionsList conditions={result.conditions} />

              {/* Recommendations - show always for emergency/doctor, or when clicked for homecare */}
              {(result.urgency !== 'homecare' || showRemedies) && (
                <Recommendations
                  recommendations={result.recommendations}
                  disclaimer={result.disclaimer}
                />
              )}

              {/* Hospital Locator */}
              <HospitalLocator urgency={result.urgency} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>DoctoDial is for informational purposes only. Always consult a healthcare professional.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
