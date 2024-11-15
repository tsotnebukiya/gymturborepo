import { createContext, type ReactNode, useContext, useState } from 'react';
import { type Subcategory } from '@prisma/client';

interface AppContextType {
  wizardVisible: boolean;
  setWizardVisible: (visible: boolean) => void;
  subcategory: Subcategory | undefined;
  setSubcategory: (subcategory: Subcategory | undefined) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [subcategory, setSubcategory] = useState<Subcategory | undefined>(
    undefined
  );
  const [wizardVisible, setWizardVisible] = useState(false);
  return (
    <AppContext.Provider
      value={{
        subcategory,
        setSubcategory,
        wizardVisible,
        setWizardVisible,
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
