import { Button } from "@/components/ui/button";
import { MessageSquare, Menu } from "lucide-react";

type PageHeaderProps = {
  repo: string;
  isLoading: boolean;
  showChat: boolean;
  onToggleChat: () => void;
  onToggleSidebar: () => void;
};

export function PageHeader({ repo, isLoading, showChat, onToggleChat, onToggleSidebar }: PageHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{repo}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant={showChat ? "default" : "outline"} size="sm" onClick={onToggleChat} disabled={isLoading}>
          <MessageSquare className="h-4 w-4 mr-2" />
          AI Assistant
        </Button>
      </div>
    </header>
  );
}
