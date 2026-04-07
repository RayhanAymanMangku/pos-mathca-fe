import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "../elements/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"
import { useBreadcrumb } from "@/hooks/use-breadcrumb"
import UserPopover from "../elements/user-popover"
import { useLocationTracking } from "@/hooks/use-location-tracking"

const DriverLayout = ({ children }: { children: React.ReactNode }) => {
    const { segments } = useBreadcrumb();
    useLocationTracking(); // Mount the tracking hook

    return (
        <SidebarProvider className="min-h-screen">
            <AppSidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden bg-gray-50/50">
                <div className="flex flex-col h-full w-full">
                    <header className="flex flex-row justify-between h-16 px-5 shrink-0 items-center gap-2 bg-white border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger className="text-gray-500 hover:text-gray-800 transition-colors" />
                            <div className="w-px h-5 bg-gray-200" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink
                                            href="/dashboard"
                                            className="text-gray-500 hover:text-green-700 text-sm font-medium transition-colors"
                                        >
                                            Driver Panel
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {segments.map((item) => (
                                        <React.Fragment key={item.path}>
                                            <BreadcrumbSeparator className="hidden md:block text-gray-300" />
                                            <BreadcrumbItem>
                                                {item.isLast ? (
                                                    <BreadcrumbPage className="text-gray-800 font-semibold text-sm">
                                                        {item.display}
                                                    </BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink
                                                        href={item.path}
                                                        className="text-gray-500 hover:text-green-700 text-sm font-medium transition-colors"
                                                    >
                                                        {item.display}
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                        </React.Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        <UserPopover />
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-6 pb-8 overflow-aut antialiased">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DriverLayout;
