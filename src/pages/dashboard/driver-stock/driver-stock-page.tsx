import HeaderSection from "@/features/dashboard/components/sections/header-section";
import DriverStockSection from "@/features/dashboard/components/driver-stock/driver-stock-section";
import { useStore } from "@/store/store";

const DriverStockPage = () => {
    const { outlet } = useStore();
    
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <HeaderSection 
                title="Branch Inventory"
                description="Live view of current stock levels at your assigned branch. Contact administration for supply replenishment requests."
                name={outlet?.name || "Local Outlet"}
            />

            <DriverStockSection />
        </div>
    );
};

export default DriverStockPage;
