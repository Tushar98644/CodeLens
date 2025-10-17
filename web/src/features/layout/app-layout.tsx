import { SideBar } from "@/components";
import { ClerkProvider } from "@clerk/nextjs";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider >
      <div className="grid grid-cols-6 h-screen w-screen">
        <div className="cols-span-1">
          <SideBar />
        </div>
        <div className="cols-span-5">
          {children}
        </div>
      </div>
    </ClerkProvider>
  );
}