import { put } from '@vercel/blob';
import { type CreateGenerationSchema } from './schemas';

export async function uploadImageToBlob(validated: CreateGenerationSchema) {
  const buffer = Buffer.from(validated.image, 'base64');
  const extension = validated.imageType.split('/')[1];
  const filename = `${Date.now()}.${extension}`;
  const blob = await put(filename, buffer, {
    access: 'public',
  });
  return blob;
}
