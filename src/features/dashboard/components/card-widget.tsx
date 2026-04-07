import { Card, CardContent } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface CardWidgetProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: string;
        type: 'up' | 'down' | 'neutral';
    };
    className?: string;
    to: string;
}

const CardWidget = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className,
    to
}: CardWidgetProps) => {
    return (
        <Link to={to}>
            <Card className={cn("rounded-2xl border-none shadow-sm transition-all hover:shadow-md group bg-white ring-1 ring-gray-100", className)}>
                <CardContent className="p-6 group-data-[size=sm]/card:p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
                            <div className="text-2xl font-bold tracking-tight text-gray-900">{value}</div>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 transition-all duration-300 group-hover:bg-green-600 group-hover:text-white shrink-0 shadow-sm border border-green-100">
                            <Icon strokeWidth={2.5} size={22} />
                        </div>
                    </div>

                    {(description || trend) && (
                        <div className="mt-4 flex items-center gap-2">
                            {trend && (
                                <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1",
                                    trend.type === 'up' ? "bg-green-100 text-green-700" :
                                        trend.type === 'down' ? "bg-red-100 text-red-700" :
                                            "bg-gray-50/80 text-gray-600"
                                )}>
                                    {trend.type === 'up' && "↑"}
                                    {trend.type === 'down' && "↓"}
                                    {trend.value}
                                </span>
                            )}
                            {description && (
                                <p className="text-[11px] text-muted-foreground font-medium">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
};

export default CardWidget;