import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export const ConnectGitHubView = ({ onConnect }: { onConnect: () => void }) => (
  <div className="flex h-full w-full items-center justify-center bg-black p-4">
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-950/60 backdrop-blur-2xl border border-white/8 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-8 text-center">
      
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-900/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-900/50 rounded-full blur-3xl" />
      
      <div className="relative">
        <Github className="mx-auto h-12 w-12 text-blue-400" />
        <h2 className="mt-6 text-xl font-semibold text-white/95">
          Connect your GitHub account
        </h2>
        <p className="mt-2 text-sm text-white/50">
          This will allow Code Lens to access and analyze your repositories.
        </p>
        <Button
          onClick={onConnect}
          className="mt-8 w-full font-semibold bg-white text-black hover:bg-neutral-200 transition-colors"
        >
          <Github className="h-4 w-4 mr-2" />
          Connect with GitHub
        </Button>
      </div>
    </div>
  </div>
);