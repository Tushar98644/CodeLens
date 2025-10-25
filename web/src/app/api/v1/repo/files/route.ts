import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { auth } from "@/lib/auth";

interface FileObject {
  path: string;
  sha: string;
  type: "blob" | "tree";
}

export async function POST(request: NextRequest) {
  try {
    const { owner, repo, files } = await request.json();

    if (!owner || !repo || !Array.isArray(files)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { accessToken } = await auth.api.getAccessToken({
      body: { providerId: "github" },
      headers: request.headers,
    });

    if (!accessToken) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    const octokit = new Octokit({ auth: accessToken });

    const filesWithContent = await Promise.all(
      files.map(async (file: FileObject) => {
        try {
          const { data: blobData } = await octokit.rest.git.getBlob({
            owner,
            repo,
            file_sha: file.sha,
          });

          const content = Buffer.from(blobData.content, "base64").toString("utf-8");

          return {
            path: file.path,
            content: content,
            sha: file.sha,
          };
        } catch (error) {
          console.error(`Failed to fetch blob for ${file.path}:`, error);
          return {
            path: file.path,
            content: "",
            sha: file.sha,
          };
        }
      }),
    );

    console.log(`✅ Fetched ${filesWithContent.length} files with content`);

    return NextResponse.json(filesWithContent);
  } catch (error: any) {
    console.error("Error fetching files:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
