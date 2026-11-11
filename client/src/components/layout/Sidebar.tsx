import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { navItems } from "@/components/layout/nav";
import { cn } from "@/lib/utils";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full flex-col border-r border-border/70 bg-card/40 backdrop-blur-md">
      <div className="border-b border-border/60 px-5 py-5">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="font-display text-2xl font-medium tracking-tight">
            Explee
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            API control dashboard
          </p>
        </motion.div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * index, duration: 0.28 }}
            >
              <NavLink
                to={item.to}
                end={item.to === "/"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
                    isActive
                      ? "bg-primary/12 text-foreground"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground group-hover:text-muted-foreground/90">
                        {item.description}
                      </span>
                    </span>
                  </>
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      <div className="border-t border-border/60 px-4 py-4 text-[11px] text-muted-foreground">
        Key stays on Express · browser uses <code>/api/*</code>
      </div>
    </aside>
  );
}
