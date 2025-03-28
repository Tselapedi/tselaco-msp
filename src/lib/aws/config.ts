// AWS Region Configuration
export const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'af-south-1';

// Cognito Configuration
export const COGNITO_CONFIG = {
  USER_POOL_ID: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
  CLIENT_ID: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
};

// S3 Configuration
export const S3_CONFIG = {
  BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

// SNS Configuration
export const SNS_CONFIG = {
  PLATFORM_APPLICATION_ARN: process.env.NEXT_PUBLIC_AWS_SNS_PLATFORM_APPLICATION_ARN,
};

// Location Services Configuration
export const LOCATION_CONFIG = {
  PLACE_INDEX: process.env.NEXT_PUBLIC_AWS_LOCATION_PLACE_INDEX,
  TRACKER_NAME: process.env.NEXT_PUBLIC_AWS_LOCATION_TRACKER_NAME,
  MAP_NAME: process.env.NEXT_PUBLIC_AWS_LOCATION_MAP_NAME,
  DEFAULT_LOCATION: {
    LATITUDE: -26.2041,
    LONGITUDE: 28.0473,
    ZOOM: 12,
  },
};

// Validation Configuration
export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE_REGEX: /^(\+27|0)[6-8][0-9]{8}$/, // South African mobile numbers
  ID_NUMBER_REGEX: /^\d{13}$/, // South African ID numbers
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_DRIVER_REGISTRATION: process.env.ENABLE_DRIVER_REGISTRATION === 'true',
  ENABLE_PASSENGER_REGISTRATION: process.env.ENABLE_PASSENGER_REGISTRATION === 'true',
};

// Error Messages
export const ERROR_MESSAGES = {
  COGNITO_NOT_CONFIGURED: 'AWS Cognito is not properly configured',
  S3_NOT_CONFIGURED: 'AWS S3 is not properly configured',
  SNS_NOT_CONFIGURED: 'AWS SNS is not properly configured',
  LOCATION_NOT_CONFIGURED: 'AWS Location Services are not properly configured',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a JPEG, PNG, or PDF file',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 5MB',
  INVALID_PHONE_NUMBER: 'Please enter a valid South African mobile number',
  INVALID_ID_NUMBER: 'Please enter a valid South African ID number',
  INVALID_PASSWORD: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
}; 
