import { Button } from "@/components/ui/button";
import { GitFork, Github, GitPullRequestArrow } from "lucide-react";
import Image from "next/image";

export const RepositoryCard = ({ repo }: any) => {
    return (
        <div className="flex h-max flex-col rounded-xl bg-black p-4 border border-zinc-800/80 transition-all duration-300 hover:border-zinc-700">
            <div className="flex-1">
                <p className="text-sm text-neutral-400 mb-1">Repository</p>
                <h3 className="text-md font-semibold text-neutral-100">{repo.title}</h3>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-neutral-400 text-sm">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Github className="h-4 w-4" />{repo.issueNumber}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <GitFork className="h-4 w-4" />{repo.branch}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-neutral-200 border-zinc-700 text-xs">
                        <GitPullRequestArrow className="h-4 w-4 mr-2" />
                        Open
                    </Button>
                    <Image src={repo.avatar} alt="User Avatar" width={28} height={28} className="rounded-full" />
                </div>
            </div>
        </div>
    );
};
