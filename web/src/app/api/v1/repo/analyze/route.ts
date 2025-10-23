import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { auth } from '@/lib/auth';
import { Client } from "@langchain/langgraph-sdk";

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

    const graphData = await runFunctionalAnalysisAgent(validFiles);

    return NextResponse.json(
       {
        repository: `${owner}/${repo}`,
        filesAnalyzed: graphData.nodes?.length || 0,
        graph_data: graphData
      },
      { status: 200 },
  );

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


async function runFunctionalAnalysisAgent(files: { path: string; content: string }[]) {
  console.log('📤 Calling LangGraph SDK with files:', files.length);
  
  try {
    const client = new Client({
      apiUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || 'http://localhost:8123'
    });

    console.log('Creating thread...');
    const thread = await client.threads.create();
    console.log('✅ Thread created:', thread.thread_id);

    console.log('Starting run...');
    const run = await client.runs.create(
      thread.thread_id, 
      'starterAgent', 
      {
        input: {
          files: files,
          graph_data: { nodes: [], edges: [] },
          messages: []
        }
      }
    );
    
    console.log('✅ Run started:', run.run_id);

    console.log('Waiting for completion...');
    const finalRun = await client.runs.join(thread.thread_id, run.run_id);

    console.log('Fetching final state...');
    const state = await client.threads.getState(thread.thread_id);
    
    console.log('✅ Final state received:', JSON.stringify(state.values, null, 2));

    if (state.values && state.values.graph_data) {
      console.log('Graph ', {
        nodes: state.values.graph_data.nodes?.length,
        edges: state.values.graph_data.edges?.length
      });
      return state.values.graph_data;
    } else {
      console.error('❌ No graph_data in state!');
      console.error('State:', state.values);
      return { nodes: [], edges: [] };
    }

  } catch (error: any) {
    console.error('LangGraph SDK error:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}