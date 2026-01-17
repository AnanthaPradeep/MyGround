import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Bars3Icon, BanknotesIcon, MapPinIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import api from '../services/api'
import Logo from '../components/Logo'
import HeaderSearchDropdown from '../components/HeaderSearchDropdown'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import UserDropdown from '../components/UserDropdown'
import MobileMenu from '../components/MobileMenu'
import Footer from '../components/Footer'
import { EAuctionBid, EAuctionProperty } from '../types/eauction'

export default function EAuctionDetail() {
  const { id } = useParams<{ id: string }>()
  const [auction, setAuction] = useState<EAuctionProperty | null>(null)
  const [bids, setBids] = useState<EAuctionBid[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await api.get(`/eauctions/${id}`)
        setAuction(response.data.auction)
      } catch (error) {
        console.error('Failed to load auction', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAuction()
    }
  }, [id])

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await api.get(`/eauctions/${id}/bids`)
        setBids(response.data.bids || [])
      } catch (error) {
        // bidding history requires auth; ignore for public view
      }
    }

    if (id) {
      fetchBids()
    }
  }, [id])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">Loading auction...</div>
  }

  if (!auction) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">Auction not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <Logo showText={true} size="md" className="hidden lg:flex lg:flex-1" />

            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <HeaderSearchDropdown />
              <HeaderLocation />
              <HeaderIcons />
              <UserDropdown />
            </div>

            <div className="lg:hidden flex items-center">
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="h-72 bg-gray-100 dark:bg-gray-700">
                {auction.media?.images?.[0] ? (
                  <img
                    src={auction.media.images[0]}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-primary-600 dark:text-primary-400">
                    {auction.status}
                  </span>
                  <span className="text-xs text-gray-500">{auction.authorityType}</span>
                </div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mt-2 mb-3">
                  {auction.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{auction.description}</p>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{auction.location?.address || auction.location?.city || 'Location TBA'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Auction Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <BanknotesIcon className="w-4 h-4" />
                  <span>Reserve Price: ₹{auction.reservePrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BanknotesIcon className="w-4 h-4" />
                  <span>Bid Increment: ₹{auction.bidIncrement.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>Starts: {new Date(auction.startAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>Ends: {new Date(auction.endAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Legal Disclaimer</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{auction.legalDisclaimer}</p>
            </div>

            {auction.documents && auction.documents.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Documents</h2>
                <div className="space-y-2">
                  {auction.documents.map((doc) => (
                    <a
                      key={doc._id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400"
                    >
                      <DocumentTextIcon className="w-4 h-4" />
                      {doc.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Authority</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{auction.authorityName}</p>
              {auction.authorityReference && (
                <p className="text-xs text-gray-500 mt-2">Ref: {auction.authorityReference}</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">EMD Requirements</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {auction.emdRequired ? `EMD Required: ₹${auction.emdAmount?.toLocaleString() || '—'}` : 'No EMD required'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Bidding is available after KYC verification and terms acceptance.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent Bids</h3>
              {bids.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">Bid history is visible after login.</p>
              ) : (
                <div className="space-y-2">
                  {bids.slice(0, 5).map((bid) => (
                    <div key={bid.id} className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                      <span>{bid.bidder}</span>
                      <span>₹{Number(bid.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
