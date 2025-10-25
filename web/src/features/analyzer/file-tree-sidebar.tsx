import { TreeProvider, TreeView } from "@/components/ui/file-tree";
import { cn } from "@/lib/utils";
import { RenderTreeNodes } from "@/features/canvas/tree-renderer";

type FileTreeSidebarProps = {
  owner: string;
  repo: string;
  isSidebarOpen: boolean;
  isPending: boolean;
  isError: boolean;
  files: any[];
  fileTree: any[];
  selectedFile: string | null;
  onSelectFile: (id: string | null) => void;
};

export function FileTreeSidebar({
  owner,
  repo,
  isSidebarOpen,
  isPending,
  isError,
  files,
  fileTree,
  selectedFile,
  onSelectFile,
}: FileTreeSidebarProps) {
  return (
    <aside
      className={cn(
        "absolute md:static top-0 left-0 h-full z-20 w-56 border-r dark:border-neutral-800 overflow-y-auto bg-white dark:bg-zinc-950 transition-transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="p-3 border-b dark:border-neutral-800">
        <p className="text-sm font-medium">
          {owner}/{repo}
        </p>
      </div>
      {isPending && <p className="p-4 text-sm text-neutral-400">Loading files...</p>}
      {isError && <p className="p-4 text-sm text-red-500">Failed to load files.</p>}
      {files && (
        <TreeProvider
          onSelectionChange={(ids) => onSelectFile(ids[0] || null)}
          selectedIds={selectedFile ? [selectedFile] : []}
        >
          <TreeView className="p-2">
            <RenderTreeNodes nodes={fileTree} level={0} />
          </TreeView>
        </TreeProvider>
      )}
    </aside>
  );
}
