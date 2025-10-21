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