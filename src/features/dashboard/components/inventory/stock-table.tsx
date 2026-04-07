import type { Stock } from "@/types/stock";
import { MoveUp, MoveDown, Package, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockTableProps {
    stocks: Stock[];
    onAdjust?: (stock: Stock) => void;
    hideAdjustment?: boolean;
}

const StockTable = ({ stocks, onAdjust, hideAdjustment = false }: StockTableProps) => {
    return (
        <div className="w-full overflow-hidden rounded-2xl border-none bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md font-sans">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Product Essence</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center whitespace-nowrap">Availability</th>
                            {!hideAdjustment && (
                                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right whitespace-nowrap">Inventory Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {stocks.map((stock) => (
                            <tr key={stock.id} className="group hover:bg-green-50/20 transition-all duration-200">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-11 w-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 ring-1 ring-gray-100 shadow-xs overflow-hidden transition-transform group-hover:scale-105">
                                            {stock.product?.imageUrl ? (
                                                <img src={stock.product.imageUrl} alt={stock.product.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <Package size={18} />
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-bold text-gray-900 truncate leading-none mb-1.5">{stock.product?.name ?? 'Unknown Product'}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-lg tracking-widest uppercase">{stock.product?.sku ?? 'NO-SKU'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <span className={cn(
                                            "text-lg font-bold tracking-tight leading-none mb-1",
                                            stock.quantity <= 5 ? "text-red-600 font-black" :
                                            stock.quantity <= 15 ? "text-amber-600" :
                                            "text-green-700"
                                        )}>
                                            {stock.quantity}
                                        </span>
                                        {stock.quantity <= 5 && (
                                            <span className="flex items-center gap-1 text-[8px] font-bold text-red-500 uppercase tracking-widest animate-pulse bg-red-50 px-1.5 py-0.5 rounded-md ring-1 ring-red-100/50">
                                                <AlertTriangle size={8} />
                                                CRITICAL
                                            </span>
                                        )}
                                    </div>
                                </td>
                                {!hideAdjustment && (
                                    <td className="px-8 py-5 text-right">
                                        <button 
                                            onClick={() => onAdjust?.(stock)}
                                            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-green-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-green-700 shadow-md shadow-green-900/20 transition-all hover:scale-[1.05] active:scale-95 cursor-pointer outline-hidden group"
                                        >
                                            <div className="flex flex-col gap-0.5 items-center">
                                                <MoveUp size={10} className="group-hover:-translate-y-0.5 transition-transform" />
                                                <MoveDown size={10} className="group-hover:translate-y-0.5 transition-transform" />
                                            </div>
                                            Stock Management
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {stocks.length === 0 && (
                            <tr>
                                <td colSpan={hideAdjustment ? 2 : 3} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 bg-gray-50/50 rounded-2xl ring-1 ring-gray-100">
                                            <Package className="size-7 text-gray-300" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-900 font-bold tracking-tight">Empty Inventory Repository</p>
                                            <p className="text-xs text-muted-foreground font-medium max-w-[240px] mx-auto leading-relaxed">
                                                Products assigned to this branch will appear here once stocks are initialized.
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockTable;
