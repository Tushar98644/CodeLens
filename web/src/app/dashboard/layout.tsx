import { SideBar } from "@/components";

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="grid grid-cols-6 h-screen w-screen">
            <div className="col-span-1">
                <SideBar />
            </div>
            <div className="overflow-hidden col-span-5">
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;