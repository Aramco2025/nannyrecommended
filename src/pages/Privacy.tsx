import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const Privacy = () => {
  const updated = "4 May 2026";
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-12">
        <h1 className="text-3xl font-semibold text-pitch-black">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-grey">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-slate-grey leading-relaxed">
          <section>
            <p>
              This Privacy Policy explains how NannyRecommended ("we", "us", "our") collects, uses,
              stores and shares personal data when you use{" "}
              <a href="https://nannyrecommended.com" className="underline text-pitch-black">nannyrecommended.com</a>{" "}
              and related services (the "Service"). We operate in the United Arab Emirates and
              comply with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data
              (PDPL).
            </p>
            <p className="mt-3">
              By using the Service you agree to this Policy. If you do not agree, please do not use
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">1. Who we are</h2>
            <p className="mt-2">
              NannyRecommended is a marketplace connecting parents in the UAE with babysitters and
              nannies. Contact: <a href="mailto:hello@nannyrecommended.com" className="underline text-pitch-black">hello@nannyrecommended.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">2. Data we collect</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong className="text-pitch-black">Account data:</strong> name, email, phone number, password (hashed), profile photo, role (parent or sitter).</li>
              <li><strong className="text-pitch-black">Sitter data:</strong> date of birth, nationality, languages, experience, certifications, ID/visa documents, intro video, references, hourly rate, bank/payout details.</li>
              <li><strong className="text-pitch-black">Parent data:</strong> location (emirate/area), number and ages of children, special care notes, booking history.</li>
              <li><strong className="text-pitch-black">Payment data:</strong> processed by Stripe; we store the last 4 digits of cards and transaction metadata, never full card numbers.</li>
              <li><strong className="text-pitch-black">Usage data:</strong> device, browser, IP address, pages viewed, actions taken, cookies and similar technologies.</li>
              <li><strong className="text-pitch-black">Communications:</strong> messages between parents and sitters, support emails, reviews.</li>
              <li><strong className="text-pitch-black">Social login data:</strong> if you sign in with Google, Apple or Facebook, we receive your name, email and profile picture from that provider.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">3. How we use your data</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Create and manage your account and verify identity.</li>
              <li>Match parents with sitters and process bookings.</li>
              <li>Process payments, payouts and refunds via Stripe.</li>
              <li>Send transactional emails, SMS and push notifications.</li>
              <li>Run trust and safety checks (ID, references, background screening where applicable).</li>
              <li>Improve the Service, run analytics, prevent fraud and abuse.</li>
              <li>Comply with legal obligations under UAE law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">4. Legal basis</h2>
            <p className="mt-2">
              We process personal data on the basis of: (a) your consent; (b) performance of our
              contract with you; (c) compliance with legal obligations; and (d) our legitimate
              interests in operating, securing and improving the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">5. Sharing your data</h2>
            <p className="mt-2">We share data only with:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong className="text-pitch-black">Other users</strong> as needed to complete bookings (e.g. parents see sitter profiles; sitters see booking address after confirmation).</li>
              <li><strong className="text-pitch-black">Service providers:</strong> Supabase (hosting/database), Stripe (payments), Google/Apple/Facebook (authentication), email and SMS providers, analytics tools.</li>
              <li><strong className="text-pitch-black">Authorities</strong> where required by UAE law or to protect rights, safety and property.</li>
              <li><strong className="text-pitch-black">Successors</strong> in the event of a merger, acquisition or sale of assets.</li>
            </ul>
            <p className="mt-2">We never sell your personal data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">6. International transfers</h2>
            <p className="mt-2">
              Some of our service providers (e.g. Stripe, Google, Apple, Meta) process data outside
              the UAE. Where this happens we rely on contractual safeguards and the recipient's
              own adequacy/compliance frameworks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">7. Data retention</h2>
            <p className="mt-2">
              We keep personal data only as long as needed for the purposes above, to comply with
              UAE financial and tax laws (typically 5 years for transaction records), and to
              resolve disputes or enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">8. Your rights</h2>
            <p className="mt-2">Under the UAE PDPL you have the right to:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Access your personal data and obtain a copy.</li>
              <li>Correct inaccurate data.</li>
              <li>Request deletion or restriction of processing.</li>
              <li>Withdraw consent at any time.</li>
              <li>Object to processing based on legitimate interests.</li>
              <li>Data portability where technically feasible.</li>
              <li>Lodge a complaint with the UAE Data Office.</li>
            </ul>
            <p className="mt-2">
              To exercise these rights email{" "}
              <a href="mailto:privacy@nannyrecommended.com" className="underline text-pitch-black">privacy@nannyrecommended.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">9. Security</h2>
            <p className="mt-2">
              We use industry-standard safeguards including encryption in transit (TLS), encryption
              at rest, role-based access controls, row-level security on our database, and
              regular security reviews. No system is 100% secure; you use the Service at your own
              risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">10. Children</h2>
            <p className="mt-2">
              The Service is for adults (18+). We do not knowingly collect data from children
              directly; data about children is provided by parents only for the purpose of arranging
              childcare.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">11. Cookies</h2>
            <p className="mt-2">
              We use essential cookies to keep you signed in and analytics cookies to understand
              usage. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">12. Changes</h2>
            <p className="mt-2">
              We may update this Policy from time to time. Material changes will be notified by
              email or in-app. The "Last updated" date above indicates the latest revision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-pitch-black">13. Contact</h2>
            <p className="mt-2">
              Questions? Email{" "}
              <a href="mailto:privacy@nannyrecommended.com" className="underline text-pitch-black">privacy@nannyrecommended.com</a>.
            </p>
          </section>

          <p className="text-xs text-slate-grey">
            This template is provided for convenience and does not constitute legal advice. Please
            have it reviewed by a qualified UAE lawyer before relying on it. See also our{" "}
            <Link to="/terms" className="underline text-pitch-black">Terms of Service</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
