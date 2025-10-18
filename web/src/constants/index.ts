import { Edit, KeyRound, Puzzle, Settings } from "lucide-react";

export const SIDEBAR_ITEMS = [
    {
        title: "Editor",
        icon: Edit,
        route: "/dashboard/editor"
    },
    {
        title: "Api Keys",
        icon: KeyRound,
        route: "/dashboard/configuration"
    },
    {
        title: "Settings",
        icon: Settings,
        route: "/settings"
    },
]