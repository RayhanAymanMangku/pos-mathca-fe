import HeaderSection from '@/features/dashboard/components/sections/header-section';
import InventorySection from '@/features/dashboard/components/inventory/inventory-section';

const InventoryPage = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <HeaderSection 
                title="Inventory Tracking" 
                description="Live stock monitoring and branch-level inventory calibration." 
            />
            
            <div className="pb-10">
                <InventorySection />
            </div>
        </div>
    );
};

export default InventoryPage;
