import { motion } from "motion/react";
import { LoaderCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RunButton({
  loading,
  polling,
  onClick,
  label = "Run",
  disabled,
}: {
  loading?: boolean;
  polling?: boolean;
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}) {
  const busy = Boolean(loading || polling);

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className="relative min-w-28 overflow-hidden"
    >
      <motion.span
        className="inline-flex items-center gap-2"
        animate={busy ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
        transition={
          busy
            ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 }
        }
      >
        {busy ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Play className="size-4" />
        )}
        {polling ? "Polling" : loading ? "Running" : label}
      </motion.span>
    </Button>
  );
}
