import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import './index.css'
const AnalyzePageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <CopilotKit runtimeUrl="/api/copilotkit" agent="starterAgent">
            <CopilotSidebar
                labels={{
                    title: "Your Assistant",
                    initial: "Hi! 👋 How can I assist you today?",
                }}
            />
            {children}
        </CopilotKit>
    );
}

export default AnalyzePageLayout;