import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'af-south-1';
const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

if (!BUCKET_NAME) {
  throw new Error('AWS S3 bucket name is missing');
}

const s3Client = new S3Client({
  region: REGION,
});

export interface UploadParams {
  file: File;
  key: string;
  contentType?: string;
}

export async function uploadFile({ file, key, contentType }: UploadParams) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: contentType || file.type,
    });

    const response = await s3Client.send(command);
    return {
      url: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`,
      ...response,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function getFile(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
}

export async function deleteFile(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

export function getSignedUrl(key: string) {
  return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
} 
