import { useState } from "react";
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
import type { Transaction } from "@/types/transaction";
import { cn } from "@/lib/utils";

interface ReportTableProps {
    transactions: Transaction[];
}

const ReportTable = ({ transactions }: ReportTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-sm rounded-2xl border border-dashed border-gray-200 gap-4">
                <div className="p-4 rounded-full bg-gray-50 text-gray-300">
                    <svg className="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">
                    No transactions recorded for the selected range.
                </p>
            </div>
        );
    }

    // Pagination Logic
    const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = transactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white/40 shadow-xs backdrop-blur-sm overflow-hidden transition-all duration-300">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-gray-100">
                            <TableHead className="w-[180px] h-12 text-[10px] font-black uppercase tracking-widest text-gray-500 pl-6">Invoice #</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">Method</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500">Date/Time</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-right pr-6">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions.map((tx) => (
                            <TableRow 
                                key={tx.id} 
                                className="group hover:bg-green-50/30 border-gray-100 transition-all duration-200"
                            >
                                <TableCell className="py-4 pl-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-gray-900 group-hover:text-green-900 transition-colors">
                                            {tx.invoiceNumber}
                                        </span>
                                        <span className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter">
                                            TXID: {tx.id.slice(0, 8)}...
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-gray-50 border-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-800 transition-all">
                                        {tx.paymentMethod}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge 
                                        className={cn(
                                            "text-[9px] font-black uppercase tracking-widest",
                                            tx.paymentStatus === "PAID" 
                                                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                                                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                        )}
                                    >
                                        {tx.paymentStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-600">
                                            {format(new Date(tx.createdAt), "dd MMM yyyy")}
                                        </span>
                                        <span className="text-[10px] font-medium text-gray-400">
                                            {format(new Date(tx.createdAt), "HH:mm")}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-6 font-bold text-xs tabular-nums text-gray-900">
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
                                        "cursor-pointer hover:bg-green-50 hover:text-green-700 border-gray-100 rounded-xl h-9 text-[10px] font-bold uppercase tracking-widest transition-all",
                                        currentPage === 1 && "pointer-events-none opacity-40"
                                    )}
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                                />
                            </PaginationItem>
                            
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        isActive={currentPage === i + 1}
                                        className={cn(
                                            "cursor-pointer rounded-xl h-9 w-9 text-[10px] font-black transition-all",
                                            currentPage === i + 1 
                                                ? "bg-green-700 text-white hover:bg-green-800 shadow-md shadow-green-900/10 border-green-600" 
                                                : "hover:bg-green-50 hover:text-green-700 border-gray-100 text-gray-400"
                                        )}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext 
                                    className={cn(
                                        "cursor-pointer hover:bg-green-50 hover:text-green-700 border-gray-100 rounded-xl h-9 text-[10px] font-bold uppercase tracking-widest transition-all",
                                        currentPage === totalPages && "pointer-events-none opacity-40"
                                    )}
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default ReportTable;
