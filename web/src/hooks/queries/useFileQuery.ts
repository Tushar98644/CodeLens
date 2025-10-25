import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface AnalyzeRepoVariables {
  owner: string;
  repo: string;
  files: any;
}

const fetchFileContent = async ({ owner, repo, files }: AnalyzeRepoVariables) => {
  const { data } = await axios.post("/api/v1/repo/files", {
    owner,
    repo,
    files,
  });
  return data;
};

export const useFileContentsQuery = (owner: string, repo: string, files: any) => {
  return useQuery({
    queryKey: ["repoAnalysis", owner, repo, files],
    queryFn: () => fetchFileContent({ owner, repo, files }),
    staleTime: 1000 * 60 * 5,
    enabled: !!owner && !!repo && !!files,
  });
};
