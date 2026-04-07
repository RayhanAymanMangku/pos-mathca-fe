import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { menuItems, driverMenuItems } from "@/features/dashboard/lib/constants"
import { Link, useLocation } from "react-router-dom"
import { useStore } from "@/store/store"
import { useShallow } from "zustand/shallow"
import { getInitials } from "@/lib/utils"
import heroLogo from "@/assets/hero.png"

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const location = useLocation()
    const pathname = location.pathname

    const { role, user } = useStore(useShallow((state) => ({
        role: state.role,
        user: state.user,
    })))

    const currentMenuItems = role === 'ADMIN' ? menuItems : driverMenuItems

    return (
        <Sidebar
            className="border-r border-gray-100 bg-white"
            {...props}
        >
            <SidebarHeader className="h-16 px-6 flex flex-row items-center justify-start border-b border-gray-100 shrink-0">
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <div className="relative shrink-0">
                        <img
                            src={heroLogo}
                            alt="POS Matcha Logo"
                            className="w-9 h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-base font-bold text-gray-900 tracking-tight">POS Matcha</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
                            {role === 'ADMIN' ? 'Admin Panel' : 'Driver Panel'}
                        </span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-3 py-3">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-1">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarMenu className="gap-0.5">
                        {currentMenuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.url

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        className={`
                                            rounded-lg h-10 transition-all duration-150
                                            ${isActive
                                                ? "bg-green-50 text-green-800 font-semibold shadow-sm"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                            }
                                        `}
                                    >
                                        <Link to={item.url} className="flex items-center gap-3 px-2">
                                            <div className={`
                                                flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150
                                                ${isActive ? "bg-green-100" : "bg-transparent group-hover:bg-gray-100"}
                                            `}>
                                                <Icon className={`size-4 ${isActive ? "text-green-700" : "text-gray-400"}`} />
                                            </div>
                                            <span className="text-sm">{item.title}</span>
                                            {isActive && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600" />
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="px-3 py-3 border-t border-gray-100">
                <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-default">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 shrink-0">
                        <span className="text-xs font-bold text-green-800">
                            {user?.name ? getInitials(user.name) : '?'}
                        </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-gray-800 truncate">{user?.name ?? 'User'}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{user?.email ?? '-'}</span>
                    </div>
                    <div className="ml-auto shrink-0">
                        <span className={`
                            text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md
                            ${role === 'ADMIN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                        `}>
                            {role ?? '-'}
                        </span>
                    </div>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">© 2025 POS Matcha</p>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar