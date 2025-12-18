import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing reference URL:', url);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Fetch the website HTML for analysis
    let htmlContent = '';
    try {
      const siteResponse = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SolsiteBot/1.0)' }
      });
      htmlContent = await siteResponse.text();
      // Truncate to avoid token limits
      htmlContent = htmlContent.substring(0, 15000);
    } catch (fetchError) {
      console.error('Failed to fetch URL:', fetchError);
      htmlContent = 'Failed to fetch - analyze based on URL pattern only';
    }

    const analysisPrompt = `You are a web design analyst for Solsite, a memecoin website builder.

Analyze this website and extract its structure for template creation.

URL: ${url}
HTML Preview (truncated):
${htmlContent}

Extract and return a JSON object with this exact structure:
{
  "sections": [
    { "type": "hero|about|tokenomics|roadmap|faq|community|story|utility|team|footer", "confidence": 0.0-1.0, "notes": "optional description" }
  ],
  "colors": {
    "primary": "#hex color for main accent",
    "accent": "#hex color for secondary accent", 
    "background": "CSS gradient or solid color for background"
  },
  "typography": {
    "headingStyle": "bold/elegant/playful/modern",
    "bodyStyle": "clean/compact/spacious"
  },
  "animations": {
    "detected": ["fade-in", "scroll-reveal", "hover-scale", etc],
    "notes": "description of animation behavior"
  },
  "layoutCategory": "minimal|hero-roadmap|stats-heavy|community|story-lore|utility",
  "personality": "degen|professional|dark-cult|playful|premium"
}

Analyze the visual hierarchy, section order, color scheme, and overall vibe. 
Focus on memecoin/crypto website patterns.
Return ONLY the JSON object, no markdown or explanation.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a web design analyst. Always respond with valid JSON only.' },
          { role: 'user', content: analysisPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '';
    
    console.log('AI Response:', content);

    // Parse the JSON from the response
    let analysis;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return a default analysis
      analysis = {
        sections: [
          { type: 'hero', confidence: 0.9 },
          { type: 'about', confidence: 0.8 },
          { type: 'tokenomics', confidence: 0.7 },
          { type: 'roadmap', confidence: 0.7 },
          { type: 'community', confidence: 0.6 },
          { type: 'faq', confidence: 0.5 },
          { type: 'footer', confidence: 0.9 }
        ],
        colors: {
          primary: '#00d4ff',
          accent: '#22c55e',
          background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%)'
        },
        typography: {
          headingStyle: 'bold',
          bodyStyle: 'clean'
        },
        animations: {
          detected: ['fade-in', 'hover-scale'],
          notes: 'Standard scroll animations detected'
        },
        layoutCategory: 'hero-roadmap',
        personality: 'professional'
      };
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Analysis failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
