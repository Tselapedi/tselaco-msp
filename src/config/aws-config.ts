export const AWS_CONFIG = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'af-south-1',
  cognito: {
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID || '',
    clientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID || '',
  },
  location: {
    placeIndex: process.env.NEXT_PUBLIC_AWS_LOCATION_PLACE_INDEX || '',
    trackerName: process.env.NEXT_PUBLIC_AWS_LOCATION_TRACKER_NAME || '',
    mapName: process.env.NEXT_PUBLIC_AWS_LOCATION_MAP_NAME || '',
  },
} as const;

export const MAP_CONFIG = {
  defaultCenter: {
    lat: -26.2041, // Johannesburg coordinates
    lng: 28.0473,
  },
  defaultZoom: 11,
  style: 'mapbox://styles/mapbox/streets-v11',
} as const;

// Validation rules
export const VALIDATION = {
  idNumber: {
    pattern: /^\d{13}$/, // South African ID number format
    message: 'Please enter a valid 13-digit South African ID number',
  },
  phoneNumber: {
    pattern: /^(\+27|0)[6-8][0-9]{8}$/, // South African phone number format
    message: 'Please enter a valid South African phone number',
  },
  password: {
    minLength: 8,
    message: 'Password must be at least 8 characters long',
  },
} as const; 
