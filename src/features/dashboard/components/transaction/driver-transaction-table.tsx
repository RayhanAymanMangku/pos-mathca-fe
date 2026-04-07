import { format } from "date-fns";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import type { MyTransaction } from "@/types/transaction";
import { cn } from "@/lib/utils";
import { Receipt, History, Layers } from "lucide-react";

interface DriverTransactionTableProps {
    transactions: MyTransaction[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const DriverTransactionTable = ({ 
    transactions, 
    currentPage, 
    totalPages, 
    onPageChange 
}: DriverTransactionTableProps) => {

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200 gap-6">
                <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 shadow-sm border border-gray-100">
                    <History size={32} />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-sm font-black text-gray-900 uppercase tracking-wider">No history recorded</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">Try adjusting your date filters or record a new sale.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white/40 shadow-xs backdrop-blur-sm overflow-hidden transition-all duration-300 ring-1 ring-gray-100/50">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-gray-100">
                            <TableHead className="w-[180px] h-14 text-[10px] font-black uppercase tracking-widest text-gray-500 pl-8">Order ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">Method</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Items</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">Recorded At</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-right pr-8">Total Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow 
                                key={tx.id} 
                                className="group hover:bg-green-50/30 border-gray-50 transition-all duration-200"
                            >
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-100 shadow-xs group-hover:text-green-700 transition-colors">
                                           <Receipt size={14} />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-black text-gray-900 group-hover:text-green-900 transition-colors">
                                                {tx.invoice}
                                            </span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                ID: {tx.id.slice(0, 8)}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white border-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-800 transition-all px-2.5 py-0.5 rounded-lg shadow-xs">
                                        {tx.paymentMethod}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-600 group-hover:bg-white transition-colors">
                                        <Layers size={10} className="text-green-600" />
                                        <span className="text-[10px] font-black">{tx.itemCount} Units</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-700">
                                            {format(new Date(tx.date), "dd MMM yyyy")}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400">
                                            {format(new Date(tx.date), "HH:mm")}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8 font-black text-xs tabular-nums text-green-700">
                                    Rp {tx.totalAmount.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center sm:justify-end pt-2">
                    <Pagination>
                        <PaginationContent className="flex-wrap gap-2">
                            <PaginationItem>
                                <PaginationPrevious 
                                    className={cn(
                                        "cursor-pointer hover:bg-green-50 hover:text-green-700 border-gray-100 rounded-2xl h-10 px-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-xs bg-white",
                                        currentPage === 1 && "pointer-events-none opacity-40 grayscale"
                                    )}
                                    onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
                                />
                            </PaginationItem>
                            
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <PaginationItem key={i} className="hidden sm:inline-block">
                                    <PaginationLink
                                        isActive={currentPage === i + 1}
                                        className={cn(
                                            "cursor-pointer rounded-2xl h-10 w-10 text-[10px] font-black transition-all shadow-xs",
                                            currentPage === i + 1 
                                                ? "bg-green-700 text-white hover:bg-green-800 shadow-lg shadow-green-900/10 border-green-600" 
                                                : "hover:bg-green-50 hover:text-green-700 border-gray-100 text-gray-400 bg-white"
                                        )}
                                        onClick={() => onPageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext 
                                    className={cn(
                                        "cursor-pointer hover:bg-green-50 hover:text-green-700 border-gray-100 rounded-2xl h-10 px-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-xs bg-white",
                                        currentPage === totalPages && "pointer-events-none opacity-40 grayscale"
                                    )}
                                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default DriverTransactionTable;
