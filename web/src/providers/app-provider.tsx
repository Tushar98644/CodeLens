import "@copilotkit/react-ui/styles.css";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./query-provider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
};

export default AppProvider;
