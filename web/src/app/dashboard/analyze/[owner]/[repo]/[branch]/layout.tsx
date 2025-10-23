import { CopilotKit } from "@copilotkit/react-core";

const AnalyzePageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <CopilotKit runtimeUrl="/api/copilotkit" agent="starterAgent">
            {children}
        </CopilotKit>
    );
}

export default AnalyzePageLayout;