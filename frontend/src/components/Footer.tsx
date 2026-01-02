import { Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Logo from './Logo'
import ProtectedLink from './ProtectedLink'

interface FooterProps {
  showLoginModal?: () => void
}

export default function Footer({ showLoginModal }: FooterProps) {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    toast.success('Thank you for subscribing!')
    setEmail('')
  }

  return (
    <footer className="bg-[#fafafa] dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 sm:py-16 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-12">
          {/* Left Section - Logo and Navigation Links */}
          <div className="lg:col-span-8">
            {/* Logo */}
            <div className="mb-8">
              <Logo showText={true} size="md" />
            </div>

            {/* Navigation Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              {/* Company Column */}
              <div>
                <h2 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 dark:text-gray-100">
                  Company
                </h2>
                <ul className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  <li>
                    <Link 
                      to="/register" 
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      Join MyGround
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/login" 
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/about" 
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/contact" 
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Explore Column */}
              <div>
                <h2 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 dark:text-gray-100">
                  Explore
                </h2>
                <ul className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  <li>
                    <ProtectedLink 
                      to="/properties"
                      showLoginModal={showLoginModal}
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      Browse Properties
                    </ProtectedLink>
                  </li>
                  <li>
                    <ProtectedLink 
                      to="/properties/create"
                      showLoginModal={showLoginModal}
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      List Your Property
                    </ProtectedLink>
                  </li>
                  <li>
                    <ProtectedLink 
                      to="/properties"
                      showLoginModal={showLoginModal}
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      Advanced Search
                    </ProtectedLink>
                  </li>
                  <li>
                    <Link 
                      to="/pricing" 
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Community Column */}
              <div>
                <h2 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 dark:text-gray-100">
                  Community
                </h2>
                <ul className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  <li>
                    <ProtectedLink 
                      to="/dashboard"
                      showLoginModal={showLoginModal}
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      For Property Owners
                    </ProtectedLink>
                  </li>
                  <li>
                    <ProtectedLink 
                      to="/properties"
                      showLoginModal={showLoginModal}
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      For Buyers
                    </ProtectedLink>
                  </li>
                  <li>
                    <Link 
                      to="/help" 
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/blog" 
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                    >
                      Blog & Insights
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section - Subscription */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-md dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl sm:text-2xl font-heading font-bold mb-3 text-gray-900 dark:text-gray-100 leading-tight">
                Subscribe and get{' '}
                <span className="text-primary-600 dark:text-primary-400">expert property insights</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Get the latest property trends, market updates, and investment guides. Built by real estate experts with decades of experience.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div>
                  <label htmlFor="footer-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-semibold transition-all duration-200 text-sm sm:text-base shadow-sm hover:shadow-md"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* Left - App Downloads */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* QR Code Placeholder */}
              <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 shadow-sm">
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2 font-medium">QR Code</span>
              </div>
              
              {/* App Store Buttons */}
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-black dark:bg-gray-800 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="Download on the App Store"
                >
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.69-2.4.59-3.65-.4C2.79 15.25 2.5 10.45 5.05 7.96c1.15-1.15 2.5-1.62 3.9-1.62 1.05 0 2.05.37 2.95.37.89 0 1.8-.37 2.95-.37 1.28 0 2.5.47 3.6 1.45-3.12 1.9-2.38 6.7.99 8.25-.61 1.63-1.4 3.22-2.4 4.84zm-2.05-17.28c-1.54 1.35-4.05 1.2-5.5-.15-1.2-1.2-1.6-3.05-.85-4.8 1.7.15 3.7 1.15 4.85 2.5 1.15 1.35 1.5 3.05.5 4.45z"/>
                  </svg>
                  <span className="text-xs font-medium whitespace-nowrap">Download on the App Store</span>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-black dark:bg-gray-800 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="GET IT ON Google Play"
                >
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <span className="text-xs font-medium whitespace-nowrap">GET IT ON Google Play</span>
                </a>
              </div>
            </div>

            {/* Right - Social Media and Legal Links */}
            <div className="flex flex-col items-start lg:items-end gap-5">
              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-500 hover:border-primary-600 dark:hover:border-primary-500 hover:text-white text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-500 hover:border-primary-600 dark:hover:border-primary-500 hover:text-white text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-500 hover:border-primary-600 dark:hover:border-primary-500 hover:text-white text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.008v-3.47h3.008v-2.64c0-3.976 2.368-6.174 5.992-6.174 1.736 0 3.552.25 3.552.25v3.907h-2.002c-1.979 0-2.596 1.229-2.596 2.488v1.98h4.397l-.701 3.47h-3.696v8.385c5.736-.9 10.125-5.864 10.125-11.854z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-500 hover:border-primary-600 dark:hover:border-primary-500 hover:text-white text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-500 hover:border-primary-600 dark:hover:border-primary-500 hover:text-white text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <Link 
                  to="/privacy" 
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms" 
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link 
                  to="/cookie-policy" 
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Cookie Policy
                </Link>
                <Link 
                  to="/accessibility" 
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; 2024 MyGround. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
