"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface CVModalContextValue {
  openCV: () => void;
  closeCV: () => void;
}

const CVModalContext = createContext<CVModalContextValue | undefined>(
  undefined
);

export const useCVModal = (): CVModalContextValue => {
  const ctx = useContext(CVModalContext);
  if (!ctx) {
    throw new Error("useCVModal must be used within CVModalProvider");
  }
  return ctx;
};

export const CVModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);

  const openCV = useCallback(() => setOpen(true), []);
  const closeCV = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openCV, closeCV }), [openCV, closeCV]);

  return (
    <CVModalContext.Provider value={value}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 overflow-y-scroll">
          <div className="min-h-screen flex items-start justify-center py-6">
            <div className="relative w-[92vw] max-w-5xl h-[85vh]">
              <button
                onClick={closeCV}
                className="absolute cursor-pointer hover:bg-gray-500/50 hover:text-white duration-500 right-0 z-[60] bg-white text-black rounded-full px-3 py-1 font-bold"
                aria-label="Close CV modal"
              >
                ✕
              </button>
              <iframe
                src="https://drive.google.com/file/d/1OAOo1or-43SouLq4X8w46iinsyb2e7I6/preview"
                className="w-full h-full block rounded"
                title="CV"
              />
            </div>
          </div>
        </div>
      )}
    </CVModalContext.Provider>
  );
};
