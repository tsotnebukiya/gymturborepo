-- DropForeignKey
ALTER TABLE "GenerationTranslation" DROP CONSTRAINT "GenerationTranslation_generationId_fkey";

-- AddForeignKey
ALTER TABLE "GenerationTranslation" ADD CONSTRAINT "GenerationTranslation_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
