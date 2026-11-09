import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SharedInputs = {
  definition: string;
  jobTitles: string;
  domains: string;
  geography: string;
  projectId: string;
};

type SharedInputsContextValue = {
  inputs: SharedInputs;
  setInputs: React.Dispatch<React.SetStateAction<SharedInputs>>;
  update: <K extends keyof SharedInputs>(key: K, value: SharedInputs[K]) => void;
};

const defaultInputs: SharedInputs = {
  definition: "B2B SaaS company",
  jobTitles: "Head of Sales\nVP Sales",
  domains: "",
  geography: "US\nGB",
  projectId: "",
};

const SharedInputsContext = createContext<SharedInputsContextValue | null>(null);

export function SharedInputsProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<SharedInputs>(defaultInputs);

  const value = useMemo<SharedInputsContextValue>(
    () => ({
      inputs,
      setInputs,
      update: (key, value) =>
        setInputs((prev) => ({
          ...prev,
          [key]: value,
        })),
    }),
    [inputs],
  );

  return (
    <SharedInputsContext.Provider value={value}>
      {children}
    </SharedInputsContext.Provider>
  );
}

export function useSharedInputs() {
  const ctx = useContext(SharedInputsContext);
  if (!ctx) {
    throw new Error("useSharedInputs must be used within SharedInputsProvider");
  }
  return ctx;
}
