import { Wallet, Layout, FileText, Rocket } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    icon: Wallet,
    step: "01",
    title: "Connect Wallet",
    description: "Link your Solana wallet. That's your identity. No emails, no passwords."
  },
  {
    icon: Layout,
    step: "02",
    title: "Pick a Template",
    description: "Choose from 30 stunning templates. Find your coin's personality."
  },
  {
    icon: FileText,
    step: "03",
    title: "Fill the Details",
    description: "Add your coin name, ticker, socials, and upload your logo. See it live."
  },
  {
    icon: Rocket,
    step: "04",
    title: "Launch",
    description: "Hit generate and get your site live at coinname.solsite.fun instantly."
  }
];

export const HowItWorks = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Launch in{" "}
            <span className="text-gradient-primary">4 Simple Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            No code. No design skills. Just vibes and a wallet.
          </p>
        </div>

        <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`relative group transition-all duration-700 ${
                stepsVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-16'
              }`}
              style={{ transitionDelay: stepsVisible ? `${index * 150}ms` : '0ms' }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={`hidden lg:block absolute top-12 left-[60%] h-px bg-gradient-to-r from-primary/50 to-transparent transition-all duration-1000 ${
                    stepsVisible ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                  style={{ transitionDelay: stepsVisible ? `${(index + 1) * 200 + 300}ms` : '0ms' }}
                />
              )}
              
              <div className="text-center">
                {/* Icon */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div 
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                      stepsVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                    style={{ transitionDelay: stepsVisible ? `${index * 150 + 300}ms` : '0ms' }}
                  >
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
