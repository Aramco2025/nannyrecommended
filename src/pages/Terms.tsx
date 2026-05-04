import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const Terms = () => {
  const updated = "4 May 2026";
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-12">
        <h1 className="text-3xl font-semibold text-pitch-black">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-grey">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-slate-grey leading-relaxed">
          <section>
            <p>
              These Terms govern your use of NannyRecommended (the "Service"), operated from the
              United Arab Emirates. By creating an account or using the Service you agree to these
              Terms and to our{" "}
              <Link to="/privacy" className="underline text-pitch-black">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">1. The Service</h2>
            <p className="mt-2">
              NannyRecommended is a marketplace that helps parents discover, book and pay
              babysitters and nannies in the UAE. We are not the employer of any sitter and do not
              provide childcare ourselves. Sitters are independent contractors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">2. Eligibility</h2>
            <p className="mt-2">
              You must be at least 18 years old and able to enter a legally binding contract under
              UAE law. Sitters must hold the right to work in the UAE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">3. Accounts</h2>
            <p className="mt-2">
              You are responsible for the accuracy of the information you provide and for keeping
              your password confidential. You must notify us immediately of any unauthorised use
              of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">4. Bookings &amp; payments</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Parents pay through the Service. Payment is held in escrow and released to the sitter after the booking is completed.</li>
              <li>Service fees and processing fees are disclosed before checkout.</li>
              <li>Sitters set their own hourly rates within the platform's tier guidelines.</li>
              <li>Off-platform payments are not permitted and void our protections.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">5. Cancellations &amp; refunds</h2>
            <p className="mt-2">
              Cancellation policies are shown at booking. In general, cancellations more than 24
              hours before start time are fully refundable; later cancellations may incur a fee
              paid to the sitter to compensate for held time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">6. Sitter obligations</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Provide accurate profile information and valid identification.</li>
              <li>Deliver care in a safe, professional and lawful manner.</li>
              <li>Comply with UAE labour and immigration laws.</li>
              <li>Maintain confidentiality of any information about families and children.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">7. Parent obligations</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Provide a safe environment and accurate information about your children's needs.</li>
              <li>Be present or reachable as agreed during the booking.</li>
              <li>Pay all booking fees through the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">8. Trust &amp; safety</h2>
            <p className="mt-2">
              We perform identity checks and may conduct further verification on sitters. We do
              not guarantee the conduct of any user. Always meet a sitter before a booking, check
              references, and report any concerns to{" "}
              <a href="mailto:safety@nannyrecommended.com" className="underline text-pitch-black">safety@nannyrecommended.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">9. Prohibited conduct</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Use the Service for any unlawful purpose or to harm others.</li>
              <li>Circumvent fees or transact off-platform with users introduced via the Service.</li>
              <li>Post false, misleading, defamatory or discriminatory content.</li>
              <li>Scrape, reverse-engineer or interfere with the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">10. Content</h2>
            <p className="mt-2">
              You retain ownership of content you post (photos, reviews, profiles) and grant us a
              worldwide, royalty-free licence to host, display and use it for operating and
              promoting the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">11. Disclaimer</h2>
            <p className="mt-2">
              The Service is provided "as is". To the fullest extent permitted by UAE law we
              disclaim all warranties, express or implied. We do not warrant uninterrupted or
              error-free operation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">12. Limitation of liability</h2>
            <p className="mt-2">
              To the fullest extent permitted by law, NannyRecommended's total liability arising
              out of or relating to the Service is limited to the greater of (a) AED 500 or (b)
              the fees we received from you in the 6 months preceding the event giving rise to the
              claim. We are not liable for indirect, incidental or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">13. Indemnity</h2>
            <p className="mt-2">
              You agree to indemnify and hold us harmless from any claims, losses or expenses
              arising from your use of the Service or breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">14. Termination</h2>
            <p className="mt-2">
              We may suspend or terminate your account at any time for breach of these Terms or
              for safety reasons. You may close your account at any time from your account
              settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">15. Governing law</h2>
            <p className="mt-2">
              These Terms are governed by the laws of the United Arab Emirates. Any dispute will
              be subject to the exclusive jurisdiction of the courts of Dubai, UAE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">16. Changes</h2>
            <p className="mt-2">
              We may update these Terms from time to time. Continued use of the Service after
              changes take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">17. Contact</h2>
            <p className="mt-2">
              <a href="mailto:hello@nannyrecommended.com" className="underline text-pitch-black">hello@nannyrecommended.com</a>
            </p>
          </section>

          <p className="text-xs text-slate-grey">
            This template is provided for convenience and does not constitute legal advice. Please
            have it reviewed by a qualified UAE lawyer before relying on it.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
