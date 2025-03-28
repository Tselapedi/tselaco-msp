import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">RideConnect SA Test Views</h1>
        
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Passenger Views</h2>
              <div className="space-y-3">
                <Link 
                  href="/passenger/home"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Passenger Home
                </Link>
                <Link 
                  href="/passenger/activity"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Passenger Activity
                </Link>
                <Link 
                  href="/passenger/book"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Book Ride
                </Link>
                <Link 
                  href="/passenger/profile"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Passenger Profile
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Driver Views</h2>
              <div className="space-y-3">
                <Link 
                  href="/driver/home"
                  className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Driver Home
                </Link>
                <Link 
                  href="/driver/earnings"
                  className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Driver Earnings
                </Link>
                <Link 
                  href="/driver/online"
                  className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Go Online
                </Link>
                <Link 
                  href="/driver/profile"
                  className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Driver Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
