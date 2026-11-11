import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  apiFetch,
  type ExpleeStatus,
  type HealthProbe,
} from "@/lib/api";
import { formatBalance } from "@/lib/utils";

type StatusContextValue = {
  health: HealthProbe | null;
  status: ExpleeStatus | null;
  loading: boolean;
  error: string | null;
  balanceLabel: string | null;
  refresh: () => Promise<void>;
};

const StatusContext = createContext<StatusContextValue | null>(null);

export function StatusProvider({ children }: { children: ReactNode }) {
  const [health, setHealth] = useState<HealthProbe | null>(null);
  const [status, setStatus] = useState<ExpleeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [healthRes, statusRes] = await Promise.all([
        apiFetch<HealthProbe>("/api/health"),
        apiFetch<ExpleeStatus>("/api/explee/status"),
      ]);
      setHealth(healthRes);
      setStatus(statusRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 60_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const balanceLabel = useMemo(() => {
    const balance = status?.balance;
    if (!balance) return null;
    return (
      formatBalance(balance.balance) ??
      formatBalance(balance.credits) ??
      formatBalance(balance.available)
    );
  }, [status]);

  const value = useMemo(
    () => ({
      health,
      status,
      loading,
      error,
      balanceLabel,
      refresh,
    }),
    [health, status, loading, error, balanceLabel, refresh],
  );

  return (
    <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
  );
}

export function useStatus() {
  const ctx = useContext(StatusContext);
  if (!ctx) throw new Error("useStatus must be used within StatusProvider");
  return ctx;
}
