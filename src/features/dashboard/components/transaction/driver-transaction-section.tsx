import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyTransactions } from "@/services/transaction-api";
import { useStore } from "@/store/store";
import DriverTransactionTable from "./driver-transaction-table";
import DriverTransactionFilter from "./driver-transaction-filter";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import type { DateRange } from "@/components/ui/date-picker";
import { useShallow } from "zustand/shallow";

const DriverTransactionSection = () => {
    const { outlet } = useStore(useShallow((state) => ({
        outlet: state.outlet,
    })));
    
    const [currentPage, setCurrentPage] = useState(1);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined
    });

    const ITEMS_PER_PAGE = 5;

    const { 
        data: response, 
        isLoading,
        isPlaceholderData
    } = useQuery({
        queryKey: ["transactions", "me", currentPage, dateRange?.from, dateRange?.to],
        queryFn: () => getMyTransactions({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
            endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
        }),
        placeholderData: (previousData) => previousData,
    });

    // The interceptor returns the full JSON if meta is present
    const transactions = response?.data || [];
    const meta = response?.meta;

    if (isLoading && !isPlaceholderData) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Spinner className="size-8 text-green-700" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Official Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <DriverTransactionFilter 
                dateRange={dateRange}
                onDateChange={(range) => {
                    setDateRange(range);
                    setCurrentPage(1); 
                }}
                outletName={outlet?.name || "Branch Location"}
            />

            <div className={isPlaceholderData ? "opacity-50 transition-opacity" : ""}>
                <DriverTransactionTable 
                    transactions={transactions} 
                    currentPage={currentPage}
                    totalPages={meta?.totalPages || 1}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default DriverTransactionSection;
