// Solsite Internal Template Registry
// Version 1.0

export interface TemplateSection {
  type: string;
  layout?: string;
  animation?: string;
  fields: string[];
}

export interface TemplateTheme {
  background: string;
  primary: string;
  text: string;
}

export interface TemplateDefinition {
  template_id: string;
  name: string;
  inspiration: string;
  theme: TemplateTheme;
  sections: TemplateSection[];
}

export interface TemplateRegistry {
  platform: string;
  version: string;
  default_theme: {
    mode: string;
    light_mode_enabled: boolean;
  };
  templates: TemplateDefinition[];
}

export const SOLSITE_TEMPLATE_REGISTRY: TemplateRegistry = {
  platform: "Solsite",
  version: "1.0",
  default_theme: {
    mode: "dark",
    light_mode_enabled: true
  },
  templates: [
    {
      template_id: "cult_minimal",
      name: "Cult Minimal",
      inspiration: "Pump.fun, early Solana cult sites",
      theme: {
        background: "#0b0b0b",
        primary: "#a6ff00",
        text: "#ffffff"
      },
      sections: [
        {
          type: "hero",
          layout: "centered",
          animation: "fade-in",
          fields: ["coin_name", "ticker", "tagline", "logo", "cta_primary"]
        },
        {
          type: "narrative",
          layout: "single-column",
          animation: "fade-up",
          fields: ["description"]
        },
        {
          type: "cta",
          layout: "centered",
          animation: "pulse",
          fields: ["cta_primary", "cta_secondary"]
        },
        {
          type: "footer",
          fields: ["twitter", "telegram", "website"]
        }
      ]
    },
    {
      template_id: "vc_pro",
      name: "VC Grade Pro",
      inspiration: "Coinbase, Solana.com",
      theme: {
        background: "#0e1117",
        primary: "#5da9ff",
        text: "#e6e6e6"
      },
      sections: [
        {
          type: "hero",
          layout: "split",
          animation: "fade-in",
          fields: ["coin_name", "tagline", "cta_primary", "hero_image"]
        },
        {
          type: "stats",
          layout: "grid-3",
          animation: "fade-up",
          fields: ["market_cap", "supply", "chain"]
        },
        {
          type: "utility",
          layout: "grid",
          animation: "fade-up",
          fields: ["use_cases"]
        },
        {
          type: "roadmap",
          layout: "timeline",
          animation: "fade-up",
          fields: ["roadmap_items"]
        },
        {
          type: "footer",
          fields: ["twitter", "discord", "github"]
        }
      ]
    },
    {
      template_id: "degen_meme",
      name: "Degenerate Meme",
      inspiration: "BONK, PEPE launch pages",
      theme: {
        background: "#120018",
        primary: "#ff4fd8",
        text: "#ffffff"
      },
      sections: [
        {
          type: "hero",
          layout: "full-screen",
          animation: "zoom-in",
          fields: ["coin_name", "ticker", "meme_image", "cta_primary"]
        },
        {
          type: "tokenomics",
          layout: "stacked",
          animation: "bounce-in",
          fields: ["tax", "supply", "liquidity"]
        },
        {
          type: "community",
          layout: "grid",
          animation: "fade-up",
          fields: ["twitter", "telegram", "memes"]
        },
        {
          type: "cta",
          layout: "centered",
          animation: "shake",
          fields: ["cta_primary"]
        }
      ]
    },
    {
      template_id: "dark_cult",
      name: "Dark Cult Narrative",
      inspiration: "CultDAO, lore-heavy Web3 brands",
      theme: {
        background: "#050505",
        primary: "#ff0000",
        text: "#f5f5f5"
      },
      sections: [
        {
          type: "hero",
          layout: "left-aligned",
          animation: "fade-in",
          fields: ["coin_name", "tagline"]
        },
        {
          type: "story",
          layout: "long-form",
          animation: "fade-up",
          fields: ["origin_story"]
        },
        {
          type: "rituals",
          layout: "grid",
          animation: "fade-up",
          fields: ["steps"]
        },
        {
          type: "cta",
          layout: "centered",
          animation: "pulse",
          fields: ["cta_primary"]
        }
      ]
    },
    {
      template_id: "luxury_token",
      name: "Luxury Token",
      inspiration: "Premium NFT & token brands",
      theme: {
        background: "#0a0a0a",
        primary: "#d4af37",
        text: "#ffffff"
      },
      sections: [
        {
          type: "hero",
          layout: "minimal",
          animation: "fade-in",
          fields: ["coin_name", "tagline", "logo"]
        },
        {
          type: "features",
          layout: "grid-2",
          animation: "fade-up",
          fields: ["features"]
        },
        {
          type: "stats",
          layout: "horizontal",
          animation: "fade-up",
          fields: ["supply", "chain", "launch_date"]
        },
        {
          type: "footer",
          fields: ["twitter", "website"]
        }
      ]
    },
    {
      template_id: "builder_utility",
      name: "Builder Utility",
      inspiration: "Web3 dev tools & infra",
      theme: {
        background: "#0d1117",
        primary: "#00ffa3",
        text: "#c9d1d9"
      },
      sections: [
        {
          type: "hero",
          layout: "split",
          animation: "fade-in",
          fields: ["coin_name", "utility_tagline", "cta_primary"]
        },
        {
          type: "how_it_works",
          layout: "steps",
          animation: "fade-up",
          fields: ["steps"]
        },
        {
          type: "integrations",
          layout: "grid",
          animation: "fade-up",
          fields: ["integrations"]
        },
        {
          type: "cta",
          layout: "centered",
          animation: "pulse",
          fields: ["cta_primary"]
        }
      ]
    }
  ]
};

// Helper to get a template by ID
export function getTemplateById(templateId: string): TemplateDefinition | undefined {
  return SOLSITE_TEMPLATE_REGISTRY.templates.find(t => t.template_id === templateId);
}

// Helper to get all template IDs
export function getTemplateIds(): string[] {
  return SOLSITE_TEMPLATE_REGISTRY.templates.map(t => t.template_id);
}

// Helper to get template names for display
export function getTemplateOptions(): { id: string; name: string; inspiration: string }[] {
  return SOLSITE_TEMPLATE_REGISTRY.templates.map(t => ({
    id: t.template_id,
    name: t.name,
    inspiration: t.inspiration
  }));
}
