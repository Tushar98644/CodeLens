import { ClerkProvider } from "@clerk/nextjs";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { ThemeProvider } from "next-themes";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkProvider>
            <CopilotKit runtimeUrl="/api/copilotkit" agent="starterAgent">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </CopilotKit>
        </ClerkProvider>
    );
}

export default AppProvider;