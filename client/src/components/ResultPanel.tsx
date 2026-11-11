import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, LoaderCircle, AlertTriangle } from "lucide-react";
import type { ActionState } from "@/hooks/useApiAction";
import { Badge } from "@/components/ui/badge";

export function ResultPanel({ state }: { state: ActionState }) {
  const hasContent =
    state.loading ||
    state.polling ||
    state.error ||
    state.data !== null ||
    state.success;

  return (
    <AnimatePresence mode="wait">
      {hasContent ? (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="overflow-hidden rounded-lg border border-border/80 bg-card/50"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {state.loading || state.polling ? (
                <LoaderCircle className="size-3.5 animate-spin text-primary" />
              ) : state.error ? (
                <AlertTriangle className="size-3.5 text-amber-300" />
              ) : (
                <CheckCircle2 className="size-3.5 text-primary" />
              )}
              <span>
                {state.loading
                  ? "Running…"
                  : state.polling
                    ? `Polling task ${state.taskId ?? ""}…`
                    : state.error
                      ? "Error"
                      : "Result"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {state.code ? <Badge variant="warn">{state.code}</Badge> : null}
              {state.taskId && !state.error ? (
                <Badge variant="secondary">task {state.taskId}</Badge>
              ) : null}
            </div>
          </div>
          <pre className="max-h-96 overflow-auto p-3 font-mono text-[12px] leading-relaxed text-foreground/90">
            {state.error
              ? JSON.stringify(
                  {
                    error: state.error,
                    code: state.code,
                    status: state.status,
                    details: state.data,
                  },
                  null,
                  2,
                )
              : JSON.stringify(state.data, null, 2)}
          </pre>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
