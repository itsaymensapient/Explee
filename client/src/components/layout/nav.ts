import {
  Bot,
  Compass,
  Inbox,
  Layers3,
  Search,
  Settings2,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    to: "/",
    label: "Overview",
    description: "Status, shared context, quick actions",
    icon: Compass,
  },
  {
    to: "/search",
    label: "Search",
    description: "Companies, people, NL filters, domains",
    icon: Search,
  },
  {
    to: "/enrich",
    label: "Enrich",
    description: "Email, phone, batch + poll",
    icon: Sparkles,
  },
  {
    to: "/find-enrich",
    label: "Find & Enrich",
    description: "Async people search with email enrich",
    icon: Users,
  },
  {
    to: "/autogtm",
    label: "AutoGTM",
    description: "Projects, campaigns, leads, inbox",
    icon: Layers3,
  },
  {
    to: "/agents",
    label: "AI Agents",
    description: "OpenAI / ChatGPT MCP + OpenAPI",
    icon: Bot,
  },
  {
    to: "/settings",
    label: "Settings",
    description: "MCP + REST connect guide",
    icon: Settings2,
  },
];

export const inboxHintIcon = Inbox;
