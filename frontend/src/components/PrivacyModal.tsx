import { XMarkIcon } from '@heroicons/react/24/outline'

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">
            Privacy Policy
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
                1. Introduction & Scope
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>MyGround (MG)</strong>, operated by MyGround Technologies Private Limited, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                By using MyGround, you consent to the data practices described in this Privacy Policy. If you do not agree, please do not use our Service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                2. Information We Collect
              </h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">2.1 Personal Information</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  We collect: name, email, mobile phone, account information, profile details, and communications.
                </p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">2.2 Location Data</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  We collect GPS coordinates, map pin locations, IP-based location, and property locations to provide location-based services.
                </p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">2.3 Property-Related Data</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  We collect property details, transaction types, pricing, images, documents, and asset intelligence data when you create listings.
                </p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">2.4 Draft Property Data</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Draft listings are private and visible only to you. They are stored securely until published or deleted.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                3. How We Use the Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                We use information to: provide and improve our Service, manage accounts, send communications, verify properties, provide location services, personalize experience, analyze usage, comply with laws, ensure security, and conduct research.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                4. Draft Property Data Handling
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Draft listings are private and accessible only to the account that created them. They are not visible to other users, not indexed for search, and stored securely. Draft data is retained until you publish, delete, or your account is terminated.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                5. Location & GPS Data Usage
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Location data is used to display property locations on maps, enable location-based search, provide interactive maps, personalize results, and improve location-based features. You can control location permissions through device settings.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                6. Cookies & Tracking Technologies
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                We use cookies, web beacons, and similar technologies for essential functions, remembering preferences, analytics, and advertising. You can control cookies through browser settings, but disabling them may limit features.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                7. Data Sharing & Third Parties
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                We do not sell your personal information. We may share information with: service providers (payment processors, cloud hosts, map services), when required by law, in business transfers, and published property listings are publicly visible.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                8. Data Storage, Security & Retention
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Information is stored on secure servers with encryption, access controls, and regular security assessments. We retain information as long as necessary to provide Service, comply with laws, and resolve disputes.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                9. User Rights
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                You have rights to: access, correction, deletion, portability, opt-out, withdraw consent, and object to processing. Contact us at admin@myground.in to exercise these rights.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                10. Children's Privacy
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                MyGround is not intended for individuals under 18. We do not knowingly collect information from children under 18.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                11. International Data Transfers
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Information may be transferred to servers outside India. We implement safeguards to ensure adequate protection. We comply with GDPR requirements for EEA users and India IT Act for Indian users.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                12. Changes to Privacy Policy
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                We may update this Privacy Policy. We will notify users of material changes by posting on the platform or sending email. Continued use after changes constitutes acceptance.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-8">
              <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-3">
                13. Contact & Grievance Redressal
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                For questions or concerns, contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-3">
                <p className="text-gray-700 dark:text-gray-300 mb-1"><strong>Privacy Officer</strong></p>
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

