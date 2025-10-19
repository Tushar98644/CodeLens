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

    if (!data) {
        return (
            <div className="flex items-center gap-3 p-2">
                <Skeleton className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-zinc-800" />
                <div className="hidden md:flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-24 bg-neutral-200 dark:bg-zinc-800" />
                    <Skeleton className="h-3 w-32 bg-neutral-200 dark:bg-zinc-800" />
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
                            "transition-all duration-200 focus:outline-none",
                            "hover:bg-neutral-100/50 dark:hover:bg-white/5"
                        )}
                    >
                        {/* Avatar */}
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

                        {/* User Info */}
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
                
                <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="
                        w-[var(--radix-dropdown-menu-trigger-width)] p-2 rounded-2xl shadow-xl
                        bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg 
                        border border-white/40 dark:border-zinc-800/60
                        data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
                        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 
                        data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
                    "
                >
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <DropdownMenuItem key={item.label} asChild>
                                <Link
                                    href={item.href}
                                    className="flex items-center p-3 rounded-xl transition-colors duration-200 cursor-pointer group text-neutral-800 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-white/5 dark:hover:text-white"
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        {item.icon}
                                        <span className="text-sm font-medium">
                                            {item.label}
                                        </span>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-white/20 dark:bg-zinc-700/60" />

                    <DropdownMenuItem asChild>
                        <button
                            type="button"
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 cursor-pointer group text-red-500 hover:bg-red-500/60 hover:border dark:hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Sign Out
                            </span>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}