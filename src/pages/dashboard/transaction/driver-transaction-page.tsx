import HeaderSection from "@/features/dashboard/components/sections/header-section";
import DriverTransactionSection from "@/features/dashboard/components/transaction/driver-transaction-section";
import { useStore } from "@/store/store";

const DriverTransactionPage = () => {
    const { outlet } = useStore();

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <HeaderSection 
                title="Operation History"
                description={`A secure record of all transactions processed at ${outlet?.name || "your assigned branch"}. Review payment methods and historical data.`}
                name={outlet?.name || "Local Branch"}
            />

            <DriverTransactionSection />
        </div>
    );
};

export default DriverTransactionPage;
