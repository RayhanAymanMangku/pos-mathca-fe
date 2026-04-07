import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { type Transaction } from "@/types/transaction";
import { History, ShoppingBag, Calendar, ArrowRight, CreditCard } from "lucide-react";

interface OutletDetailDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    outletName: string;
    transactions: Transaction[];
    isLoading: boolean;
}

const OutletDetailDialog = ({ 
    isOpen, 
    onOpenChange, 
    outletName, 
    transactions, 
    isLoading 
}: OutletDetailDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden ring-1 ring-white/20">
                <DialogHeader className="pt-8 pb-6 px-10 bg-green-50/50 border-b border-green-100 flex flex-col items-center text-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-green-100/50 flex items-center justify-center text-green-700 ring-1 ring-green-200 shadow-sm">
                        <History strokeWidth={2.5} size={28} />
                    </div>
                    <div className="space-y-1.5">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 leading-none">
                            {outletName} History
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed font-sans">
                            Detailed transaction overview and branch performance metrics. 🍵
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white">
                            <Spinner className="size-8 text-green-600" />
                            <p className="text-xs font-bold text-green-800 uppercase tracking-widest animate-pulse font-sans">
                                Synchronizing Data...
                            </p>
                        </div>
                    ) : (
                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Invoice & Method</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right whitespace-nowrap">Revenue</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center whitespace-nowrap">Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="group hover:bg-green-50/20 transition-all duration-200">
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <ShoppingBag size={12} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                                                        <span className="text-xs font-bold text-gray-900 leading-none">{tx.invoiceNumber}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard size={10} className="text-gray-300" />
                                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{tx.paymentMethod}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <Calendar size={10} className="text-gray-300 shrink-0" />
                                                        <span className="text-[9px] font-bold text-muted-foreground tracking-tight truncate uppercase">
                                                            {new Date(tx.createdAt).toLocaleString('en-US', { 
                                                                month: 'short', 
                                                                day: 'numeric', 
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="text-[13px] font-bold text-gray-900 underline decoration-green-300/50 decoration-2 underline-offset-4 decoration-skip-ink">
                                                    {formatCurrency(tx.totalAmount)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-center whitespace-nowrap">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ring-1",
                                                    tx.paymentStatus === "PAID" ? "bg-green-50 text-green-700 ring-green-100/50" :
                                                    "bg-red-50 text-red-700 ring-red-100/50"
                                                )}>
                                                    {tx.paymentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-4 bg-gray-50/50 rounded-2xl ring-1 ring-gray-100">
                                                        <History className="size-7 text-gray-300" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-900 font-bold tracking-tight">No Sales Records Found</p>
                                                        <p className="text-xs text-muted-foreground font-medium max-w-[220px] mx-auto leading-relaxed">
                                                            Transactions for this branch will appear here once orders are processed.
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-900 hover:bg-gray-50 shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer outline-hidden group"
                    >
                        Close History
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OutletDetailDialog;
