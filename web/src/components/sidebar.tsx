"use client";

import { SIDEBAR_ITEMS } from "@/constants";
import { Icons } from "@/features/global/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./ui/profile-dropdown";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const SideBar = () => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const userData = user
    ? {
        name: user.name as string,
        email: user.email as string,
        avatar: user.image as string,
      }
    : undefined;

  const isActive = (item: any) => {
    if (item.route === "/dashboard/analyze") {
      return pathname.startsWith("/dashboard/analyze");
    }

    if (item.route === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === item.route;
  };

  return (
    <div className="h-full border-r border-zinc-800/60 flex flex-col bg-white dark:bg-black">
      {/* Header section */}
      <div className="h-20 flex-shrink-0 px-4 flex items-center justify-center md:justify-start md:px-6 gap-3">
        <Icons.logo className="h-7 w-7 text-blue-500 dark:text-blue-400 hover:animate-pulse" />
        <span className="text-lg font-semibold hidden md:inline text-neutral-800 dark:text-neutral-100">Code Lens</span>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-2 md:p-4">
        {Object.entries(SIDEBAR_ITEMS).map(([category, items]) => (
          <div key={category}>
            <h3 className="px-3 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 hidden md:block">
              {category}
            </h3>
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                if (item.route === "/dashboard/analyze") {
                  return (
                    <div
                      key={item.route}
                      className={cn(
                        "flex items-center gap-3 rounded-md text-sm font-medium transition-all duration-200 p-3 md:py-2 md:px-3",
                        "justify-center md:justify-start",
                        active
                          ? "bg-neutral-100 dark:bg-[#1C212D] text-neutral-900 dark:text-blue-400 border border-neutral-200 dark:border-blue-500/20"
                          : "text-neutral-500 hover:bg-neutral-100/50 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    className={cn(
                      "flex items-center gap-3 rounded-md text-sm font-medium transition-all duration-200 p-3 md:py-2 md:px-3",
                      "justify-center md:justify-start",
                      active
                        ? "bg-neutral-100 dark:bg-[#1C212D] text-neutral-900 dark:text-blue-400 border border-neutral-200 dark:border-blue-500/20"
                        : "text-neutral-500 hover:bg-neutral-100/50 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile section */}
      <div className="mt-auto py-4 px-2">
        <ProfileDropdown data={userData} />
      </div>
    </div>
  );
};

export default SideBar;
