import type { ActivityLog } from '@/types/activity-log';
import { cn } from '@/lib/utils';
import { Shield, LogIn, UserCheck, Activity, Database, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityLogTableProps {
    logs: ActivityLog[];
}

const getActionIcon = (action: string) => {
    switch (action.toUpperCase()) {
        case 'LOGIN': return <LogIn size={14} strokeWidth={2.5} />;
        case 'AUTH': return <Shield size={14} strokeWidth={2.5} />;
        case 'UPDATE': return <Activity size={14} strokeWidth={2.5} />;
        case 'DATABASE': return <Database size={14} strokeWidth={2.5} />;
        default: return <UserCheck size={14} strokeWidth={2.5} />;
    }
};

const getActionStyles = (action: string) => {
    switch (action.toUpperCase()) {
        case 'LOGIN': return 'bg-blue-50 text-blue-700 ring-blue-100';
        case 'AUTH': return 'bg-purple-50 text-purple-700 ring-purple-100';
        case 'DELETE': return 'bg-red-50 text-red-700 ring-red-100';
        case 'UPDATE': return 'bg-amber-50 text-amber-700 ring-amber-100';
        case 'ERROR': return 'bg-rose-50 text-rose-700 ring-rose-100';
        default: return 'bg-green-50 text-green-700 ring-green-100';
    }
};

const ActivityLogTable = ({ logs }: ActivityLogTableProps) => {
    return (
        <div className="w-full overflow-hidden rounded-2xl border-none bg-white shadow-xs ring-1 ring-gray-100 transition-all hover:shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100 backdrop-blur-sm">
                            <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Involved User</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap text-center">Performed Action</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap text-center">Category Type</th>
                            <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap text-right">Occurrence Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-20">
                                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                                        <div className="p-3 bg-gray-50 rounded-2xl ring-1 ring-gray-100">
                                            <AlertCircle className="size-6 text-gray-300" />
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium italic">
                                            No activity logs recorded yet.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="group hover:bg-green-50/20 transition-all duration-200">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3.5">
                                            <div className="size-9 rounded-xl bg-green-100/50 flex items-center justify-center text-green-800 font-bold text-xs ring-1 ring-green-200/50 shadow-xs transition-transform group-hover:scale-110">
                                                {log.user.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-bold text-gray-900 truncate leading-none mb-1">{log.user.name}</span>
                                                <span className="text-[10px] text-muted-foreground truncate font-medium tracking-tight">{log.user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ring-1 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 group-hover:shadow-sm",
                                            getActionStyles(log.action)
                                        )}>
                                            {getActionIcon(log.action)}
                                            {log.action}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50/50 px-3 py-1.5 rounded-xl uppercase tracking-widest ring-1 ring-gray-100/50">
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-gray-900 leading-none">
                                                {log.createdAt ? format(new Date(log.createdAt), 'MMM dd, yyyy') : '-'}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-medium tracking-tight">
                                                {log.createdAt ? format(new Date(log.createdAt), 'HH:mm:ss') : '-'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityLogTable;
