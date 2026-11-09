import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { apiFetch, type HealthStatus } from "@/lib/api";

export function BalanceChip() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<HealthStatus>("/api/explee/status")
      .then((data) => {
        if (!cancelled) setStatus(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <Badge variant="warn">Status unavailable</Badge>;
  }

  if (!status) {
    return <Badge variant="secondary">Checking key…</Badge>;
  }

  if (!status.keyConfigured) {
    return <Badge variant="warn">API key not configured</Badge>;
  }

  const balance =
    status.balance && typeof status.balance === "object"
      ? (status.balance as { balance?: number | string; credits?: number | string })
      : null;
  const value = balance?.balance ?? balance?.credits;

  return (
    <Badge variant="default">
      Key configured
      {value !== undefined && value !== null ? ` · balance ${String(value)}` : ""}
    </Badge>
  );
}
