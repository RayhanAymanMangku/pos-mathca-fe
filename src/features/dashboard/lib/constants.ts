import { BarChart3, Box, LayoutDashboard, Package, Receipt, Store, Users } from "lucide-react";

export const menuItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Outlet",
        url: "/dashboard/outlet",
        icon: Store,
    },
    {
        title: "Products",
        url: "/dashboard/products",
        icon: Package,
    },
    {
        title: "Inventory",
        url: "/dashboard/inventory",
        icon: Box,
    },
    {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
    },
    {
        title: "Reports",
        url: "/dashboard/reports",
        icon: BarChart3,
    },
    // {
    //     title: "Settings",
    //     url: "/dashboard/settings",
    //     icon: Settings,
    // },
]

export const driverMenuItems = [
    {
        title: "POS",
        url: "/dashboard/pos",
        icon: LayoutDashboard,
    },
    {
        title: "Stock",
        url: "/dashboard/stock",
        icon: Box,
    },
    {
        title: "Transaction",
        url: "/dashboard/driver-transaction",
        icon: Receipt,
    },
]