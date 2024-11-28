import { createContext, type ReactNode, useContext, useState } from 'react';
import { type Exercise } from '@prisma/client';

interface CategoryContextType {
  exercises: Exercise[];
  isGenerating: boolean;
  setExercises: (exercises: Exercise[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <CategoryContext.Provider
      value={{
        exercises,
        isGenerating,
        setExercises,
        setIsGenerating,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error(
      'useCategoryContext must be used within a CategoryProvider'
    );
  }
  return context;
}
