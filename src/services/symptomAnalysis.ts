import { supabase } from '@/integrations/supabase/client';

export interface Symptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface Condition {
  name: string;
  probability: number;
  description: string;
}

export interface AnalysisResult {
  symptoms: Symptom[];
  conditions: Condition[];
  urgency: 'emergency' | 'doctor' | 'homecare';
  urgencyReason: string;
  recommendations: string[];
  disclaimer: string;
}

export async function analyzeSymptoms(text: string, language: string): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
    body: { text, language },
  });

  if (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error(error.message || 'Failed to analyze symptoms');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as AnalysisResult;
}
