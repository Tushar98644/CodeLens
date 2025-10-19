'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component
import { cn } from "@/lib/utils";
import { Plus, Copy, MoreHorizontal, Check } from "lucide-react";

const MOCK_API_KEYS = [
    { id: 1, key: 'gn_...VAQ', name: 'Primary Gemini Key', createdOn: new Date().toISOString(), tier: 'Free tier' },
    { id: 2, key: 'gn_...KKA', name: 'Testing Key', createdOn: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), tier: 'Free tier' },
    { id: 3, key: 'gn_...ioa4', name: 'Analytics Key', createdOn: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), tier: 'Free tier' },
    { id: 4, key: 'gn_...WYIU', name: 'Old Project Key', createdOn: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(), tier: 'Free tier' },
];

function ApiKeysContent() {
    const [apiKeys, setApiKeys] = useState(MOCK_API_KEYS);
    const [filteredKeys, setFilteredKeys] = useState(MOCK_API_KEYS);
    const [isLoading, setIsLoading] = useState(true);
    const [groupBy, setGroupBy] = useState<'date' | 'name'>('date');
    const [filterBy, setFilterBy] = useState('all');
    const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null);

    useEffect(() => {
        let keys = [...apiKeys];

        if (filterBy !== 'all') {
            const now = new Date();
            const filterDate = new Date();
            filterDate.setDate(now.getDate() - parseInt(filterBy));
            keys = keys.filter(key => new Date(key.createdOn) >= filterDate);
        }

        if (groupBy === 'date') {
            keys.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
        } else if (groupBy === 'name') {
            keys.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredKeys(keys);
    }, [apiKeys, groupBy, filterBy]);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 750);
    }, []);

    const handleCopy = (key: string) => {
        navigator.clipboard.writeText(key);
        const keyId = MOCK_API_KEYS.find(k => k.key === key)?.id || null;
        setCopiedKeyId(keyId);
        setTimeout(() => setCopiedKeyId(null), 2000);
    };

    return (
        <div className="h-full w-full bg-black text-white p-4 md:p-8 flex flex-col">
            {/* --- Header Section --- */}
            <header className="flex items-center justify-between pb-6">
                <h1 className="text-3xl font-medium text-neutral-100">API Keys</h1>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    <Plus className="h-4 w-4 mr-2" />
                    Create API key
                </Button>
            </header>

            {/* --- Toolbar --- */}
            <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">Group by</span>
                    <Button variant="ghost" size="sm" onClick={() => setGroupBy('date')} className={cn(groupBy === 'date' && "bg-zinc-800 text-white")}>Date</Button>
                    <Button variant="ghost" size="sm" onClick={() => setGroupBy('name')} className={cn(groupBy === 'name' && "bg-zinc-800 text-white")}>Name</Button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">Filter by</span>
                    <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All time</SelectItem>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* --- API Keys Table --- */}
            <div className="flex-1 border border-zinc-800 rounded-lg overflow-y-scroll">
                <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-zinc-800 text-sm font-medium text-neutral-400">
                    <div className="col-span-2">Key</div>
                    <div className="col-span-1">Created on</div>
                    <div className="col-span-1">Tier</div>
                    <div className="col-span-1"></div>
                </div>
                <div className="divide-y divide-zinc-800">
                    {isLoading ? (
                        Array.from({ length: MOCK_API_KEYS.length }).map((_, i) => (
                            <div key={i} className="grid grid-cols-5 gap-4 px-6 py-4 items-center">
                                <div className="col-span-2 space-y-2"><Skeleton className="h-4 w-3/4 bg-zinc-800" /><Skeleton className="h-3 w-1/2 bg-zinc-800" /></div>
                                <div className="col-span-1"><Skeleton className="h-4 w-3/4 bg-zinc-800" /></div>
                                <div className="col-span-1 space-y-2"><Skeleton className="h-4 w-1/2 bg-zinc-800" /><Skeleton className="h-3 w-1/3 bg-zinc-800" /></div>
                            </div>
                        ))
                    ) : (
                        filteredKeys.map((key) => (
                            <div key={key.id} className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-zinc-900/50 transition-colors duration-200">
                                <div className="col-span-2">
                                    <p className="font-mono text-sm text-neutral-100">{key.key}</p>
                                    <p className="text-xs text-neutral-400">
                                        {key.name}
                                    </p>
                                </div>
                                <p className="col-span-1 text-sm text-neutral-300">{new Date(key.createdOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                <div className="col-span-1">
                                    <a href="#" className="text-sm text-blue-400 hover:underline">{key.tier}</a>
                                </div>
                                <div className="col-span-1 flex items-center justify-end gap-2 text-neutral-400">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400" onClick={() => handleCopy(key.key)}>
                                        {copiedKeyId === key.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400"><MoreHorizontal className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ApiKeysContent;