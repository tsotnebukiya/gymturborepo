-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('INACTIVE', 'ACTIVE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CORE', 'BACK', 'ARMS', 'CHEST', 'SHOULDERS', 'LEGS');

-- CreateEnum
CREATE TYPE "Subcategory" AS ENUM ('UPPER_ABS', 'LOWER_ABS', 'SIDE_ABS', 'ABDOMINALS', 'UPPER_BACK', 'MIDDLE_BACK', 'LOWER_BACK', 'BICEPS', 'TRICEPS', 'WRIST_EXTENSORS', 'WRIST_FLEXORS', 'CHEST', 'REAR_SHOULDER', 'FRONT_SHOULDER', 'SIDE_SHOULDER', 'QUADRICEPS', 'HAMSTRINGS', 'CALVES', 'GLUTES', 'INNER_THIGHS', 'OUTER_THIGHS');

-- CreateEnum
CREATE TYPE "SplitWeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'SPANISH', 'FRENCH', 'GERMAN', 'CHINESE', 'RUSSIAN', 'ITALIAN', 'PORTUGUESE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "MusclePercentage" (
    "id" SERIAL NOT NULL,
    "category" "Category" NOT NULL,
    "subcategory" "Subcategory" NOT NULL,
    "percentage" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "MusclePercentage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseTranslation" (
    "id" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'ENGLISH',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "videoId" TEXT NOT NULL,
    "videoStart" INTEGER NOT NULL,
    "videoEnd" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "subcategory" "Subcategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedExercise" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitExercise" (
    "id" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "splitDayId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationTranslation" (
    "id" SERIAL NOT NULL,
    "generationId" INTEGER NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'ENGLISH',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenerationTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Generation" (
    "id" SERIAL NOT NULL,
    "status" "GenerationStatus" NOT NULL DEFAULT 'PENDING',
    "image" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitDay" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "day" "SplitWeekDay" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SplitDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExerciseToGeneration" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseTranslation_exerciseId_language_key" ON "ExerciseTranslation"("exerciseId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "SavedExercise_userId_exerciseId_key" ON "SavedExercise"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "GenerationTranslation_generationId_language_key" ON "GenerationTranslation"("generationId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToGeneration_AB_unique" ON "_ExerciseToGeneration"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToGeneration_B_index" ON "_ExerciseToGeneration"("B");

-- AddForeignKey
ALTER TABLE "MusclePercentage" ADD CONSTRAINT "MusclePercentage_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseTranslation" ADD CONSTRAINT "ExerciseTranslation_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedExercise" ADD CONSTRAINT "SavedExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedExercise" ADD CONSTRAINT "SavedExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitExercise" ADD CONSTRAINT "SplitExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitExercise" ADD CONSTRAINT "SplitExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitExercise" ADD CONSTRAINT "SplitExercise_splitDayId_fkey" FOREIGN KEY ("splitDayId") REFERENCES "SplitDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationTranslation" ADD CONSTRAINT "GenerationTranslation_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitDay" ADD CONSTRAINT "SplitDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToGeneration" ADD CONSTRAINT "_ExerciseToGeneration_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToGeneration" ADD CONSTRAINT "_ExerciseToGeneration_B_fkey" FOREIGN KEY ("B") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
