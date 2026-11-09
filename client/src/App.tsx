import { motion } from "motion/react";
import { BalanceChip } from "@/components/BalanceChip";
import { ConnectGuide } from "@/components/ConnectGuide";
import { SharedContextForm } from "@/components/SharedContextForm";
import { AutoGtmSection } from "@/components/sections/AutoGtmSection";
import { EnrichSection } from "@/components/sections/EnrichSection";
import { FindEnrichSection } from "@/components/sections/FindEnrichSection";
import { SearchSection } from "@/components/sections/SearchSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { SharedInputsProvider } from "@/context/SharedInputsContext";

export default function App() {
  return (
    <SharedInputsProvider>
      <div className="relative mx-auto flex min-h-svh max-w-5xl flex-col px-5 py-10 md:px-8 md:py-14">
        <header className="mb-10 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <p className="font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl">
                Explee
              </p>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                Integration console for MCP connect and the main REST search,
                enrich, find & enrich, and AutoGTM flows — API key stays on the
                server.
              </p>
            </motion.div>
            <BalanceChip />
          </div>
        </header>

        <main className="space-y-12 pb-16">
          <ConnectGuide />
          <Separator />
          <SharedContextForm />
          <Separator />

          <section className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
                APIs
              </p>
              <h2 className="mt-1 font-display text-2xl font-medium tracking-tight">
                Capability panels
              </h2>
            </div>

            <Accordion
              type="multiple"
              defaultValue={["search"]}
              className="rounded-xl border border-border/70 bg-card/30 px-4 backdrop-blur-sm"
            >
              <AccordionItem value="search">
                <AccordionTrigger className="font-display text-base">
                  Search
                </AccordionTrigger>
                <AccordionContent>
                  <SearchSection />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="enrich">
                <AccordionTrigger className="font-display text-base">
                  Enrich
                </AccordionTrigger>
                <AccordionContent>
                  <EnrichSection />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="find-enrich">
                <AccordionTrigger className="font-display text-base">
                  Find & Enrich
                </AccordionTrigger>
                <AccordionContent>
                  <FindEnrichSection />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="autogtm">
                <AccordionTrigger className="font-display text-base">
                  AutoGTM
                </AccordionTrigger>
                <AccordionContent>
                  <AutoGtmSection />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </main>
      </div>
    </SharedInputsProvider>
  );
}
