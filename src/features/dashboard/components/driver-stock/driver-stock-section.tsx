import { useQuery } from '@tanstack/react-query';
import { getStocksByOutlet } from '@/services/stock-api';
import { useStore } from '@/store/store';
import StockTable from '../inventory/stock-table';
import { Spinner } from '@/components/ui/spinner';
import { Package } from 'lucide-react';

const DriverStockSection = () => {
    const { user } = useStore();
    const outletId = user?.outletId;

    const { 
        data: stocks = [], 
        isLoading,
        error
    } = useQuery({
        queryKey: ['stocks', outletId],
        queryFn: () => getStocksByOutlet(outletId!),
        enabled: !!outletId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Spinner className="size-8 text-green-700" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Inventory Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center bg-red-50 rounded-2xl border border-red-100">
                <p className="text-sm font-bold text-red-600">Failed to load stock data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white/50 p-6 rounded-3xl border border-gray-100 shadow-xs backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 border border-green-100 shadow-sm">
                        <Package size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">Active Inventory</h2>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                            Monitoring stock levels for {user?.outlet?.name || 'Assigned Outlet'}
                        </p>
                    </div>
                </div>
            </div>

            <StockTable stocks={stocks} hideAdjustment={true} />
        </div>
    );
};

export default DriverStockSection;
