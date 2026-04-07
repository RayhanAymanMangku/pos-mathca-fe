import { Calendar as CalendarIcon, History } from "lucide-react";
import { DatePickerWithRange, type DateRange } from "@/components/ui/date-picker";

interface DriverTransactionFilterProps {
    dateRange: DateRange | undefined;
    onDateChange: (range: DateRange | undefined) => void;
    outletName: string;
}

const DriverTransactionFilter = ({
    dateRange,
    onDateChange,
    outletName
}: DriverTransactionFilterProps) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/50 p-6 rounded-3xl border border-gray-100 shadow-xs backdrop-blur-sm ring-1 ring-gray-100/50">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 border border-green-100 shadow-sm">
                    <History size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">Transaction Feed</h2>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                        Operational history for <span className="text-green-700">{outletName}</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2 w-full lg:w-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                    <CalendarIcon size={12} className="text-green-700" />
                    Query Period
                </span>
                <DatePickerWithRange 
                    date={dateRange} 
                    onDateChange={onDateChange} 
                    className="w-full lg:w-72 shadow-xs border-gray-100 rounded-2xl transition-all hover:border-green-200"
                />
            </div>
        </div>
    );
};

export default DriverTransactionFilter;
