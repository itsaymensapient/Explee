import type { ReactNode } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import { RunButton } from "@/components/RunButton";
import { Badge } from "@/components/ui/badge";
import type { ActionState } from "@/hooks/useApiAction";

export function EndpointCard({
  title,
  method,
  path,
  description,
  uses,
  children,
  state,
  onRun,
  runLabel = "Run",
  disabled,
  extraActions,
}: {
  title: string;
  method: string;
  path: string;
  description: string;
  uses?: string[];
  children?: ReactNode;
  state: ActionState;
  onRun: () => void;
  runLabel?: string;
  disabled?: boolean;
  extraActions?: ReactNode;
}) {
  return (
    <article className="space-y-4 rounded-xl border border-border/60 bg-card/35 p-4 shadow-[inset_0_1px_0_oklch(1_0_0/0.04)]">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-medium tracking-tight">
            {title}
          </h3>
          <Badge variant="outline" className="font-mono text-[10px] uppercase">
            {method}
          </Badge>
          <code className="font-mono text-[11px] text-muted-foreground">
            {path}
          </code>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        {uses && uses.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {uses.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {children ? <div className="space-y-3">{children}</div> : null}

      <div className="flex flex-wrap items-center gap-2">
        <RunButton
          loading={state.loading}
          polling={state.polling}
          onClick={onRun}
          label={runLabel}
          disabled={disabled}
        />
        {extraActions}
      </div>
      <ResultPanel state={state} />
    </article>
  );
}
