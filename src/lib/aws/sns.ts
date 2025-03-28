import { SNSClient, PublishCommand, CreatePlatformEndpointCommand } from '@aws-sdk/client-sns';

const REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'af-south-1';
const PLATFORM_APPLICATION_ARN = process.env.NEXT_PUBLIC_AWS_SNS_PLATFORM_APPLICATION_ARN;

if (!PLATFORM_APPLICATION_ARN) {
  throw new Error('AWS SNS platform application ARN is missing');
}

const snsClient = new SNSClient({
  region: REGION,
});

export interface SendNotificationParams {
  message: string;
  subject?: string;
  targetArn: string;
}

export async function sendNotification({ message, subject, targetArn }: SendNotificationParams) {
  try {
    const command = new PublishCommand({
      Message: message,
      Subject: subject,
      TargetArn: targetArn,
    });

    const response = await snsClient.send(command);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

export async function createPlatformEndpoint(token: string, customUserData?: string) {
  try {
    const command = new CreatePlatformEndpointCommand({
      PlatformApplicationArn: PLATFORM_APPLICATION_ARN,
      Token: token,
      CustomUserData: customUserData,
    });

    const response = await snsClient.send(command);
    return response;
  } catch (error) {
    console.error('Error creating platform endpoint:', error);
    throw error;
  }
}

// Helper function to format ride status notifications
export function formatRideStatusNotification(status: string, details: Record<string, any>) {
  const messages = {
    REQUESTED: 'New ride request received',
    ACCEPTED: 'A driver has accepted your ride',
    STARTED: 'Your ride has started',
    COMPLETED: 'Your ride has been completed',
    CANCELLED: 'Your ride has been cancelled',
  };

  return {
    message: messages[status as keyof typeof messages] || 'Ride status updated',
    details: JSON.stringify(details),
  };
} 
