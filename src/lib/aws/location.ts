import { LocationClient, SearchPlaceIndexForTextCommand, SearchPlaceIndexForPositionCommand, GetDevicePositionCommand, BatchUpdateDevicePositionCommand } from '@aws-sdk/client-location';

const REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'af-south-1';
const PLACE_INDEX = process.env.NEXT_PUBLIC_AWS_LOCATION_PLACE_INDEX;
const TRACKER_NAME = process.env.NEXT_PUBLIC_AWS_LOCATION_TRACKER_NAME;

if (!PLACE_INDEX || !TRACKER_NAME) {
  throw new Error('AWS Location Services configuration is missing');
}

const locationClient = new LocationClient({
  region: REGION,
});

export interface SearchPlaceParams {
  text: string;
  maxResults?: number;
}

export async function searchPlaces({ text, maxResults = 10 }: SearchPlaceParams) {
  try {
    const command = new SearchPlaceIndexForTextCommand({
      IndexName: PLACE_INDEX,
      Text: text,
      MaxResults: maxResults,
      BiasPosition: [-26.2041, 28.0473], // Johannesburg coordinates as default bias
    });

    const response = await locationClient.send(command);
    return response.Results;
  } catch (error) {
    console.error('Error searching places:', error);
    throw error;
  }
}

export interface ReverseGeocodeParams {
  position: [number, number]; // [longitude, latitude]
}

export async function reverseGeocode({ position }: ReverseGeocodeParams) {
  try {
    const command = new SearchPlaceIndexForPositionCommand({
      IndexName: PLACE_INDEX,
      Position: position,
    });

    const response = await locationClient.send(command);
    return response.Results?.[0];
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
}

export interface UpdateDevicePositionParams {
  deviceId: string;
  position: [number, number]; // [longitude, latitude]
  timestamp?: Date;
}

export async function updateDevicePosition({ deviceId, position, timestamp = new Date() }: UpdateDevicePositionParams) {
  try {
    const command = new BatchUpdateDevicePositionCommand({
      TrackerName: TRACKER_NAME,
      Updates: [
        {
          DeviceId: deviceId,
          Position: position,
          SampleTime: timestamp,
        },
      ],
    });

    const response = await locationClient.send(command);
    return response;
  } catch (error) {
    console.error('Error updating device position:', error);
    throw error;
  }
}

export async function getDevicePosition(deviceId: string) {
  try {
    const command = new GetDevicePositionCommand({
      TrackerName: TRACKER_NAME,
      DeviceId: deviceId,
    });

    const response = await locationClient.send(command);
    return response;
  } catch (error) {
    console.error('Error getting device position:', error);
    throw error;
  }
} 
