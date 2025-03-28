import Background3D from '@/components/landing/Background3D';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <Background3D />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">RideConnect SA</div>
          <div className="space-x-6">
            <Link href="/login" className="text-white hover:text-blue-200 transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Your Journey, Our Priority
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in-delay">
            Experience seamless rides with South Africa's most trusted ride-hailing platform.
            Safe, reliable, and convenient.
          </p>
          <div className="space-x-4 animate-fade-in-delay-2">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="border-2 border-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors inline-block"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl hover:bg-white/20 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantages Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Why Tselaco is Better</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitiveAdvantages.map((advantage, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{advantage.icon}</div>
                  <h3 className="text-xl font-semibold text-white">{advantage.title}</h3>
                </div>
                <div className="space-y-4">
                  {advantage.comparisons.map((comparison, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-200">{comparison.service}</span>
                      <span className={`font-semibold ${comparison.isBetter ? 'text-green-400' : 'text-gray-400'}`}>
                        {comparison.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Start Riding?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied passengers and drivers who trust RideConnect SA for their
            transportation needs.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} RideConnect SA. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: '🚗',
    title: 'Safe & Reliable',
    description: 'Our drivers are thoroughly vetted and vehicles are regularly inspected for your safety.',
  },
  {
    icon: '⚡',
    title: 'Fast & Efficient',
    description: 'Quick pickup times and optimized routes to get you to your destination faster.',
  },
  {
    icon: '💳',
    title: 'Affordable Rates',
    description: 'Competitive pricing with transparent fare calculations and no hidden charges.',
  },
];

const competitiveAdvantages = [
  {
    icon: '💰',
    title: 'Lower Fares',
    comparisons: [
      { service: 'Uber', value: 'R25-30/km', isBetter: false },
      { service: 'Bolt', value: 'R22-28/km', isBetter: false },
      { service: 'InDrive', value: 'R20-25/km', isBetter: false },
      { service: 'Minibus Taxi', value: 'R15-20/km', isBetter: false },
      { service: 'Tselaco', value: '15-30% Savings', isBetter: true },
    ],
  },
  {
    icon: '🎯',
    title: 'Driver Earnings',
    comparisons: [
      { service: 'Uber', value: '75%', isBetter: false },
      { service: 'Bolt', value: '80%', isBetter: false },
      { service: 'InDrive', value: '85%', isBetter: false },
      { service: 'Minibus Taxi', value: '100%', isBetter: false },
      { service: 'Tselaco', value: '95%', isBetter: true },
    ],
  },
  {
    icon: '⚡',
    title: 'Platform Fee',
    comparisons: [
      { service: 'Uber', value: '25%', isBetter: false },
      { service: 'Bolt', value: '20%', isBetter: false },
      { service: 'InDrive', value: '15%', isBetter: false },
      { service: 'Minibus Taxi', value: '0%', isBetter: false },
      { service: 'Tselaco', value: '5%', isBetter: true },
    ],
  },
  {
    icon: '⚡',
    title: 'Pickup Time',
    comparisons: [
      { service: 'Uber', value: '5-10 min', isBetter: false },
      { service: 'Bolt', value: '5-10 min', isBetter: false },
      { service: 'InDrive', value: '8-15 min', isBetter: false },
      { service: 'Minibus Taxi', value: '15-30 min', isBetter: false },
      { service: 'Tselaco', value: '3-7 min', isBetter: true },
    ],
  },
  {
    icon: '🛡️',
    title: 'Safety Features',
    comparisons: [
      { service: 'Uber', value: 'Basic', isBetter: false },
      { service: 'Bolt', value: 'Basic', isBetter: false },
      { service: 'InDrive', value: 'Basic', isBetter: false },
      { service: 'Minibus Taxi', value: 'None', isBetter: false },
      { service: 'Tselaco', value: 'Advanced', isBetter: true },
    ],
  },
  {
    icon: '🎁',
    title: 'Rewards Program',
    comparisons: [
      { service: 'Uber', value: 'Points', isBetter: false },
      { service: 'Bolt', value: 'Limited', isBetter: false },
      { service: 'InDrive', value: 'None', isBetter: false },
      { service: 'Minibus Taxi', value: 'None', isBetter: false },
      { service: 'Tselaco', value: 'Points + Cashback', isBetter: true },
    ],
  },
  {
    icon: '🌍',
    title: 'Coverage',
    comparisons: [
      { service: 'Uber', value: 'Major Cities', isBetter: false },
      { service: 'Bolt', value: 'Major Cities', isBetter: false },
      { service: 'InDrive', value: 'Limited', isBetter: false },
      { service: 'Minibus Taxi', value: 'Wide', isBetter: false },
      { service: 'Tselaco', value: 'Nationwide', isBetter: true },
    ],
  },
]; 
