import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  handle: string;
  avatar: string;
  content: string;
  site?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "DegenDave",
    handle: "@degendave_sol",
    avatar: "🦧",
    content: "Built my coin's site in literally 2 minutes. The templates are fire and my community loved it. 10x better than paying some dev $500.",
    site: "apetoken.solsite.fun"
  },
  {
    name: "CryptoQueen",
    handle: "@cryptoqueen",
    avatar: "👑",
    content: "Finally a no-code tool that doesn't look like trash. The VC Grade template made my project look legit af. Raised our presale in 24 hours.",
    site: "queencoin.solsite.fun"
  },
  {
    name: "SolanaMaxi",
    handle: "@sol_maxi_",
    avatar: "☀️",
    content: "We used Solsite for our meme coin launch. Setup took 60 seconds, site looked professional, and we hit 1000 holders day one. Absolute game changer.",
  },
  {
    name: "NFTNinja",
    handle: "@nft_ninja",
    avatar: "🥷",
    content: "The animations and mobile experience are insane. My holders keep complimenting the site. Worth every SOL.",
    site: "ninjatoken.solsite.fun"
  },
  {
    name: "MemeLord",
    handle: "@memelord_sol",
    avatar: "🐸",
    content: "Launched 3 different coins using Solsite. Each one looked unique. The template variety is unmatched. This is the way.",
  },
  {
    name: "BuilderBob",
    handle: "@builder_bob",
    avatar: "🔨",
    content: "As a dev, I appreciate how clean the generated code is. The sites load fast and look great. Saves me hours of work every launch.",
  },
];

const FEATURED_LOGOS = [
  { name: "Solana", emoji: "☀️" },
  { name: "Raydium", emoji: "⚡" },
  { name: "Jupiter", emoji: "🪐" },
  { name: "Pump.fun", emoji: "🚀" },
  { name: "Birdeye", emoji: "🦅" },
  { name: "DexScreener", emoji: "📊" },
];

export const Testimonials = () => {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Loved by <span className="text-gradient-primary">degens</span> worldwide
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of projects that launched with Solsite
          </p>
        </motion.div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.handle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative p-6 rounded-2xl",
                "bg-card/50 backdrop-blur-sm border border-border/50",
                "hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
              )}
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
              
              {/* Content */}
              <p className="text-foreground/90 mb-4 relative z-10">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-muted-foreground text-xs">{testimonial.handle}</div>
                </div>
              </div>
              
              {/* Site link */}
              {testimonial.site && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <a 
                    href={`https://${testimonial.site}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    {testimonial.site} →
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Featured on / Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-muted-foreground text-sm mb-6 uppercase tracking-wider">
            Trusted by projects launching on
          </p>
          
          {/* Logo ticker */}
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee gap-8 sm:gap-12">
              {[...FEATURED_LOGOS, ...FEATURED_LOGOS].map((logo, index) => (
                <div 
                  key={`${logo.name}-${index}`}
                  className="flex items-center gap-2 text-muted-foreground/60 hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <span className="text-2xl">{logo.emoji}</span>
                  <span className="font-medium">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
