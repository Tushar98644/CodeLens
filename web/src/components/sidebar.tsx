'use client'

import { SIDEBAR_ITEMS } from "@/constants";
import { Icons } from "@/features/global/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./ui/profile-dropdown";
import { authClient } from "@/lib/auth-client";

const SideBar = () => {
    const pathname = usePathname();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const userData = {
        name: user?.name as string,
        email: user?.email as string,
        avatar: user?.image as string,
    }

    return (
        <div className="h-full border-r-1 border-r-neutral-800 flex flex-col">
            <div id="sidebar-icon" className="py-8 pb-4 px-6 flex flex-row gap-3">
                <Icons.logo className="h-7 w-7 hover:animate-pulse" />
                <span className="font-semibold">Code Lens</span>
            </div>
            <div id="sidebar-items" className="flex flex-col gap-1 p-4">
                {
                    SIDEBAR_ITEMS.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = item.route === pathname;
                        
                        return (
                            <Link className={`w-full pl-4 rounded-lg flex flex-row gap-3 items-center py-[8.5px] text-[14px] hover:bg-zinc-900 hover:text-white ${isActive ? "bg-select text-[lab(68.2765%_26.5305_-86.0333)]" : "text-neutral-400"}`} href={item.route} key={index}>
                                <Icon size={19} />
                                <span id="items-title">{item.title}</span>
                            </Link>
                        )
                    })
                }
            </div>
            <div id="user-button" className="flex mt-auto p-2">
                <ProfileDropdown data={userData}/>
            </div>
        </div>
    );
}

export default SideBar;