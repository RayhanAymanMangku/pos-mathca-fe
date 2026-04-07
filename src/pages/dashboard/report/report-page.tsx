import HeaderSection from "@/features/dashboard/components/sections/header-section";
import ReportSection from "@/features/dashboard/components/report/report-section";

const ReportPage = () => {
    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            <HeaderSection 
                title="Financial Intelligence" 
                description="Data-driven insight into your matcha ecosystem. 🍵" 
            />

      <ReportSection />
    </div>
  );
};

export default ReportPage;
