import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-wide text-gold">
          {label}
        </p>
        <p className="mt-1 break-all font-mono text-[12px] text-foreground/90">
          {value}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => void copy()}
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <Check className="size-4 text-primary" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </div>
  );
}
