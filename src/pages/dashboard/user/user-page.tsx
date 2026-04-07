import HeaderSection from "@/features/dashboard/components/sections/header-section";
import UserSection from "@/features/dashboard/components/user/user-section";

const UserPage = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <HeaderSection 
                title="Personnel Management" 
                description="Staff infrastructure, system access controls, and branch assignments." 
            />
            
            <UserSection />
        </div>
    );
};

export default UserPage;
