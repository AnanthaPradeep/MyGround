import { XMarkIcon } from '@heroicons/react/24/outline'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">
            Terms & Conditions
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto scrollbar-hide px-6 py-4 flex-1">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Last Updated: January 2025
            </p>

            {/* Section 1 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                1. Introduction & Acceptance of Terms
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Welcome to <strong>MyGround (MG)</strong>, a real estate marketplace platform operated by MyGround Technologies Private Limited ("we", "us", "our", or "Company"). These Terms & Conditions ("Terms") govern your access to and use of our web and mobile application, services, and platform (collectively, the "Service").
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                By accessing or using MyGround, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Service.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                These Terms constitute a legally binding agreement between you and MyGround. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                2. Eligibility & Account Registration
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                You must be at least 18 years old and legally capable of entering into binding contracts to use MyGround. By registering an account, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mb-3 text-gray-700 dark:text-gray-300 space-y-1">
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
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                3. User Roles & Responsibilities
              </h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">3.1 Property Owners</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Property owners can list properties for sale, rent, lease, or fractional ownership. Owners must provide accurate property information, maintain legal ownership, respond to inquiries, and comply with applicable laws.
                </p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">3.2 Brokers & Developers</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Brokers and developers must hold valid licenses where required by law and represent properties truthfully.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                4. Property Listings & Draft Listings
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                MyGround allows you to create property listings in various categories. Draft listings are private and visible only to you. Once published, listings become visible to other users and may be subject to verification.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                5. Accuracy of Information & User Declarations
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                You are solely responsible for the accuracy, completeness, and legality of all information you upload. You represent that all property details, documents, and location data are accurate and genuine.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                6. Prohibited Activities
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                You agree not to: create duplicate listings, provide false information, impersonate others, infringe intellectual property, post offensive content, circumvent security, use automated systems, or engage in any illegal activity.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                7. Intellectual Property Rights
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                The MyGround platform, including its design, logo, MG Asset DNA™, and software, is the property of MyGround Technologies Private Limited. By uploading content, you grant us a non-exclusive license to use it on the platform.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                8. Payments, Fees & Refunds
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                MyGround may charge fees for certain services. Payments are processed through third-party gateways. Refund policies will be specified at the time of purchase. All fees are non-refundable unless otherwise stated.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                9. Verification, Moderation & Right to Remove Content
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                MyGround reserves the right to verify, moderate, edit, or remove any content or user account at any time for violation of Terms, misleading information, legal compliance, or protection of user safety.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                10. Limitation of Liability
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                To the maximum extent permitted by law, MyGround shall not be liable for indirect, incidental, special, or consequential damages. MyGround is a marketplace platform and does not act as a real estate broker or agent.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                11. Indemnification
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                You agree to indemnify and hold harmless MyGround from any claims arising from your use of the Service, violation of Terms, or violation of any rights of another party.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                12. Suspension & Termination
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                MyGround reserves the right to suspend or terminate your account at any time for violation of Terms, fraudulent activity, or legal requirements. You may terminate your account at any time.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                13. Third-Party Services & Links
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                MyGround may integrate with third-party services including payment gateways, maps, and analytics. Your use of third-party services is subject to their terms. MyGround is not responsible for third-party services.
              </p>
            </section>

            {/* Section 14 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                14. Governing Law & Jurisdiction
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>

            {/* Section 15 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                15. Changes to Terms
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We may modify these Terms at any time. We will notify users of material changes by posting on the platform or sending email. Continued use after changes constitutes acceptance.
              </p>
            </section>

            {/* Section 16 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                16. Contact Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                For questions or concerns, contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-1"><strong>MyGround Technologies Private Limited</strong></p>
                <p className="text-gray-700 dark:text-gray-300">Email: admin@myground.in</p>
                <p className="text-gray-700 dark:text-gray-300">Support: admin@myground.in</p>
                <p className="text-gray-700 dark:text-gray-300">Website: www.myground.in</p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

