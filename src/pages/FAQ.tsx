import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is Solsite?",
        a: "Solsite is a no-code website builder designed specifically for meme coins and crypto tokens on the Solana blockchain. Create professional, mobile-responsive websites in minutes without any coding knowledge."
      },
      {
        q: "How do I create a website?",
        a: "Simply connect your Solana wallet, choose a template from our 30+ options, customize your content (token name, description, socials, etc.), and publish. The entire process takes just a few minutes."
      },
      {
        q: "Do I need coding experience?",
        a: "Not at all! Solsite is designed for everyone. Our intuitive builder lets you customize everything visually. Just fill in your project details and we handle the rest."
      },
      {
        q: "What wallets are supported?",
        a: "We support Phantom and Solflare wallets. Simply connect your wallet to authenticate and start building."
      }
    ]
  },
  {
    category: "Pricing & Payment",
    questions: [
      {
        q: "How much does it cost?",
        a: "Website generation costs a one-time fee of 0.05 SOL. There are no subscriptions, no hidden fees, and no recurring charges. You pay once and your site is live forever."
      },
      {
        q: "Is there a free trial?",
        a: "Yes! You can design and preview your website for free. You only pay the 0.05 SOL fee when you're ready to publish and go live."
      },
      {
        q: "Are there any recurring fees?",
        a: "No. The 0.05 SOL is a one-time payment. Your website hosting and subdomain are included with no ongoing costs."
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept SOL (Solana) directly from your connected wallet. No credit cards or other payment methods are needed."
      },
      {
        q: "Are payments refundable?",
        a: "Once a transaction is confirmed on the Solana blockchain, it cannot be refunded. This is why we offer free preview before you publish."
      }
    ]
  },
  {
    category: "Features & Templates",
    questions: [
      {
        q: "How many templates are available?",
        a: "We offer 30+ professionally designed templates, combining 6 different layouts with 5 unique personalities (degen, professional, minimal, playful, and dark). Each combination creates a distinct look for your project."
      },
      {
        q: "Can I customize the templates?",
        a: "Absolutely! You can customize your token name, ticker, tagline, description, logo, social links (Twitter, Telegram, Discord), DEX links, roadmap, FAQ, and more."
      },
      {
        q: "Are the websites mobile-responsive?",
        a: "Yes, all our templates are fully responsive and look great on desktop, tablet, and mobile devices."
      },
      {
        q: "Do templates include animations?",
        a: "Yes! Our templates feature dynamic animations including hover effects, scroll reveals, and smooth transitions to make your site stand out."
      },
      {
        q: "Can I add a roadmap and FAQ to my site?",
        a: "Yes, you can enable roadmap and FAQ sections and customize them with your own content through our builder."
      }
    ]
  },
  {
    category: "Domains & Hosting",
    questions: [
      {
        q: "Do I get a free subdomain?",
        a: "Yes! Every website gets a free subdomain at yourproject.solsite.fun. You can choose your subdomain name during the creation process."
      },
      {
        q: "Can I change my subdomain later?",
        a: "Yes, you can change your subdomain up to 2 times after creation through the Domain Settings page."
      },
      {
        q: "Can I use my own custom domain?",
        a: "Custom domain support is coming soon! Currently, all websites are hosted on our free .solsite.fun subdomains."
      },
      {
        q: "Is hosting included?",
        a: "Yes, hosting is included with the one-time fee. Your site is served globally via a fast CDN for optimal performance."
      }
    ]
  },
  {
    category: "Editing & Management",
    questions: [
      {
        q: "Can I edit my website after publishing?",
        a: "Yes! You can edit your website anytime through the dashboard. Changes are saved and reflected on your live site."
      },
      {
        q: "Can I create multiple websites?",
        a: "Yes, you can create multiple websites, each for a different project. Each website requires its own one-time payment."
      },
      {
        q: "Can I delete my website?",
        a: "Yes, you can delete your website from the dashboard. Note that deleted websites cannot be recovered."
      },
      {
        q: "How do I access my dashboard?",
        a: "Connect your wallet and click on Dashboard in the navigation. You'll see all your projects and can manage them from there."
      }
    ]
  },
  {
    category: "Security & Trust",
    questions: [
      {
        q: "Is Solsite safe to use?",
        a: "Yes. We use wallet-based authentication (no passwords needed), and we never have access to your private keys. All transactions are verified on the Solana blockchain."
      },
      {
        q: "Does Solsite endorse the projects hosted on it?",
        a: "No. Solsite provides website infrastructure only. We do not endorse, verify, or validate any cryptocurrency token or project. Always do your own research (DYOR)."
      },
      {
        q: "What content is prohibited?",
        a: "We prohibit illegal content, malware, phishing, impersonation, hate speech, and false claims about tokens. See our Terms of Service for full details."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
              Frequently Asked{" "}
              <span className="text-gradient-primary">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about creating your meme coin website with Solsite.
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqs.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h2 className="text-xl font-semibold text-primary">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${sectionIndex}-${index}`}
                      className="glass rounded-xl px-6 border-border/50"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-medium">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center p-8 glass rounded-2xl border-primary/20">
            <h3 className="text-2xl font-display font-bold mb-3">
              Ready to Launch Your Site?
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your professional meme coin website in minutes.
            </p>
            <Link to="/builder">
              <Button variant="hero" size="lg">
                <Zap className="w-5 h-5 mr-2" />
                Start Building Now
              </Button>
            </Link>
          </div>

          {/* Still have questions */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Still have questions? Check out our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
