import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand, AdminConfirmSignUpCommand, AdminCreateUserCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';

const REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'af-south-1';
const USER_POOL_ID = process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;

if (!USER_POOL_ID || !CLIENT_ID) {
  throw new Error('AWS Cognito configuration is missing');
}

const cognitoClient = new CognitoIdentityProviderClient({
  region: REGION,
});

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  idNumber: string;
  role: 'PASSENGER' | 'DRIVER';
}

export async function signUp({
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
  idNumber,
  role,
}: SignUpParams) {
  try {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
        { Name: 'phone_number', Value: phoneNumber },
        { Name: 'custom:id_number', Value: idNumber },
        { Name: 'custom:role', Value: role },
      ],
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error('Error signing in user:', error);
    throw error;
  }
}

export async function confirmSignUp(email: string, code: string) {
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error('Error confirming sign up:', error);
    throw error;
  }
}

export async function adminCreateUser(email: string, userAttributes: Record<string, string>) {
  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: Object.entries(userAttributes).map(([Name, Value]) => ({ Name, Value })),
      MessageAction: 'SUPPRESS', // Don't send welcome email
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function adminSetUserPassword(email: string, password: string, permanent = true) {
  try {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: permanent,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error('Error setting user password:', error);
    throw error;
  }
} 
