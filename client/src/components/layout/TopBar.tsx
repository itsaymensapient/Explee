import { Menu, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStatus } from "@/context/StatusContext";
import { cn } from "@/lib/utils";

export function TopBar({ onOpenNav }: { onOpenNav?: () => void }) {
  const { health, status, loading, error, balanceLabel, refresh } = useStatus();
  const keyConfigured = Boolean(
    status?.keyConfigured ?? health?.keyConfigured,
  );

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onOpenNav}
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </Button>
        <div className="hidden sm:block">
          <p className="text-xs font-medium tracking-wide text-gold">Control</p>
          <p className="text-sm font-medium">Explee operations</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {error ? (
          <Badge variant="warn">Status unavailable</Badge>
        ) : loading && !health ? (
          <Badge variant="secondary">Checking…</Badge>
        ) : (
          <>
            <Badge
              variant={keyConfigured ? "default" : "warn"}
              className={cn(!keyConfigured && "border-amber-500/30")}
            >
              {keyConfigured ? "Key configured" : "Key missing"}
            </Badge>
            {keyConfigured && balanceLabel ? (
              <Badge variant="secondary">Balance {balanceLabel}</Badge>
            ) : null}
            {health?.ok ? (
              <Badge variant="outline">API healthy</Badge>
            ) : (
              <Badge variant="warn">API down</Badge>
            )}
          </>
        )}
        <Button
          variant="outline"
          size="default"
          onClick={() => void refresh()}
          disabled={loading}
          className="gap-1.5"
        >
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>
    </header>
  );
}
