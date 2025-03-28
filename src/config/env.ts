export const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // URLs
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  returnUrl: process.env.NEXT_PUBLIC_RETURN_URL || 'http://localhost:3000',
  
  // AWS Configuration
  aws: {
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'af-south-1',
    userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || '',
    userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID || '',
    userPoolDomain: process.env.NEXT_PUBLIC_AWS_USER_POOL_DOMAIN || '',
  },
  
  // Get the appropriate return URL based on environment
  getReturnUrl: () => {
    if (process.env.NODE_ENV === 'development') {
      return process.env.NEXT_PUBLIC_DEV_RETURN_URL || 'http://localhost:3000';
    }
    return process.env.NEXT_PUBLIC_PROD_RETURN_URL || 'https://tselacoo.xyz';
  },
  
  // Get the appropriate app URL based on environment
  getAppUrl: () => {
    if (process.env.NODE_ENV === 'development') {
      return process.env.NEXT_PUBLIC_DEV_URL || 'http://localhost:3000';
    }
    return process.env.NEXT_PUBLIC_PROD_URL || 'https://tselacoo.xyz';
  },
}; 
