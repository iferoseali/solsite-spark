import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
const plans = [{
  name: "Free",
  price: "0 SOL",
  description: "Perfect for testing the waters",
  features: ["Free subdomain (coin.solsite.xyz)", "All 30 templates", "Mobile responsive", "Dynamic animations", "Social links integration", "DEX links", "Solsite footer badge"],
  cta: "Start Free",
  popular: false
}, {
  name: "Custom Domain",
  price: "0.25-0.5 SOL",
  description: "For serious projects",
  features: ["Everything in Free", "Your own domain (coin.xyz)", "Priority support", "No Solsite badge option", "Analytics dashboard", "Faster deployment"],
  cta: "Get Custom Domain",
  popular: true
}];
export const Pricing = () => {
  return <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Simple{" "}
            <span className="text-gradient-primary">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free. Pay when you’re Ready!    
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => <div key={index} className={`relative p-8 rounded-2xl ${plan.popular ? 'glass-strong border-primary/50 glow-primary' : 'glass'}`}>
              {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-display font-bold text-gradient-primary mb-2">
                  {plan.price}
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>)}
              </ul>

              <Link to="/builder">
                <Button variant={plan.popular ? "hero" : "outline"} className="w-full" size="lg">
                  {plan.cta}
                </Button>
              </Link>
            </div>)}
        </div>
      </div>
    </section>;
};