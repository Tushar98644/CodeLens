import { auth } from "@/lib/auth";
import { Octokit } from "@octokit/rest";

export const GET = async (req: Request, res: Response) => {
  const { accessToken } = await auth.api.getAccessToken({
    body: {
      providerId: "github",
    },
    headers: req.headers,
  });

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  try {
    const octokit = new Octokit({ auth: accessToken });
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: "updated",
      direction: "desc",
    });
    return new Response(JSON.stringify(repos), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error fetching repositories" }),
      { status: 500 },
    );
  }
};
