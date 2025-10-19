'use client'

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

    const userData = user ? {
        name: user.name as string,
        email: user.email as string,
        avatar: user.image as string,
    } : undefined;

    return (
        <div className="h-full border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-white dark:bg-black">
            <div className="py-8 pb-4 px-4 flex items-center justify-center md:justify-start md:px-6 gap-3">
                <Icons.logo className="h-7 w-7 hover:animate-pulse" />
                <span className="font-semibold hidden md:inline">Code Lens</span>
            </div>

            <div className="flex flex-col gap-1 p-2 md:p-4">
                {SIDEBAR_ITEMS.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = item.route === pathname;
                    
                    return (
                        <Link
                            href={item.route}
                            key={index}
                            className={cn(
                                "w-full rounded-lg flex flex-row gap-3 items-center py-2.5 text-sm font-medium transition-colors duration-200",
                                "justify-center md:justify-start px-3 md:pl-4",
                                isActive
                                    ? "bg-blue-50 text-blue-600 dark:bg-select dark:text-[lab(68.2765%_26.5305_-86.0333)]"
                                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                            )}
                        >
                            <Icon size={19} />
                            <span className="hidden md:inline">{item.title}</span>
                        </Link>
                    )
                })}
            </div>

            <div className="mt-auto p-2">
                <ProfileDropdown data={userData}/>
            </div>
        </div>
    );
}

export default SideBar;