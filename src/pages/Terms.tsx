import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Solsite ("Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
              <p>
                Solsite is a website builder platform that enables users to create and deploy websites 
                for cryptocurrency tokens on the Solana blockchain. We provide hosting, templates, 
                and domain services for a one-time fee payable in SOL.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are solely responsible for the content you publish on websites created through our Service.</li>
                <li>You must not use the Service to promote fraudulent, illegal, or deceptive projects.</li>
                <li>You are responsible for maintaining the security of your wallet and authentication credentials.</li>
                <li>You must comply with all applicable laws and regulations in your jurisdiction.</li>
                <li>You must not use our Service to impersonate other projects or individuals.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Website generation requires a one-time payment of 0.05 SOL.</li>
                <li>All payments are non-refundable once the transaction is confirmed on the Solana blockchain.</li>
                <li>Prices may be updated at any time without prior notice.</li>
                <li>We are not responsible for transaction fees or failed transactions due to network issues.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
              <p>
                You retain ownership of all content you upload to your website. By using our templates, 
                you receive a license to use them for your projects but do not acquire ownership of the 
                template designs themselves.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Prohibited Content</h2>
              <p>You may not use our Service to host websites that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Promote or facilitate illegal activities</li>
                <li>Contain malware, phishing attempts, or malicious code</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Contain explicit, violent, or hateful content</li>
                <li>Impersonate legitimate projects or individuals</li>
                <li>Make false claims about token utility, returns, or partnerships</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Disclaimer</h2>
              <p>
                <strong className="text-foreground">SOLSITE PROVIDES WEBSITE INFRASTRUCTURE ONLY.</strong> We do not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Endorse, verify, or validate any cryptocurrency token or project hosted on our platform</li>
                <li>Provide financial, investment, or legal advice</li>
                <li>Guarantee the success, legitimacy, or value of any project</li>
                <li>Perform due diligence on projects created using our Service</li>
              </ul>
              <p>
                Cryptocurrency investments carry significant risk. Always do your own research (DYOR) 
                before investing in any token.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOLSITE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO 
                LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any interruption or cessation of transmission to or from our Service</li>
                <li>Any investment decisions made based on content hosted on our platform</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. Service Availability</h2>
              <p>
                We strive to maintain high availability but do not guarantee uninterrupted access to the Service. 
                We reserve the right to modify, suspend, or discontinue the Service at any time without prior notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">10. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your access to the Service immediately, 
                without prior notice, for any violation of these Terms or for any conduct that we 
                determine to be harmful to other users or our platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">11. Changes to Terms</h2>
              <p>
                We may update these Terms of Service from time to time. Continued use of the Service 
                after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">12. Contact</h2>
              <p>
                For questions about these Terms, please contact us through our official channels.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
