import { useQuery, useQueries } from "@tanstack/react-query"
import { startOfDay, endOfDay, format } from "date-fns"
import CardWidget from '../card-widget'
import { Banknote, Store, Package } from "lucide-react"
import { getFinancialReport } from "@/services/report-api"
import { getOutlets } from "@/services/outlet-api"
import { getAllProduct } from "@/services/product-api"
import { getStocksByOutlet } from "@/services/stock-api"

const DashboardWidget = () => {
    const today = new Date()
    const todayStr = format(today, 'yyyy-MM-dd') 
    const STALE_TIME = 1000 * 60 * 5; 

    const { data: report } = useQuery({
        queryKey: ["dashboard-revenue", todayStr],
        queryFn: () => getFinancialReport({ 
            startDate: startOfDay(today).toISOString(), 
            endDate: endOfDay(today).toISOString() 
        }),
        staleTime: STALE_TIME
    })

    const { data: outlets = [], isPending: isOutletsPending } = useQuery({
        queryKey: ["outlets"],
        queryFn: getOutlets,
        staleTime: STALE_TIME
    })

    const { data: products = [], isPending: isProductsPending } = useQuery({
        queryKey: ["products"],
        queryFn: getAllProduct,
        staleTime: STALE_TIME
    })

    const stocksQueries = useQueries({
        queries: outlets.map(outlet => ({
            queryKey: ["stocks", outlet.id],
            queryFn: () => getStocksByOutlet(outlet.id),
            staleTime: STALE_TIME,
            enabled: !!outlet.id
        }))
    });

    const isStocksPending = stocksQueries.some(q => q.isPending);
    const allStocks = stocksQueries.flatMap(q => q.data || []);
    
    const lowStockCount = allStocks.filter(s => s.quantity < 10).length;


    const stats = {
        revenue: report?.summary?.totalRevenue,
        outletsCount: outlets.length,
        productsCount: products.length
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CardWidget
                title="Today's Sales"
                value={stats.revenue !== undefined ? `Rp ${Math.round(stats.revenue).toLocaleString()}` : "..."}
                icon={Banknote}
                trend={{ value: "Live", type: "up" }}
                description="daily performance"
                to="/dashboard/reports"
            />
            <CardWidget
                title="Active Outlets"
                value={!isOutletsPending ? stats.outletsCount.toString() : "..."}
                icon={Store}
                trend={{ value: "Operational", type: "neutral" }}
                description="global reach"
                to="/dashboard/outlet"
            />
            <CardWidget
                title="Total Products"
                value={!isProductsPending ? stats.productsCount.toString() : "..."}
                icon={Package}
                trend={{ 
                    value: (!isStocksPending && lowStockCount > 0) ? `${lowStockCount} items low` : "SKU", 
                    type: (!isStocksPending && lowStockCount > 0) ? "down" : "neutral" 
                }}
                description={(!isStocksPending && lowStockCount > 0) ? "requires attention" : "inventory items"}
                to="/dashboard/inventory"
            />
        </div>
    )
}

export default DashboardWidget