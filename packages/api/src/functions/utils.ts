import { put } from '@vercel/blob';
import { type CreateGenerationSchema } from './schemas';
import { db } from '../db';

export const MAX_MONTHLY_GENERATIONS = 100;

export async function uploadImageToBlob(validated: CreateGenerationSchema) {
  const buffer = Buffer.from(validated.image, 'base64');
  const extension = validated.imageType.split('/')[1];
  const filename = `${Date.now()}.${extension}`;
  const blob = await put(filename, buffer, {
    access: 'public',
  });
  return blob;
}

export async function checkAndUpdateGenerationLimit({
  user,
}: {
  user: {
    id: string;
    monthlyGenerations: number;
    lastGenerationReset: Date;
  };
}): Promise<boolean> {
  const now = new Date();
  const lastReset = new Date(user.lastGenerationReset);

  if (
    now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
    now.getUTCMonth() !== lastReset.getUTCMonth()
  ) {
    await db.user.update({
      where: { id: user.id },
      data: {
        monthlyGenerations: 1,
        lastGenerationReset: now,
      },
    });
    return true;
  }

  // If under monthly limit, increment counter
  if (user.monthlyGenerations < MAX_MONTHLY_GENERATIONS) {
    await db.user.update({
      where: { id: user.id },
      data: {
        monthlyGenerations: {
          increment: 1,
        },
      },
    });
    return true;
  }

  return false;
}
