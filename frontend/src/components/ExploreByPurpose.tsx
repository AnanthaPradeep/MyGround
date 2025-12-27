import { Link } from 'react-router-dom'

export default function ExploreByPurpose() {
  const purposes = [
    {
      icon: '🏡',
      title: 'Buy a Home',
      description: 'Find your dream home',
      link: '/properties?transactionType=SELL&propertyCategory=RESIDENTIAL',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '💼',
      title: 'Invest for Returns',
      description: 'Commercial & rental properties',
      link: '/properties?transactionType=RENT',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: '🌾',
      title: 'Buy Land',
      description: 'Residential & commercial plots',
      link: '/properties?propertyCategory=LAND',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: '🏢',
      title: 'Lease Commercial',
      description: 'Office spaces & retail',
      link: '/properties?transactionType=LEASE&propertyCategory=COMMERCIAL',
      color: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore by Purpose</h2>
          <p className="text-gray-600">Find properties that match your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {purposes.map((purpose, index) => (
            <Link
              key={index}
              to={purpose.link}
              className={`bg-gradient-to-br ${purpose.color} rounded-xl p-6 text-white hover:shadow-lg transition-shadow`}
            >
              <div className="text-4xl mb-4">{purpose.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{purpose.title}</h3>
              <p className="text-white/90 text-sm">{purpose.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

