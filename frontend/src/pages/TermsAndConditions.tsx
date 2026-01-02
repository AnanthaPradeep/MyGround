import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center">
            <Logo showText={true} size="md" />
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last Updated: January 2025
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                1. Introduction & Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Welcome to <strong>MyGround (MG)</strong>, a real estate marketplace platform operated by MyGround Technologies Private Limited ("we", "us", "our", or "Company"). These Terms & Conditions ("Terms") govern your access to and use of our web and mobile application, services, and platform (collectively, the "Service").
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By accessing or using MyGround, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Service.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                These Terms constitute a legally binding agreement between you and MyGround. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                2. Eligibility & Account Registration
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You must be at least 18 years old and legally capable of entering into binding contracts to use MyGround. By registering an account, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>You are of legal age in your jurisdiction</li>
                <li>All information provided during registration is accurate, current, and complete</li>
                <li>You will maintain and update your information to keep it accurate</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You will notify us immediately of any unauthorized access to your account</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                You may register as a USER, OWNER, BROKER, DEVELOPER, or ADMIN based on your role and intended use of the platform. Each role comes with specific privileges and responsibilities as outlined in these Terms.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                3. User Roles & Responsibilities
              </h2>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">3.1 Property Owners</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Property owners can list properties for sale, rent, lease, or fractional ownership. Owners must:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Provide accurate property information and documentation</li>
                  <li>Maintain legal ownership or authorization to list properties</li>
                  <li>Respond to inquiries in a timely manner</li>
                  <li>Comply with all applicable real estate laws and regulations</li>
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">3.2 Brokers & Developers</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Brokers and developers must hold valid licenses where required by law and represent properties truthfully.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">3.3 Buyers, Tenants & Investors</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Users seeking properties must provide accurate information and conduct due diligence before making decisions.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                4. Property Listings & Draft Listings
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MyGround allows you to create property listings in various categories including Residential, Commercial, Industrial, Land, Special Assets, and Islands. You may save listings as drafts before publishing.
              </p>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">4.1 Draft Listings</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Draft listings are private and visible only to you. Drafts are saved for your convenience and can be edited, published, or deleted at any time.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">4.2 Published Listings</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Once published, listings become visible to other users. Published listings may be subject to verification and moderation by MyGround before being fully activated.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">4.3 Transaction Types</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You may list properties for SELL, RENT, LEASE, or SUB-LEASE. Fractional ownership listings are available for investment purposes. Each transaction type must be accurately represented.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                5. Accuracy of Information & User Declarations
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You are solely responsible for the accuracy, completeness, and legality of all information, documents, images, and media you upload to MyGround. You represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>All property details, pricing, location, and specifications are accurate</li>
                <li>You have the legal right to list the property</li>
                <li>All documents (title deeds, approvals, permits) are genuine and valid</li>
                <li>Images and media accurately represent the property</li>
                <li>Location data (GPS coordinates, map pins) is accurate</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                MyGround may use MG Asset DNA™ verification system to verify property information, but this does not guarantee the accuracy of user-provided data. Users remain responsible for all information they provide.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                6. Prohibited Activities
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Creating duplicate listings for the same property</li>
                <li>Providing false, misleading, or fraudulent information</li>
                <li>Impersonating another person or entity</li>
                <li>Uploading content that infringes intellectual property rights</li>
                <li>Posting offensive, discriminatory, or illegal content</li>
                <li>Attempting to circumvent platform security or verification systems</li>
                <li>Using automated systems (bots, scrapers) to access the Service</li>
                <li>Interfering with or disrupting the Service or servers</li>
                <li>Soliciting users to transact outside the platform to avoid fees (if applicable)</li>
                <li>Any activity that violates applicable laws or regulations</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Violation of these prohibitions may result in immediate suspension or termination of your account and may subject you to legal action.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                7. Intellectual Property Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The MyGround platform, including its design, logo, MG Asset DNA™, software, and all content (except user-generated content), is the exclusive property of MyGround Technologies Private Limited and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By uploading content to MyGround, you grant us a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content on the platform and in promotional materials.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                You retain ownership of your uploaded content and may remove it at any time, subject to these Terms.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                8. Payments, Fees & Refunds
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MyGround may charge fees for certain services, premium listings, or transactions. All fees will be clearly disclosed before you commit to a service.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Payments are processed through third-party payment gateways (such as Razorpay, Stripe) in accordance with their terms. MyGround is not responsible for payment processing errors or delays.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Refund policies, if applicable, will be specified at the time of purchase. Refunds are subject to our discretion and applicable laws.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                All fees are non-refundable unless otherwise stated or required by law.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                9. Verification, Moderation & Right to Remove Content
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MyGround reserves the right, but not the obligation, to verify, moderate, edit, or remove any content, listing, or user account at any time for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Violation of these Terms or our policies</li>
                <li>Misleading, false, or fraudulent information</li>
                <li>Legal compliance requirements</li>
                <li>Protection of user safety or platform integrity</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                MyGround's MG Asset DNA™ verification system may verify property information, but verification does not constitute a warranty or guarantee of accuracy. Users should conduct their own due diligence.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To the maximum extent permitted by law, MyGround and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Property transaction disputes between users</li>
                <li>Inaccuracy of user-provided information</li>
                <li>Actions or omissions of other users</li>
                <li>Service interruptions or technical issues</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MyGround is a marketplace platform and does not act as a real estate broker, agent, or advisor. We facilitate connections between users but are not a party to any transaction.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Our total liability for any claim shall not exceed the amount of fees you have paid to us in the 12 months preceding the claim, or INR 1,000, whichever is less.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                11. Indemnification
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You agree to indemnify, defend, and hold harmless MyGround, its affiliates, officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Content you upload or transmit through the Service</li>
                <li>Any property transaction you engage in through the platform</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                12. Suspension & Termination of Accounts
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MyGround reserves the right to suspend or terminate your account at any time, with or without notice, for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Violation of these Terms or our policies</li>
                <li>Fraudulent, illegal, or harmful activity</li>
                <li>Extended periods of inactivity</li>
                <li>Requests by law enforcement or regulatory authorities</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Upon termination, your right to use the Service will immediately cease. You may terminate your account at any time by contacting us or using account deletion features, if available.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Provisions of these Terms that by their nature should survive termination shall survive, including sections on Intellectual Property, Limitation of Liability, and Indemnification.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                13. Third-Party Services & Links
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MyGround may integrate with third-party services, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Payment gateways (Razorpay, Stripe)</li>
                <li>Maps and location services (Leaflet, GPS providers)</li>
                <li>Analytics and tracking services</li>
                <li>Social media platforms</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Your use of third-party services is subject to their respective terms and conditions and privacy policies. MyGround is not responsible for the availability, accuracy, or practices of third-party services.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Links to external websites are provided for convenience only. MyGround does not endorse or assume responsibility for external content or practices.
              </p>
            </section>

            {/* Section 14 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                14. Governing Law & Jurisdiction
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Any disputes arising out of or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in [City, State], India.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                If you are accessing MyGround from outside India, you are responsible for compliance with local laws. These Terms shall be interpreted to give maximum effect to their provisions while remaining enforceable under applicable law.
              </p>
            </section>

            {/* Section 15 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                15. Changes to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MyGround reserves the right to modify these Terms at any time. We will notify users of material changes by:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Posting the updated Terms on the platform</li>
                <li>Sending an email to your registered email address</li>
                <li>Displaying a notice on the Service</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Your continued use of the Service after changes become effective constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the Service and may terminate your account.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                The "Last Updated" date at the top of this page indicates when these Terms were last revised.
              </p>
            </section>

            {/* Section 16 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                16. Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions, concerns, or complaints regarding these Terms or the Service, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>MyGround Technologies Private Limited</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Email: <a href="mailto:admin@myground.in" className="text-primary-600 dark:text-primary-400 hover:underline">admin@myground.in</a>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Support: <a href="mailto:admin@myground.in" className="text-primary-600 dark:text-primary-400 hover:underline">admin@myground.in</a>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Website: <a href="https://www.myground.in" className="text-primary-600 dark:text-primary-400 hover:underline">www.myground.in</a>
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                We will respond to your inquiries within a reasonable time frame.
              </p>
            </section>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                By using MyGround, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

