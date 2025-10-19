import { ClerkProvider } from "@clerk/nextjs";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryProvider } from "./query-provider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ClerkProvider>
            <CopilotKit runtimeUrl="/api/copilotkit" agent="starterAgent">
                <QueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </QueryProvider>
            </CopilotKit>
        </ClerkProvider>
    );
}

export default AppProvider;