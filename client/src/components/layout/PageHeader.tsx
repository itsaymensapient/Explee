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
      className="mb-8 flex flex-wrap items-end justify-between gap-5"
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-medium tracking-wide text-gold">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </motion.div>
  );
}
