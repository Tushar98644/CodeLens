import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface AnalyzeRepoVariables {
  owner: string;
  repo: string;
  files: any;
}

const analyzeRepository = async ({ owner, repo, files }: AnalyzeRepoVariables) => {
  const { data } = await axios.post('/api/v1/repo/analyze', { 
    owner,
    repo,
    files,
  });
  return data;
};

export const useAnalysisQuery = (owner: string, repo: string, files: any) => {
  return useQuery({
    queryKey: ["repoAnalysis", owner, repo, files],
    queryFn: () => analyzeRepository({ owner, repo, files }),
  });
};