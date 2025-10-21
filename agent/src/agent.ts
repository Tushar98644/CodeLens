import { z } from "zod";
import { RunnableConfig } from "@langchain/core/runnables";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { convertActionsToDynamicStructuredTools, CopilotKitStateAnnotation } from "@copilotkit/sdk-js/langgraph";
import { Annotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const AgentStateAnnotation = Annotation.Root({
  ...CopilotKitStateAnnotation.spec, 
  proverbs: Annotation<string[]>,
});

export type AgentState = typeof AgentStateAnnotation.State;

const getWeather = tool(
  (args) => {
    return `The weather for ${args.location} is 70 degrees, clear skies, 45% humidity, 5 mph wind, and feels like 72 degrees.`;
  },
  {
    name: "getWeather",
    description: "Get the weather for a given location.",
    schema: z.object({
      location: z.string().describe("The location to get weather for"),
    }),
  }
);

const tools = [getWeather];

async function chat_node(state: AgentState, config: RunnableConfig) {
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-pro',
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY!
  })

  const modelWithTools = model.bindTools!(
    [
      ...convertActionsToDynamicStructuredTools(state.copilotkit?.actions ?? []),
      ...tools,
    ],
  );

  const systemMessage = new SystemMessage({
    content: `You are a helpful assistant. The current proverbs are ${JSON.stringify(state.proverbs)}.`,
  });

  const response = await modelWithTools.invoke(
    [systemMessage, ...state.messages],
    config
  );

  return {
    messages: response,
  };
}

function shouldContinue({ messages, copilotkit }: AgentState) {
  const lastMessage = messages[messages.length - 1] as AIMessage;

  if (lastMessage.tool_calls?.length) {
    const actions = copilotkit?.actions;
    const toolCallName = lastMessage.tool_calls![0].name;

    if (!actions || actions.every((action: { name: string }) => action.name !== toolCallName)) {
      return "tool_node"
    }
  }

  return "__end__";
}

const workflow = new StateGraph(AgentStateAnnotation)
  .addNode("chat_node", chat_node)
  .addNode("tool_node", new ToolNode(tools))
  .addEdge(START, "chat_node")
  .addEdge("tool_node", "chat_node")
  .addConditionalEdges("chat_node", shouldContinue as any);

const memory = new MemorySaver();

export const graph = workflow.compile({
  checkpointer: memory,
});
