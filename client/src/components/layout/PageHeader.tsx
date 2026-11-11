import type { ReactNode } from "react";
import { motion } from "motion/react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mb-8 flex flex-wrap items-end justify-between gap-4"
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.18em] text-primary/85">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions}
    </motion.div>
  );
}
