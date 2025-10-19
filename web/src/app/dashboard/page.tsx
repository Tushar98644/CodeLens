'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { DashboardSkeleton } from '@/features/dashboard/skeleton';
import { RepositoryCard } from '@/features/dashboard/repo-card';
import { ConnectGitHubView } from '@/features/dashboard/connect-github';

const MOCK_REPOS = [
    { id: 1, title: 'Code Lens Pro', issueNumber: '#55', branch: 'main', avatar: 'https://avatars.githubusercontent.com/u/9919?s=40&v=4' },
    { id: 2, title: 'Design System V2', issueNumber: '#102', branch: 'main', avatar: 'https://avatars.githubusercontent.com/u/1024025?s=40&v=4' },
    { id: 3, title: 'API Service Refactor', issueNumber: '#89', branch: 'feat/new-auth', avatar: 'https://avatars.githubusercontent.com/u/9919?s=40&v=4' },
    { id: 4, title: 'Documentation Site', issueNumber: '#21', branch: 'docs-update', avatar: 'https://avatars.githubusercontent.com/u/1024025?s=40&v=4' },
    { id: 5, title: 'Mobile App POC', issueNumber: '#12', branch: 'main', avatar: 'https://avatars.githubusercontent.com/u/9919?s=40&v=4' },
    { id: 6, title: 'E2E Testing Suite', issueNumber: '#76', branch: 'ci/playwright', avatar: 'https://avatars.githubusercontent.com/u/1024025?s=40&v=4' },
];

export default function GitHubIntegrationPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAccounts([{ providerId: 'github', accountId: 'user-123' }]);
            setIsLoading(false);
        };
        fetchAccounts();
    }, []);

    const isConnected = !!accounts.find(acc => acc.providerId === 'github');

    const connectGitHub = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAccounts([{ providerId: 'github', accountId: 'user-123' }]);
        setIsLoading(false);
    };

    const filteredRepos = MOCK_REPOS.filter(repo =>
        repo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
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
                {filteredRepos.map(repo => (
                    <RepositoryCard key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    );
}
