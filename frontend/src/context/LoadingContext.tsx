import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [activeRequests, setActiveRequests] = useState(0);

  const startLoading = useCallback(() => {
    setActiveRequests((count) => count + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setActiveRequests((count) => Math.max(0, count - 1));
  }, []);

  return (
    <LoadingContext.Provider
      value={{ isLoading: activeRequests > 0, startLoading, stopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
