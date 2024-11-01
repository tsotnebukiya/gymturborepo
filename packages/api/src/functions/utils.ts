import { put } from '@vercel/blob';
import { type UploadImageToBlobProps } from './generation';

export async function uploadImageToBlob(validated: UploadImageToBlobProps) {
  const buffer = Buffer.from(validated.image, 'base64');
  const extension = validated.imageType.split('/')[1];
  const filename = `${Date.now()}.${extension}`;
  const blob = await put(filename, buffer, {
    access: 'public',
  });
  return blob;
}
