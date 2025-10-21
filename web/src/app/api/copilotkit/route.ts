import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
  LangGraphAgent
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

const serviceAdapter = new ExperimentalEmptyAdapter();
 
const runtime = new CopilotRuntime({
  agents: {
    starterAgent: new LangGraphAgent({
      deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123",
      graphId: "starterAgent",
      langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
    })
  }   
});
 
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime, 
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
 
  return handleRequest(req);
};