import { env } from './env';

export const awsConfig = {
  region: env.aws.region,
  userPoolId: env.aws.userPoolId,
  userPoolWebClientId: env.aws.userPoolWebClientId,
  userPoolDomain: env.aws.userPoolDomain,
  oauth: {
    domain: env.aws.userPoolDomain,
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: env.getReturnUrl(),
    redirectSignOut: env.getAppUrl(),
    responseType: 'code',
  },
}; 
