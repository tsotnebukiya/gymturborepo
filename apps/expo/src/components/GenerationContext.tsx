import { createContext, useContext } from 'react';
import { type RouterOutputs } from '~/utils/api';

interface GenerationContextType {
  generationData: NonNullable<RouterOutputs['generation']['getOne']>;
}

export const GenerationContext = createContext<GenerationContextType | null>(
  null
);

export const useGenerationContext = () => {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error(
      'useGenerationContext must be used within GenerationProvider'
    );
  }
  return context;
};
