import { useState } from "react"
import { useStore } from "@/store/store"
import DashboardWidget from "@/features/dashboard/components/sections/dashboard-widget"
import HeaderSection from "@/features/dashboard/components/sections/header-section"
import ActivityLogTable from "@/features/dashboard/components/sections/activity-log-table"
import { useQuery } from "@tanstack/react-query"
import { getAllActivityLogs } from "@/services/activity-log-api"
import { Spinner } from "@/components/ui/spinner"
import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

const Dashboard = () => {
    const { user } = useStore()
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 5

    const { 
        data: logs = [], 
        isLoading, 
        isError, 
        refetch 
    } = useQuery({
        queryKey: ['activity-logs'],
        queryFn: getAllActivityLogs,
    });

    // Pagination Logic
    const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE)
    const paginatedLogs = logs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <HeaderSection
                title="Welcome back,"
                description="Here's what's happening with your store today."
                name={user?.name}
            />
            <DashboardWidget />

            <div className="rounded-2xl border-none ring-1 ring-gray-100 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-none mb-2">Recent Activity</h2>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none">
                            Latest system events and audit logs
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {isLoading ? (
                            <Spinner className="size-4 text-green-700" />
                        ) : (
                            <button 
                                onClick={() => refetch()}
                                className="text-[10px] font-bold text-green-700 hover:text-green-800 transition-colors uppercase tracking-widest cursor-pointer outline-hidden bg-green-50 px-3 py-1.5 rounded-lg ring-1 ring-green-100/50"
                            >
                                Refresh Logs
                            </button>
                        )}
                    </div>
                </div>

                {isError ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-red-50/50 rounded-2xl border border-red-100 border-dashed space-y-4">
                        <p className="text-sm text-red-700 font-bold italic">Oops! System couldn't reach audit service.</p>
                        <Button 
                            onClick={() => refetch()} 
                            variant="outline" 
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                        >
                            <RefreshCcw size={12} className="mr-2" />
                            Retry Connection
                        </Button>
                    </div>
                ) : (
                    <div className={isLoading ? "opacity-50 pointer-events-none transition-all duration-300" : "transition-all duration-300"}>
                        <ActivityLogTable logs={paginatedLogs} />
                        
                        {!isLoading && logs.length > 0 && totalPages > 1 && (
                            <div className="mt-8 pt-6 border-t border-gray-50">
                                <Pagination>
                                    <PaginationContent className="flex-wrap justify-center sm:justify-end gap-2">
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
                )}
            </div>
        </div>
    )
}

export default Dashboard
