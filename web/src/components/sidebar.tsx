'use client'

import { SIDEBAR_ITEMS } from "@/constants";
import { Icons } from "@/features/global/icons";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
    const pathname = usePathname();
    return (
        <div className="h-full border-r-1 border-r-neutral-800 p-4 flex flex-col">
            <div id="sidebar-icon" className="py-4 pb-8 px-2 flex flex-row gap-3">
                <Icons.logo className="h-7 w-7 hover:animate-pulse" />
                <span className="font-semibold">Code Lens</span>
            </div>
            <div id="sidebar-items" className="flex flex-col gap-1">
                {
                    SIDEBAR_ITEMS.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = item.route === pathname;
                        
                        return (
                            <Link className={`w-full pl-4 rounded-lg flex flex-row gap-3 items-center py-[8.5px] text-[14px] hover:bg-zinc-900 ${isActive ? "bg-zinc-800 text-white" : "text-neutral-400"}`} href={item.route} key={index}>
                                <Icon size={19} />
                                <span id="items-title">{item.title}</span>
                            </Link>
                        )
                    })
                }
            </div>
            <div id="user-button" className="flex mt-auto">
                <UserButton />
            </div>
        </div>
    );
}

export default SideBar;