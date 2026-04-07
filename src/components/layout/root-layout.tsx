import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProviderContext } from "@/context/auth-provider-context";

const RootLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <AuthProviderContext>
                <Outlet />
            </AuthProviderContext>
            <Toaster richColors position="bottom-right" />
        </div>
    );
};

export default RootLayout;