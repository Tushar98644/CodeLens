// constants.ts

import { LayoutDashboard, Settings, Bot, BarChart } from "lucide-react";

export const SIDEBAR_ITEMS = {
  "General": [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      route: "/dashboard",
    },
    {
      title: "Analytics",
      icon: BarChart,
      route: "/analytics",
    },
  ],
  "Tools": [
    {
      title: "Dependency Detective",
      icon: Bot,
      route: "/dependency-detective",
    },
    {
      title: "API Keys",
      icon: Settings,
      route: "/dashboard/configuration",
    },
  ],
};