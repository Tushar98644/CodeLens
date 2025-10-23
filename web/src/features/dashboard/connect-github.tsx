import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export const ConnectGitHubView = ({ onConnect }: { onConnect: () => void }) => (
  <div className="flex h-full w-full items-center justify-center bg-black p-4">
    <div className="w-full max-w-md text-center bg-zinc-950/50 border border-zinc-800/80 rounded-lg p-8 shadow-2xl shadow-black">
      <Github className="mx-auto h-12 w-12 text-neutral-400" />
      <h2 className="mt-6 text-lg font-semibold text-white">
        Connect your GitHub account
      </h2>
      <p className="mt-2 text-sm text-neutral-400">
        To get started, connect your GitHub account. This will allow Code Lens
        to access and analyze your repositories.
      </p>
      <Button
        onClick={onConnect}
        className="mt-6 w-full font-semibold bg-white text-black hover:bg-neutral-200"
      >
        <Github className="h-4 w-4 mr-2" />
        Connect with GitHub
      </Button>
    </div>
  </div>
);
