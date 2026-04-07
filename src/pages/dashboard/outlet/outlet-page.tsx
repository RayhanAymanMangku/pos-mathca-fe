import OutletSection from '@/features/dashboard/components/outlet/outlet-section';
import HeaderSection from '@/features/dashboard/components/sections/header-section';

const OutletPage = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <HeaderSection
                title="Outlets 🍵"
                description="Store and Branch Management"
            />
            <OutletSection />
        </div>
    );
};

export default OutletPage;
