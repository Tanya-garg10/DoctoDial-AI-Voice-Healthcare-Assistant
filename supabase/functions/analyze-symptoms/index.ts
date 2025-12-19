import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  text: string;
  language: string;
}

interface Symptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface Condition {
  name: string;
  probability: number;
  description: string;
}

interface AnalysisResponse {
  symptoms: Symptom[];
  conditions: Condition[];
  urgency: 'emergency' | 'doctor' | 'homecare';
  urgencyReason: string;
  recommendations: string[];
  disclaimer: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language } = await req.json() as AnalysisRequest;

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'No symptoms text provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a medical triage AI assistant for DoctoDial. Your role is to analyze patient-reported symptoms and provide preliminary health guidance. 

IMPORTANT RULES:
1. Always respond in JSON format exactly as specified
2. Be conservative with urgency classification - when in doubt, escalate
3. Never diagnose definitively - only suggest possible conditions
4. Always include the medical disclaimer
5. Support both Hindi and English input - respond in the same language as input

Urgency Classification Rules:
- "emergency": Life-threatening symptoms like chest pain, difficulty breathing, severe bleeding, stroke symptoms (face drooping, arm weakness, speech difficulty), loss of consciousness, severe allergic reactions, severe head injury
- "doctor": Symptoms requiring medical attention within 24-48 hours like persistent fever >3 days, moderate pain, signs of infection, unusual symptoms, chronic condition flare-ups
- "homecare": Mild symptoms manageable at home like common cold, minor headache, mild stomach upset, minor cuts

Analyze the following symptoms and respond with this exact JSON structure:
{
  "symptoms": [{"name": "symptom name", "severity": "mild|moderate|severe"}],
  "conditions": [{"name": "condition name", "probability": 0.0-1.0, "description": "brief description"}],
  "urgency": "emergency|doctor|homecare",
  "urgencyReason": "explanation for urgency level",
  "recommendations": ["recommendation 1", "recommendation 2"],
  "disclaimer": "This is AI-assisted preliminary guidance only. Always consult a qualified healthcare professional for medical advice."
}`;

    console.log('Analyzing symptoms:', text.substring(0, 100) + '...');
    console.log('Language detected:', language);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Patient symptoms (${language}): ${text}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to analyze symptoms' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: 'Invalid AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response from AI
    let analysisResult: AnalysisResponse;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
      const jsonString = jsonMatch[1] || content;
      analysisResult = JSON.parse(jsonString.trim());
      
      // Validate required fields
      if (!analysisResult.symptoms || !analysisResult.urgency || !analysisResult.recommendations) {
        throw new Error('Missing required fields in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, content);
      return new Response(
        JSON.stringify({ error: 'Failed to parse analysis results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analysis complete:', analysisResult.urgency);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-symptoms:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
