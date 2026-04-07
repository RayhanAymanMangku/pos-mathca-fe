import RootLayout from "@/components/layout/root-layout";
import { createBrowserRouter, Outlet } from "react-router-dom";
import AdminGuard from "@/components/layout/dashboard/admin-guard";
import Dashboard from "@/pages/dashboard/dashboard-page";
import LoginPage from "@/pages/auth/login-page";
import NotFoundPage from "@/pages/not-found/not-found-page";
import OutletPage from "@/pages/dashboard/outlet/outlet-page";
import ProductPage from "@/pages/dashboard/product/product-page";
import InventoryPage from "@/pages/dashboard/inventory/inventory-page";
import UserPage from "@/pages/dashboard/user/user-page";
import ReportPage from "@/pages/dashboard/report/report-page";
import POSPage from "@/pages/dashboard/pos/pos-page";
import DriverStockPage from "@/pages/dashboard/driver-stock/driver-stock-page";
import DriverTransactionPage from "@/pages/dashboard/transaction/driver-transaction-page";
import RoleBasedLayout from "@/components/layout/dashboard/role-based-layout";

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <LoginPage />,
            },
            {
                path: "/dashboard",
                element: (
                    <RoleBasedLayout>
                        <Outlet />
                    </RoleBasedLayout>
                ),
                children: [
                    {
                        index: true,
                        element: <AdminGuard><Dashboard /></AdminGuard>,
                    },
                    {
                        path: "outlet",
                        element: <AdminGuard><OutletPage /></AdminGuard>,
                    },
                    {
                        path: "products",
                        element: <AdminGuard><ProductPage /></AdminGuard>,
                    },
                    {
                        path: "inventory",
                        element: <AdminGuard><InventoryPage /></AdminGuard>,
                    },
                    {
                        path: "users",
                        element: <AdminGuard><UserPage /></AdminGuard>,
                    },
                    {
                        path: "reports",
                        element: <AdminGuard><ReportPage /></AdminGuard>,
                    },
                    {
                        path: "settings",
                        element: <AdminGuard><div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">System Settings (Placeholder)</div></AdminGuard>,
                    },
                    // Driver Specific Routes
                    {
                        path: "pos",
                        element: <POSPage />,
                    },
                    {
                        path: "stock",
                        element: <DriverStockPage />,
                    },
                    {
                        path: "driver-transaction",
                        element: <DriverTransactionPage />,
                    },
                ]
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    }
])