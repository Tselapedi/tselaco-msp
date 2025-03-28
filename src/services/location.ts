// Mock data for testing
const mockPlaces = [
  {
    id: '1',
    name: 'Sandton City Mall',
    coordinates: [-26.1075, 28.0567],
    address: 'Sandton, Johannesburg'
  },
  {
    id: '2',
    name: 'Rosebank Mall',
    coordinates: [-26.1467, 28.0417],
    address: 'Rosebank, Johannesburg'
  },
  {
    id: '3',
    name: 'Melrose Arch',
    coordinates: [-26.0983, 28.0583],
    address: 'Melrose, Johannesburg'
  },
  {
    id: '4',
    name: 'Fourways Mall',
    coordinates: [-26.0167, 27.9833],
    address: 'Fourways, Johannesburg'
  },
  {
    id: '5',
    name: 'Eastgate Shopping Centre',
    coordinates: [-26.2333, 28.1333],
    address: 'Bedfordview, Johannesburg'
  }
];

export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface Route {
  distance: number; // in meters
  duration: number; // in seconds
  polyline: string;
}

export interface Place {
  id: string;
  name: string;
  coordinates: [number, number];
  address?: string;
}

// Mock function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export async function calculateRoute(
  departure: Location,
  destination: Location
): Promise<Route> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const distance = calculateDistance(departure.lat, departure.lng, destination.lat, destination.lng);
  
  // Assume average speed of 60km/h
  const duration = (distance / 16.67) * 1000; // Convert to seconds

  // Generate a simple polyline (dummy data)
  const polyline = `_p~iF~ps|U_ulLnnqC_mqNvxq`; // This is a dummy polyline

  return {
    distance,
    duration,
    polyline
  };
}

export async function searchPlaces(query: string): Promise<Place[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Filter mock places based on query
  return mockPlaces.filter(place =>
    place.name.toLowerCase().includes(query.toLowerCase()) ||
    place.address?.toLowerCase().includes(query.toLowerCase())
  );
}

export function calculateFare(
  distance: number,
  duration: number,
  rideType: string
): number {
  // Base rates per kilometer for different ride types
  const baseRates = {
    standard: 18,
    premium: 25,
    xl: 30
  };

  // Convert distance from meters to kilometers
  const distanceInKm = distance / 1000;

  // Calculate base fare
  const baseFare = distanceInKm * baseRates[rideType as keyof typeof baseRates];

  // Add time-based charges (R1 per minute)
  const timeCharge = (duration / 60) * 1;

  // Add minimum fare
  const minimumFare = 50;

  // Calculate total fare
  const totalFare = Math.max(baseFare + timeCharge, minimumFare);

  // Round to nearest 5
  return Math.round(totalFare / 5) * 5;
} 
