import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import { type Subcategory } from '@prisma/client';
import { type GenerationData } from '../../components/exercises/Item';

interface AppContextType {
  wizardVisible: boolean;
  setWizardVisible: (visible: boolean) => void;

  // Saved Exercises Context
  subcategory: Subcategory | undefined;
  setSubcategory: (subcategory: Subcategory | undefined) => void;

  // Split New Context
  splitSubcategory: Subcategory | undefined;
  setSplitSubcategory: (subcategory: Subcategory | undefined) => void;
  splitExercises: GenerationData[];
  setSplitExercises: Dispatch<SetStateAction<GenerationData[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [subcategory, setSubcategory] = useState<Subcategory | undefined>(
    undefined
  );
  const [splitSubcategory, setSplitSubcategory] = useState<
    Subcategory | undefined
  >(undefined);
  const [splitExercises, setSplitExercises] = useState<GenerationData[]>([]);
  const [wizardVisible, setWizardVisible] = useState(false);
  return (
    <AppContext.Provider
      value={{
        splitSubcategory,
        setSplitSubcategory,
        subcategory,
        setSubcategory,
        wizardVisible,
        setWizardVisible,
        splitExercises,
        setSplitExercises,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
}
