export default function TrustBar() {
  const trustFeatures = [
    { icon: '✔', text: 'RERA Verified' },
    { icon: '🧬', text: 'Asset DNA Powered' },
    { icon: '📍', text: 'Geo-Verified' },
    { icon: '🔒', text: 'Secure Payments' },
  ]

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap justify-center items-center gap-8">
          {trustFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-sm font-medium text-gray-700">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

