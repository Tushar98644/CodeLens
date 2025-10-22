import { AIMessage } from "@langchain/core/messages";
import { type AgentState } from "./state";

export function shouldContinue({ messages, copilotkit }: AgentState) {
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

export function routeEntry(state: AgentState): string {
  if (!state.graph_data || state.graph_data.nodes.length === 0) {
    return "analyze";
  }
  
  return "chat";
}
