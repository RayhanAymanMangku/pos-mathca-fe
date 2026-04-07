import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { getOutlets } from '@/services/outlet-api';
import { getStocksByOutlet, adjustStock } from '@/services/stock-api';
import StockTable from './stock-table';
import StockAdjustDialog from './stock-adjust-dialog';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Package } from "lucide-react";
import { toast } from "sonner";
import type { Stock, StockAdjustmentMode } from "@/types/stock";
import { useResourceDialog } from '@/hooks/use-resource-dialog';

const InventorySection = () => {
    const queryClient = useQueryClient();
    const [selectedOutletId, setSelectedOutletId] = useState<string>("");
    
    const {
        isOpen: isAdjustDialogOpen,
        selectedItem: selectedStock,
        handleAdd: handleAddStock,
        handleEdit: handleAdjustTrigger,
        closeDialog: closeAdjustDialog,
    } = useResourceDialog<Stock>();

    const { 
        data: outlets = [], 
    } = useQuery({
        queryKey: ['outlets'],
        queryFn: getOutlets,
    });

    useEffect(() => {
        if (outlets.length > 0 && !selectedOutletId) {
            setSelectedOutletId(outlets[0].id);
        }
    }, [outlets, selectedOutletId]);

    // Parallel fetch ALL stocks to detect low-stock outlets for the Select dropdown
    const allStocksQueries = useQueries({
        queries: outlets.map(outlet => ({
            queryKey: ['stocks', outlet.id],
            queryFn: () => getStocksByOutlet(outlet.id),
            staleTime: 1000 * 60 * 5, 
            enabled: outlets.length > 0
        }))
    });

    const getOutletStatus = (outletId: string) => {
        const query = allStocksQueries.find(q => q.data?.[0]?.outletId === outletId || (q.isSuccess && q.data?.length === 0));
        if (!query?.data) return false;
        return query.data.some((s: Stock) => s.quantity < 10);
    };

    const { 
        data: stocks = [], 
        isLoading: isStocksLoading,
        isFetching: isStocksFetching,
        refetch 
    } = useQuery({
        queryKey: ['stocks', selectedOutletId],
        queryFn: () => getStocksByOutlet(selectedOutletId),
        enabled: !!selectedOutletId,
    });

    const adjustMutation = useMutation({
        mutationFn: ({ quantity, mode, productId, targetOutletId }: { 
            quantity: number, 
            mode: StockAdjustmentMode, 
            productId: string, 
            targetOutletId: string 
        }) => adjustStock({ productId, outletId: targetOutletId, quantity, mode }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stocks', selectedOutletId] });
            toast.success("Inventory updated successfully! 🍵");
            closeAdjustDialog();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to adjust stock");
        }
    });


    const handleAdjustSubmit = (quantity: number, mode: StockAdjustmentMode, productId?: string, targetOutletId?: string) => {
        const resolvedProductId = productId ?? selectedStock?.productId;
        const resolvedOutletId = targetOutletId ?? selectedOutletId;
        if (!resolvedProductId || !resolvedOutletId) return;
        adjustMutation.mutate({ quantity, mode, productId: resolvedProductId, targetOutletId: resolvedOutletId });
    };

    return (
        <div className="space-y-6">
            {/* Control Panel — consistent with OutletSection style */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-6 rounded-2xl border border-gray-100 ring-1 ring-gray-50/50 shadow-xs backdrop-blur-sm">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">Stock Inventory</h2>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none">
                        Monitor and calibrate product stock per outlet.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {isStocksFetching && <Spinner className="size-4 text-green-700" />}

                    <Select value={selectedOutletId} onValueChange={setSelectedOutletId}>
                        <SelectTrigger className="h-10 w-48 bg-white border-gray-100 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all font-bold text-xs uppercase tracking-widest outline-hidden shadow-xs">
                            <SelectValue placeholder="Select Outlet" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl bg-white overflow-hidden">
                            {outlets.map((outlet) => (
                                <SelectItem 
                                    key={outlet.id} 
                                    value={outlet.id} 
                                    className="text-xs font-bold focus:bg-green-50 focus:text-green-900 rounded-lg cursor-pointer py-2.5"
                                >
                                    <div className="flex items-center gap-2">
                                        {outlet.name}
                                        {getOutletStatus(outlet.id) && (
                                            <div className="size-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                        )}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isStocksFetching}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-green-700 hover:border-green-100 hover:bg-green-50/50 shadow-xs transition-all outline-hidden cursor-pointer group"
                    >
                        <RefreshCcw size={15} className="group-active:rotate-180 transition-transform duration-500" />
                    </button>

                    <Button
                        onClick={handleAddStock}
                        disabled={!selectedOutletId}
                        className="bg-green-700 hover:bg-green-600 text-white rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-md shadow-green-900/10 outline-hidden"
                    >
                        <Package className="mr-2 h-4 w-4" />
                        Add Stock
                    </Button>
                </div>
            </div>

            {/* Stock Table */}
            <div className={isStocksFetching && !isStocksLoading ? "opacity-60 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
                {isStocksLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl ring-1 ring-gray-100 gap-4">
                        <Spinner className="size-6 text-green-600" />
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading stock data...</p>
                    </div>
                ) : (
                    <StockTable 
                        stocks={stocks} 
                        onAdjust={handleAdjustTrigger} 
                    />
                )}
            </div>

            <StockAdjustDialog 
                isOpen={isAdjustDialogOpen}
                onOpenChange={closeAdjustDialog}
                stock={selectedStock}
                outletId={selectedOutletId}
                outlets={outlets}
                onSubmit={handleAdjustSubmit}
                isLoading={adjustMutation.isPending}
            />
        </div>
    );
};

export default InventorySection;
