import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useReposQuery = () => {
  return useQuery({
    queryKey: ["repos"],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/repo`);
      return response.data;
    },
  });
};

export const useFileTreeQuery = (owner?: string, repo?: string, branch?: string) => {
  return useQuery({
    queryKey: ["repoTree", owner, repo, branch],
    queryFn: async () => {
      const response = await axios.post(`/api/v1/repo/tree`, {
        owner,
        repo,
        branch,
      });
      return response.data;
    },

    enabled: !!owner && !!repo && !!branch,
  });
};
