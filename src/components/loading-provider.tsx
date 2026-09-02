"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { GlobalLoader } from "@/components/global-loader";

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  showLoader: (text?: string) => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  loadingText: "Processing...",
  showLoader: () => {},
  hideLoader: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Processing...");

  const showLoader = useCallback((text = "Processing...") => {
    setLoadingText(text);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      loadingText,
      showLoader,
      hideLoader,
    }),
    [isLoading, loadingText, showLoader, hideLoader]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && <GlobalLoader fullScreen text={loadingText} />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
