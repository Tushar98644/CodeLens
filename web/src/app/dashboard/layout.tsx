import { SideBar } from "@/components";

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="grid grid-cols-6 h-screen w-screen">
            <div className="col-span-1">
                <SideBar />
            </div>
            <div className="overflow-y-scroll col-span-5 p-4">
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;