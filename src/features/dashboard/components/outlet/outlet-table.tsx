import type { Outlet } from '@/types/outlet';
import { cn } from '@/lib/utils';
import { 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Store,
    MapPin,
    History,
    LayoutDashboard
} from 'lucide-react';
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from '@/components/ui/popover';

interface OutletTableProps {
    outlets: Outlet[];
    onEdit: (outlet: Outlet) => void;
    onDelete: (id: string) => void;
    onViewDetail: (outlet: Outlet) => void;
}

const OutletTable = ({ outlets, onEdit, onDelete, onViewDetail }: OutletTableProps) => {
    return (
        <div className="w-full overflow-hidden rounded-2xl border-none bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Store Information</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Branch Address</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Performance</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Status</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {outlets.map((outlet) => (
                            <tr key={outlet.id} className="group hover:bg-green-50/30 transition-colors duration-200">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-green-700 font-bold text-xs ring-1 ring-green-100 shadow-sm group-hover:scale-105 transition-transform">
                                            {outlet.name.charAt(0)}
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-sm font-bold text-gray-900 group-hover:text-green-800 transition-colors block">
                                                {outlet.name}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 uppercase tracking-wider">
                                                <History size={10} />
                                                Updated {new Date(outlet.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 max-w-[280px]">
                                        <MapPin size={14} className="text-gray-300 shrink-0" />
                                        <span className="text-sm text-gray-600 truncate leading-relaxed">
                                            {outlet.address}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <button 
                                        onClick={() => onViewDetail(outlet)}
                                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-green-50/50 border border-green-100/50 text-[10px] font-bold text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-md transition-all duration-300 group cursor-pointer outline-hidden"
                                    >
                                        <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" />
                                        View Details
                                    </button>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={cn(
                                        "inline-flex items-center rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-widest ring-1",
                                        outlet.status 
                                            ? "bg-green-50 text-green-700 ring-green-100" 
                                            : "bg-gray-50 text-gray-400 ring-gray-100"
                                    )}>
                                        <div className={cn("size-1.5 rounded-full mr-2", 
                                            outlet.status ? "bg-green-600" : "bg-gray-400"
                                        )} />
                                        {outlet.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="h-9 w-9 inline-flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm ring-1 ring-transparent hover:ring-gray-100 text-gray-400 hover:text-gray-900 transition-all cursor-pointer outline-hidden">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" className="w-40 p-1.5 rounded-2xl border-none shadow-xl ring-1 ring-gray-100 bg-white">
                                            <div className="space-y-1">
                                                <button 
                                                    onClick={() => onViewDetail(outlet)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all cursor-pointer outline-hidden"
                                                >
                                                    <LayoutDashboard size={14} />
                                                    View History
                                                </button>
                                                <button 
                                                    onClick={() => onEdit(outlet)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all cursor-pointer outline-hidden"
                                                >
                                                    <Pencil size={14} />
                                                    Edit Store
                                                </button>
                                                <button 
                                                    onClick={() => onDelete(outlet.id)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer outline-hidden"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {outlets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50/30">
                    <div className="h-16 w-16 rounded-[2rem] bg-gray-100 flex items-center justify-center text-gray-300 mb-4 ring-1 ring-gray-200">
                        <Store size={32} />
                    </div>
                    <p className="text-sm text-gray-900 font-bold tracking-tight">No Outlets Available</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Get started by adding your first outlet location.</p>
                </div>
            )}
        </div>
    );
};

export default OutletTable;
