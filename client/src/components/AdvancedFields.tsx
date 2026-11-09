import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function AdvancedFields({
  children,
  title = "Optional advanced",
}: {
  children: ReactNode;
  title?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-3">
      <CollapsibleTrigger className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ChevronRight
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-90",
          )}
        />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-3 data-[state=open]:animate-in">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
