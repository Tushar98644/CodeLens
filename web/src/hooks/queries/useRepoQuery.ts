import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Octokit } from "@octokit/rest";

const fetchRepos = async () => {
 
  const { data } = await authClient.getAccessToken({
    providerId: "github",
  });

  const accessToken = data?.accessToken;

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const octokit = new Octokit({ auth: accessToken });

  const repos = await octokit.paginate(
    octokit.rest.repos.listForAuthenticatedUser,
    {
      per_page: 100,
      sort: "updated",
      direction: "desc",
    }
  );

  return repos;
};

export const useRepoQuery = () => {
  return useQuery({
    queryKey: ["repo"],
    queryFn: () => fetchRepos(),
  });
};
