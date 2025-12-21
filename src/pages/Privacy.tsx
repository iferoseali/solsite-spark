import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
              <p>
                Solsite ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information 
                when you use our website builder service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-foreground">2.1 Wallet Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Public wallet address (required for authentication and payment verification)</li>
                <li>Transaction signatures for payment verification</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground">2.2 Project Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Token/coin name and ticker</li>
                <li>Project descriptions and taglines</li>
                <li>Social media links (Twitter, Telegram, Discord)</li>
                <li>Logo images and other uploaded assets</li>
                <li>Website configuration and content</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground">2.3 Technical Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>IP address (for security and analytics)</li>
                <li>Usage patterns and interaction data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To authenticate users and verify wallet ownership</li>
                <li>To process payments and verify transactions</li>
                <li>To create, host, and serve your websites</li>
                <li>To provide customer support</li>
                <li>To improve our Service and develop new features</li>
                <li>To detect and prevent fraud or abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Data Storage and Security</h2>
              <p>
                We use industry-standard security measures to protect your data, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and monitoring</li>
              </ul>
              <p>
                Your wallet's private keys are never collected, stored, or accessed by Solsite. 
                Authentication is performed through cryptographic signature verification only.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. Third-Party Services</h2>
              <p>We may use third-party services for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analytics (to understand how users interact with our Service)</li>
                <li>Content delivery (to serve your websites globally)</li>
                <li>Blockchain RPC providers (to interact with the Solana network)</li>
              </ul>
              <p>
                These third parties have their own privacy policies governing their use of your data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Cookies and Tracking</h2>
              <p>
                We use essential cookies for authentication and session management. 
                We may also use analytics cookies to understand usage patterns. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active or as needed to provide 
                our services. Project data for published websites is retained to ensure continuous 
                website availability. You may request deletion of your data by contacting us.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
              </ul>
              <p>
                To exercise these rights, please contact us through our official channels.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. Children's Privacy</h2>
              <p>
                Our Service is not intended for individuals under 18 years of age. 
                We do not knowingly collect personal information from children.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">10. International Users</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                By using our Service, you consent to such transfers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify users of any 
                material changes by updating the "Last updated" date at the top of this page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">12. Contact Us</h2>
              <p>
                For questions about this Privacy Policy or our data practices, 
                please contact us through our official channels.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
