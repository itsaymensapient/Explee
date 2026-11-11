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
  howto,
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
  howto?: string[];
  uses?: string[];
  children?: ReactNode;
  state: ActionState;
  onRun: () => void;
  runLabel?: string;
  disabled?: boolean;
  extraActions?: ReactNode;
}) {
  return (
    <article className="space-y-5 rounded-lg border border-border/70 bg-card/40 p-5 md:p-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold tracking-tight">
            {title}
          </h3>
          <Badge variant="outline" className="font-mono text-[10px] uppercase">
            {method}
          </Badge>
          <code className="font-mono text-[11px] text-muted-foreground">
            {path}
          </code>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {uses && uses.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {uses.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        ) : null}
      </header>

      {howto && howto.length > 0 ? (
        <div className="rounded-md border border-gold/20 bg-background/35 px-4 py-3">
          <p className="text-xs font-medium text-gold">Before you run</p>
          <ol className="mt-2 space-y-1.5">
            {howto.map((item, index) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-snug text-muted-foreground"
              >
                <span className="font-mono text-[11px] text-gold/90">
                  {index + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {children ? (
        <div className="space-y-3 border-t border-border/50 pt-4">
          <p className="text-xs font-medium tracking-wide text-gold/90">
            Inputs
          </p>
          <div className="space-y-3">{children}</div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-border/50 pt-4">
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
