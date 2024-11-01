import { uploadImageToBlob } from './utils';
import { generateGymResponse } from './openai';
import { db } from '../db';

export interface UploadImageToBlobProps {
  image: string;
  imageType: string;
}

interface CreateGenerationProps {
  validated: UploadImageToBlobProps;
  generatedId: number;
  userId: string;
}
export async function createGeneration({
  validated,
  generatedId,
  userId,
}: CreateGenerationProps) {
  const blob = await uploadImageToBlob(validated);
  try {
    const gymEquipmentResponse = await generateGymResponse(validated.image);
    if (!gymEquipmentResponse?.name) {
      throw new Error('No name found in the response');
    }
    const { name, description, exercises } = gymEquipmentResponse;
    await db.generation.update({
      where: { id: generatedId },
      data: {
        status: 'COMPLETED',
        exercise: {
          createMany: {
            data: exercises.map((ex) => ({
              name: ex.name,
              description: ex.description,
              category: ex.category,
              subcategory: ex.subcategory,
              userId,
            })),
          },
        },
        name,
        description,
      },
    });
    console.log('COMPLETED');
  } catch (error) {
    console.error(error);
    await db.generation.update({
      where: { id: generatedId },
      data: {
        status: 'FAILED',
        image: blob.url,
      },
    });
  }
}
