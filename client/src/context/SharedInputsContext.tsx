import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { splitLines } from "@/lib/utils";

export type SharedInputs = {
  definition: string;
  jobTitles: string;
  domains: string;
  geography: string;
  projectId: string;
  campaignId: string;
  criteria: string;
  enrichPreset: string;
};

type SharedInputsContextValue = {
  inputs: SharedInputs;
  setInputs: Dispatch<SetStateAction<SharedInputs>>;
  update: <K extends keyof SharedInputs>(key: K, value: SharedInputs[K]) => void;
  domainList: string[];
  titleList: string[];
  geoList: string[];
  criteriaList: string[];
  firstDomain: string;
};

export const defaultInputs: SharedInputs = {
  definition: "B2B SaaS company",
  jobTitles: "Head of Sales\nVP Sales",
  domains: "stripe.com\nnotion.so",
  geography: "US\nGB",
  projectId: "",
  campaignId: "",
  criteria: "Has enterprise customers",
  enrichPreset: "basic",
};

const SharedInputsContext = createContext<SharedInputsContextValue | null>(null);

export function SharedInputsProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<SharedInputs>(defaultInputs);

  const value = useMemo<SharedInputsContextValue>(() => {
    const domainList = splitLines(inputs.domains);
    const titleList = splitLines(inputs.jobTitles);
    const geoList = splitLines(inputs.geography);
    const criteriaList = splitLines(inputs.criteria);
    return {
      inputs,
      setInputs,
      update: (key, next) =>
        setInputs((prev) => ({
          ...prev,
          [key]: next,
        })),
      domainList,
      titleList,
      geoList,
      criteriaList,
      firstDomain: domainList[0] ?? "",
    };
  }, [inputs]);

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
