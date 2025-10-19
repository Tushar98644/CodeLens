'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { DashboardSkeleton } from '@/features/dashboard/skeleton';
import { RepositoryCard } from '@/features/dashboard/repo-card';
import { ConnectGitHubView } from '@/features/dashboard/connect-github';
import { useRepoQuery } from '@/hooks/queries/useRepoQuery';
import { authClient } from '@/lib/auth-client';

export default function GitHubIntegrationPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: repos, isPending, error } = useRepoQuery();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data: accountsList, error } = await authClient.listAccounts();
                if (accountsList) {
                    console.log('Accounts:', accountsList);
                    setAccounts(accountsList);
                }
                if (error) {
                    console.error('Failed to fetch accounts:', error);
                }
            } catch (error) {
                console.error('Failed to fetch accounts:', error);
            }
        }
        fetchAccounts();
    }, []);

    const isConnected = !!accounts.find(acc => acc.providerId === 'github');

    const connectGitHub = async () => {
        await authClient.linkSocial({
            provider: "github",
            callbackURL: '/dashboard'
        })
    };

    const filteredRepos = repos?.filter((repo: any) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isPending) {
        return <DashboardSkeleton />;
    }

    if (!isConnected) {
        return <ConnectGitHubView onConnect={connectGitHub} />;
    }

    return (
        <div className="h-full w-full bg-black text-white p-4 md:p-8 flex flex-col">
            {/* --- Header --- */}
            <header className="flex-shrink-0 pb-6 border-b border-zinc-800/60">
                <h1 className="text-xl font-medium text-neutral-100">GitHub Repositories</h1>
                <p className="text-neutral-400 mt-1 text-sm">
                    View and manage repositories connected to your GitHub account.
                </p>
            </header>

            {/* --- Toolbar with Search --- */}
            <div className="flex-shrink-0 py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                        placeholder="Filter repositories..."
                        className="pl-9 h-10 bg-zinc-900 border-zinc-700 text-neutral-100 placeholder:text-neutral-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* --- Repository Grid --- */}
            <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {filteredRepos?.map((repo: any) => (
                    <RepositoryCard key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    );
}
