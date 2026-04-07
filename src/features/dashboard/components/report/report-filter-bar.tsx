import { 
    FileText, 
    Table as TableIcon,
    MapPin,
    Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { DatePickerWithRange, type DateRange } from "@/components/ui/date-picker";
import type { Outlet } from "@/types/outlet";

interface ReportFilterBarProps {
    dateRange: DateRange | undefined;
    onDateChange: (range: DateRange | undefined) => void;
    selectedOutletId: string;
    onOutletChange: (id: string) => void;
    outlets: Outlet[];
    onExportExcel: () => void;
    onExportPDF: () => void;
    isExporting: boolean;
}

const ReportFilterBar = ({
    dateRange,
    onDateChange,
    selectedOutletId,
    onOutletChange,
    outlets,
    onExportExcel,
    onExportPDF,
    isExporting
}: ReportFilterBarProps) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/50 p-6 rounded-2xl border border-gray-100 ring-1 ring-gray-50/50 shadow-xs backdrop-blur-sm transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1.5">
                        <CalendarIcon size={10} className="text-green-700" />
                        Time Frame
                    </span>
                    <DatePickerWithRange 
                        date={dateRange} 
                        onDateChange={onDateChange} 
                        className="w-full sm:w-auto"
                    />
                </div>

                <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1.5">
                        <MapPin size={10} className="text-green-700" />
                        Location
                    </span>
                    <Select value={selectedOutletId} onValueChange={onOutletChange}>
                        <SelectTrigger className="h-11 w-full sm:w-56 bg-white border-gray-100 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all font-bold text-xs uppercase tracking-widest outline-hidden shadow-xs">
                            <SelectValue placeholder="All Outlets" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl bg-white overflow-hidden">
                            <SelectItem 
                                value="ALL" 
                                className="text-xs font-bold focus:bg-green-50 focus:text-green-900 rounded-lg cursor-pointer py-2.5"
                            >
                                ALL OUTLETS
                            </SelectItem>
                            {outlets.map((outlet) => (
                                <SelectItem 
                                    key={outlet.id} 
                                    value={outlet.id} 
                                    className="text-xs font-bold focus:bg-green-50 focus:text-green-900 rounded-lg cursor-pointer py-2.5"
                                >
                                    {outlet.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 text-right lg:text-left mb-0.5">
                    Data Export
                </span>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <Button 
                        onClick={onExportExcel}
                        disabled={isExporting}
                        variant="ghost"
                        className="flex-1 lg:flex-none text-green-800 hover:bg-green-50 border border-green-100/50 rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer outline-hidden group"
                    >
                        <TableIcon className="mr-2.5 h-4 w-4 group-hover:scale-110 transition-transform" />
                        Excel
                    </Button>
                    <Button 
                        onClick={onExportPDF}
                        disabled={isExporting}
                        className="flex-1 lg:flex-none bg-gray-900 hover:bg-black text-white rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-md shadow-gray-900/10 outline-hidden group"
                    >
                        <FileText className="mr-2.5 h-4 w-4 group-hover:scale-110 transition-transform" />
                        PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReportFilterBar;
