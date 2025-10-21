import { convertActionsToDynamicStructuredTools } from "@copilotkit/sdk-js/langgraph";
import { SystemMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { model } from "../config/llm";
import { tools } from "./tools";
import { AgentState } from "./state";
import { ToolNode } from "@langchain/langgraph/prebuilt";

export async function chat_node(state: AgentState, config: RunnableConfig) {

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

export const tool_node = new ToolNode(tools);
