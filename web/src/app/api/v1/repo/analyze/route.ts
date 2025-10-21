import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { auth } from '@/lib/auth';

interface FileObject {
  path: string;
  sha: string;
  type: 'blob' | 'tree';
}

export async function POST(request: NextRequest) {
  try {
    const { owner, repo, files } = await request.json();

    if (!owner || !repo || !Array.isArray(files)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { accessToken } = await auth.api.getAccessToken({ 
        body: { providerId: "github" },
        headers: request.headers
    });

    if (!accessToken) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
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
          const content = Buffer.from(blobData.content, 'base64').toString('utf-8');
          return {
            path: file.path,
            content: content,
          };
        } catch (error) {
          console.error(`Failed to fetch blob for ${file.path}:`, error);
          return null;
        }
      })
    );

    const validFiles = filesWithContent.filter(
      (file): file is { path: string; content: string } => file !== null
    );
    
    if (validFiles.length === 0) {
      return NextResponse.json({ error: 'Could not process any files.' }, { status: 500 });
    }

    const analysisResult = await runFunctionalAnalysisAgent(validFiles);

    return NextResponse.json({ success: true, data: analysisResult });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function runFunctionalAnalysisAgent(files: { path: string; content: string }[]) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/copilotkit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentName: 'functional_analyzer',
      messages: [
        {
          role: 'user',
          content: `
            Analyze the provided source code for the following files. Your task is to:
            1.  For each file, write a concise, one-sentence summary of its primary function.
            2.  Identify the functional dependencies between them. For example, if 'UserProfile' uses 'Avatar' to show a picture, that is a dependency.
            3.  Return a JSON object with a 'graph_data' key. This object should contain 'nodes' and 'edges'.
            4.  Each node in the 'nodes' array should be an object: { "id": "file/path", "summary": "This component does X..." }.
            5.  Each edge should be an object: { "source": "file/path/that/imports", "target": "file/path/that/is/imported" }.
          `,
        },
      ],
      state: {
        files: files,
        graph_data: { nodes: [], edges: [] }, 
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Agent failed: ${response.statusText}`);
  }
  return await response.json();
}