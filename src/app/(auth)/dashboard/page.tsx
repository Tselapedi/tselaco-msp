import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.email}</h1>
        <p className="mt-2 text-gray-600">Here's what's happening with your rides today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => router.push('/book-ride')}
          className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <h3 className="text-lg font-semibold">Book a Ride</h3>
          <p className="mt-2 text-sm">Request a ride to your destination</p>
        </button>

        <button
          onClick={() => router.push('/rides')}
          className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition-colors"
        >
          <h3 className="text-lg font-semibold">My Rides</h3>
          <p className="mt-2 text-sm">View your ride history</p>
        </button>

        <button
          onClick={() => router.push('/profile')}
          className="bg-purple-600 text-white p-6 rounded-lg shadow hover:bg-purple-700 transition-colors"
        >
          <h3 className="text-lg font-semibold">Profile Settings</h3>
          <p className="mt-2 text-sm">Update your account information</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Placeholder for recent rides */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">No recent rides</p>
                <p className="text-sm text-gray-500">Your ride history will appear here</p>
              </div>
              <button
                onClick={() => router.push('/book-ride')}
                className="text-blue-600 hover:text-blue-800"
              >
                Book a ride
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Rewards</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">0 Points</p>
              <p className="text-sm text-gray-500">Start earning points with your rides</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Next reward at</p>
              <p className="text-lg font-semibold">100 Points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
