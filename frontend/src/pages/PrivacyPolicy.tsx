import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last Updated: January 2025
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                1. Introduction & Scope
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>MyGround (MG)</strong>, operated by MyGround Technologies Private Limited ("we", "us", "our", or "Company"), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web and mobile application, services, and platform (collectively, the "Service").
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This Privacy Policy applies to all users of MyGround, including property owners, brokers, developers, buyers, tenants, and investors, whether accessing the Service from India or internationally.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                By using MyGround, you consent to the data practices described in this Privacy Policy. If you do not agree with this policy, please do not use our Service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                2. Information We Collect
              </h2>
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">2.1 Personal Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  When you register an account or use our Service, we may collect the following personal information:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                  <li><strong>Identity Information:</strong> First name, last name, email address, mobile phone number</li>
                  <li><strong>Account Information:</strong> Username, password (encrypted), user role (USER, OWNER, BROKER, DEVELOPER, ADMIN)</li>
                  <li><strong>Profile Information:</strong> Profile picture, bio, verification status</li>
                  <li><strong>Communication Data:</strong> Messages, inquiries, and communications with other users</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">2.2 Location Data</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  We collect location information to provide location-based services:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                  <li><strong>GPS Coordinates:</strong> When you enable location services on your device</li>
                  <li><strong>Map Pin Locations:</strong> When you select or pin a location on maps (using Leaflet or other map services)</li>
                  <li><strong>IP-based Location:</strong> Approximate location derived from your IP address</li>
                  <li><strong>Property Locations:</strong> Location data associated with property listings (address, area, city, state, coordinates)</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  You can control location permissions through your device settings. However, some features may require location access to function properly.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">2.3 Property-Related Data</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  When you create property listings, we collect:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Property details (type, category, size, specifications)</li>
                  <li>Transaction type (SELL, RENT, LEASE, SUB-LEASE, fractional ownership)</li>
                  <li>Pricing information (expected price, rent amount)</li>
                  <li>Property images, videos, and media files</li>
                  <li>Property documents (title deeds, approvals, permits, certificates)</li>
                  <li>Asset intelligence data (MG Asset DNA™ verification scores, legal risk assessments)</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">2.4 Draft Property Data</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Draft property listings are saved on our servers and are:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Private and visible only to the account that created them</li>
                  <li>Stored securely until published or deleted by the user</li>
                  <li>Not displayed to other users or indexed for search</li>
                  <li>Subject to the same data protection measures as published listings</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">2.5 Usage & Technical Data</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  We automatically collect technical information when you use our Service:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Device information (device type, operating system, browser type)</li>
                  <li>Log data (IP address, access times, pages visited, features used)</li>
                  <li>Usage patterns (searches performed, listings viewed, interactions)</li>
                  <li>Performance data (load times, errors, crashes)</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                3. How We Use the Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Service Provision:</strong> To provide, maintain, and improve our Service, including property listings, search, and user connections</li>
                <li><strong>Account Management:</strong> To create and manage your account, authenticate users, and process transactions</li>
                <li><strong>Communication:</strong> To send you notifications, updates, marketing communications (with your consent), and respond to your inquiries</li>
                <li><strong>Property Verification:</strong> To verify property information using MG Asset DNA™ and other verification systems</li>
                <li><strong>Location Services:</strong> To provide location-based features, map services, and property search by location</li>
                <li><strong>Personalization:</strong> To personalize your experience, show relevant listings, and improve recommendations</li>
                <li><strong>Analytics:</strong> To analyze usage patterns, improve our Service, and develop new features</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations, enforce our Terms & Conditions, and protect our rights</li>
                <li><strong>Security:</strong> To detect, prevent, and address fraud, security breaches, and technical issues</li>
                <li><strong>Research:</strong> To conduct research and analysis (in anonymized, aggregated form)</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                4. Draft Property Data Handling
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Draft property listings are handled with special care to ensure your privacy:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Privacy:</strong> Draft listings are private and accessible only to the account that created them. They are not visible to other users, not indexed for search, and not displayed in public listings</li>
                <li><strong>Storage:</strong> Draft data is stored securely on our servers with the same security measures as published listings</li>
                <li><strong>Retention:</strong> Draft listings are retained until you publish, delete, or your account is terminated</li>
                <li><strong>Access:</strong> Only you can view, edit, publish, or delete your draft listings through your account</li>
                <li><strong>Backup:</strong> Draft data may be included in system backups for disaster recovery purposes, but remains private</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                When you publish a draft listing, it becomes public and subject to our standard listing policies and public visibility.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                5. Location & GPS Data Usage
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Location data is essential for many features of MyGround:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Property Listings:</strong> To display property locations on maps and enable location-based search</li>
                <li><strong>Search & Discovery:</strong> To find properties near you or in specific areas</li>
                <li><strong>Map Services:</strong> To provide interactive maps, directions, and location selection tools</li>
                <li><strong>User Location:</strong> To personalize search results based on your location (with your consent)</li>
                <li><strong>Analytics:</strong> To understand usage patterns and improve location-based features</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Location data is collected through:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                <li>GPS coordinates from your device (when permission is granted)</li>
                <li>Map pin selections you make on our platform</li>
                <li>IP-based geolocation (approximate location)</li>
                <li>Location information you manually provide (addresses, areas, cities)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                You can disable location services through your device settings, but some features may be unavailable. We use location data only for legitimate business purposes and in accordance with this Privacy Policy.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                6. Cookies & Tracking Technologies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We use cookies, web beacons, and similar tracking technologies to enhance your experience:
              </p>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">6.1 Types of Cookies</h3>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for the Service to function (authentication, security, basic features)</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings (language, theme, location)</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Service</li>
                  <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements (if applicable)</li>
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">6.2 Third-Party Analytics</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We may use third-party analytics services (such as Google Analytics) to track and analyze usage. These services may use cookies and collect information about your use of our Service. You can opt out of analytics tracking through your browser settings or the service provider's opt-out mechanisms.
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Most browsers allow you to control cookies through settings. However, disabling cookies may limit your ability to use certain features of the Service.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                7. Data Sharing & Third Parties
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">7.1 With Your Consent</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We may share your information with third parties when you explicitly consent, such as connecting your account to social media platforms.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">7.2 Service Providers</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  We may share information with trusted third-party service providers who assist us in operating our Service:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Payment processors (Razorpay, Stripe) for payment transactions</li>
                  <li>Cloud hosting providers for data storage and infrastructure</li>
                  <li>Map service providers (Leaflet, Google Maps) for location services</li>
                  <li>Analytics providers for usage analysis</li>
                  <li>Email and SMS service providers for communications</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  These service providers are contractually obligated to protect your information and use it only for specified purposes.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">7.3 Legal Requirements</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We may disclose information if required by law, regulation, legal process, or government request, or to protect our rights, property, or safety, or that of our users or others.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">7.4 Business Transfers</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity, subject to the same privacy protections.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">7.5 Public Property Listings</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Published property listings, including property details, images, and location information, are publicly visible to all users of the Service. Contact information may be displayed as part of listings with your consent.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                8. Data Storage, Security & Retention
              </h2>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">8.1 Data Storage</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Your information is stored on secure servers located in India and may be stored in other jurisdictions where our service providers operate. We implement appropriate technical and organizational measures to protect your data.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">8.2 Security Measures</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  We employ industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Encryption of data in transit (SSL/TLS) and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  However, no method of transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">8.3 Data Retention</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  We retain your information for as long as necessary to:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Provide our Service and fulfill the purposes described in this Privacy Policy</li>
                  <li>Comply with legal obligations, resolve disputes, and enforce our agreements</li>
                  <li>Maintain security and prevent fraud</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  When you delete your account or request deletion, we will delete or anonymize your information, except where retention is required by law or for legitimate business purposes (e.g., transaction records, legal compliance).
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                9. User Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You have certain rights regarding your personal information, subject to applicable law:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information we hold</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal and contractual obligations)</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Opt out of marketing communications and certain data processing activities</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where consent is the legal basis</li>
                <li><strong>Object:</strong> Object to processing of your information for certain purposes</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To exercise these rights, please contact us at <a href="mailto:admin@myground.in" className="text-primary-600 dark:text-primary-400 hover:underline">admin@myground.in</a>. We will respond to your request within a reasonable timeframe and in accordance with applicable law.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                You may also update certain information directly through your account settings on the platform.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MyGround is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If we become aware that we have collected information from a child under 18 without parental consent, we will take steps to delete such information promptly.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                11. International Data Transfers
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                MyGround operates primarily in India, but your information may be transferred to and stored in servers located outside India, including in countries that may not have the same data protection laws as your jurisdiction.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                When we transfer your information internationally, we take appropriate safeguards to ensure your information receives adequate protection, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Using standard contractual clauses approved by data protection authorities</li>
                <li>Ensuring service providers comply with data protection standards</li>
                <li>Implementing appropriate security measures</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                For users in the European Economic Area (EEA), we comply with applicable GDPR requirements. For users in India, we comply with the Information Technology Act, 2000 and related rules.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                12. Changes to Privacy Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Posting the updated Privacy Policy on the platform</li>
                <li>Sending an email to your registered email address</li>
                <li>Displaying a prominent notice on the Service</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Your continued use of the Service after changes become effective constitutes acceptance of the updated Privacy Policy. If you do not agree to the changes, you should stop using the Service and may delete your account.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                The "Last Updated" date at the top of this page indicates when this Privacy Policy was last revised.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-8">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-4">
                13. Contact & Grievance Redressal
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Privacy Officer</strong>
                </p>
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
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We will respond to your inquiry within 30 days or as required by applicable law.
              </p>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Grievance Redressal (India)</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, if you have a grievance regarding content or data handling, you may contact our Grievance Officer at <a href="mailto:admin@myground.in" className="text-primary-600 dark:text-primary-400 hover:underline">admin@myground.in</a>.
                </p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                By using MyGround, you acknowledge that you have read, understood, and agree to this Privacy Policy.
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

