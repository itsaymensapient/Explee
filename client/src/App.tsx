import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import { SharedInputsProvider } from "@/context/SharedInputsContext";
import { StatusProvider } from "@/context/StatusContext";
import { OverviewPage } from "@/pages/OverviewPage";
import { SearchPage } from "@/pages/SearchPage";
import { EnrichPage } from "@/pages/EnrichPage";
import { FindEnrichPage } from "@/pages/FindEnrichPage";
import { AutoGtmPage } from "@/pages/AutoGtmPage";
import { AgentsPage } from "@/pages/AgentsPage";
import { SettingsPage } from "@/pages/SettingsPage";

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <SharedInputsProvider>
        <StatusProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<OverviewPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="enrich" element={<EnrichPage />} />
                <Route path="find-enrich" element={<FindEnrichPage />} />
                <Route path="autogtm" element={<AutoGtmPage />} />
                <Route path="agents" element={<AgentsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast:
                  "border border-border bg-card text-foreground shadow-lg",
              },
            }}
          />
        </StatusProvider>
      </SharedInputsProvider>
    </TooltipProvider>
  );
}
