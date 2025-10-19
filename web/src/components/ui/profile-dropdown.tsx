"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Settings, FileText, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
    name: string;
    email: string;
    avatar: string;
}

interface MenuItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    data?: Profile;
}

export default function ProfileDropdown({ data, className }: ProfileDropdownProps) {
    const menuItems: MenuItem[] = [
        {
            label: "Settings",
            href: "#",
            icon: <Settings className="w-4 h-4" />,
        },
        {
            label: "Terms & Policies",
            href: "#",
            icon: <FileText className="w-4 h-4" />,
        },
    ];

    // Render a skeleton loader while user data is being fetched
    if (!data) {
        return (
            <div className="flex items-center gap-3 p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="hidden md:flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative w-full", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-lg text-left",
                            "transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 focus:outline-none"
                        )}
                    >
                        {/* Avatar (always visible) */}
                        <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900">
                                    <Image
                                        src={data.avatar}
                                        alt={data.name}
                                        width={36}
                                        height={36}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* User Info (hidden on small screens) */}
                        <div className="hidden md:flex flex-col flex-1 truncate">
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                {data.name}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                {data.email}
                            </div>
                        </div>
                    </button>
                </DropdownMenuTrigger>
                
                {/* Dropdown content width matches the trigger button's width */}
                <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="w-[var(--radix-dropdown-menu-trigger-width)] p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/20 
                    data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                >
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <DropdownMenuItem key={item.label} asChild>
                                <Link
                                    href={item.href}
                                    className="flex items-center p-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        {item.icon}
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                                            {item.label}
                                        </span>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </div>

                    <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

                    <DropdownMenuItem asChild>
                        <button
                            type="button"
                            className="w-full flex items-center gap-3 p-3 duration-200 bg-red-500/10 rounded-xl hover:bg-red-500/20 cursor-pointer border border-transparent hover:border-red-500/30 hover:shadow-sm transition-all group"
                        >
                            <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                            <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                                Sign Out
                            </span>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}