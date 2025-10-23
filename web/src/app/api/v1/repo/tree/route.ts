import { auth } from "@/lib/auth";
import { Octokit } from "@octokit/rest";

const EXCLUDED_DIRECTORIES = [
  "node_modules",
  "vendor",
  "dist",
  "build",
  "out",
  ".next",
  ".svelte-kit",
  ".git",
  ".vscode",
  "public",
  "assets",
  "static",
];

const EXCLUDED_PATTERNS = [
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
  /\.env$/,
  /\.log$/,
  /\.gitignore$/,
  /\.prettierrc$/,
  /\.eslintrc/,
  /tailwind\.config/,
  /\.md$/,
  /\.test\.[jt]sx?$/,
  /\.spec\.[jt]sx?$/,
  /__tests__/,
  /\.(jpg|jpeg|png|gif|svg|ico|webp)$/,
];

const INCLUDED_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".go",
  ".java",
  ".rb",
  ".php",
  ".html",
  ".css",
  ".scss",
  ".vue",
  ".svelte",
  ".c",
  ".cpp",
  ".cs",
  ".json",
];

export const POST = async (req: Request, res: Response) => {
  const { owner, repo, branch } = await req.json();
  const { accessToken } = await auth.api.getAccessToken({
    body: {
      providerId: "github",
    },
    headers: req.headers,
  });

  if (!owner || !repo || !branch || !accessToken) {
    return new Response(
      JSON.stringify({ error: "Missing parameters or not authenticated" }),
      { status: 400 },
    );
  }

  const octokit = new Octokit({ auth: accessToken });

  try {
    const { data: branchData } = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });
    const treeSha = branchData.commit.sha;

    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: treeSha,
      recursive: "true",
    });

    if (!treeData.tree) {
      return new Response(
        JSON.stringify({ error: "Could not retrieve file tree." }),
        { status: 404 },
      );
    }

    const relevantFiles = treeData.tree.filter((file: any) => {
      if (!file.path || file.type !== "blob") {
        return false;
      }

      if (EXCLUDED_DIRECTORIES.some((dir) => file.path.startsWith(`${dir}/`))) {
        return false;
      }

      if (EXCLUDED_PATTERNS.some((pattern) => pattern.test(file.path))) {
        return false;
      }

      return INCLUDED_EXTENSIONS.some((ext) => file.path.endsWith(ext));
    });

    return new Response(JSON.stringify(relevantFiles), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching repo", { status: 500 });
  }
};
