import { Button } from "@/components/ui/button";
import {
  GitFork,
  Star,
  Lock,
  Unlock,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  owner: {
    avatar_url: string;
    login: string;
  };
}

export const RepositoryCard = ({ repo }: { repo: Repo }) => {
  const router = useRouter();

  const handleAnalyze = () => {
    router.push(
      `/dashboard/analyze/${repo.owner.login}/${repo.name}/${repo.default_branch}`,
    );
  };

  return (
    <div
      className="
            relative flex h-full flex-col rounded-xl p-4 transition-all duration-300
            bg-white/5 backdrop-blur-lg
            border border-white/10
            hover:border-white/20 hover:bg-white/10
        "
    >
      <Link
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-200 transition-colors"
        aria-label="Open repository on GitHub"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>

      <div className="flex items-center gap-2 pr-8">
        <h3 className="text-md font-semibold text-neutral-100 truncate">
          {repo.name}
        </h3>
        {repo.private ? (
          <Lock className="h-3 w-3 text-neutral-500" />
        ) : (
          <Unlock className="h-3 w-3 text-neutral-500" />
        )}
      </div>

      <p className="text-sm text-neutral-400 mt-1 flex-1">
        {repo.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4 text-neutral-400 text-sm">
          {repo.language && (
            <span className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs">
            <Star className="h-4 w-4" />
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            <GitFork className="h-4 w-4" />
            {repo.forks_count}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleAnalyze}
            size="sm"
            className="cursor-pointer font-semibold text-xs bg-neutral-100 dark:bg-[#1C212D] text-neutral-900 dark:text-blue-400 border border-neutral-200 dark:border-blue-500/20"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analyze
          </Button>
          <Image
            src={repo.owner.avatar_url}
            alt="Owner Avatar"
            width={28}
            height={28}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
