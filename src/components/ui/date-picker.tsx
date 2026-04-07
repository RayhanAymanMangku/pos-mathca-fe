import * as React from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DateRange {
    from: Date | undefined
    to?: Date | undefined
}

interface DatePickerProps {
    date?: DateRange
    onDateChange?: (date: DateRange | undefined) => void
    className?: string
}

export function DatePickerWithRange({
    date,
    onDateChange,
    className,
}: DatePickerProps) {
    const [month, setMonth] = React.useState(new Date())

    const days = React.useMemo(() => {
        const start = startOfMonth(month)
        const end = endOfMonth(month)
        return eachDayOfInterval({ start, end })
    }, [month])

    const handleDayClick = (day: Date) => {
        if (!date?.from || (date.from && date.to)) {
            onDateChange?.({ from: startOfDay(day), to: undefined })
        } else if (day < date.from) {
            onDateChange?.({ from: startOfDay(day), to: undefined })
        } else {
            onDateChange?.({ from: date.from, to: endOfDay(day) })
        }
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-bold text-xs uppercase tracking-widest rounded-xl bg-white border-gray-100 h-11 shadow-xs hover:bg-gray-50 transition-all",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 text-green-700" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 rounded-2xl border-gray-100 shadow-xl bg-white" align="start">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <button 
                                onClick={() => setMonth(subMonths(month, 1))}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-900">
                                {format(month, "MMMM yyyy")}
                            </span>
                            <button 
                                onClick={() => setMonth(addMonths(month, 1))}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                                <span key={day} className="text-[10px] font-black text-gray-400 uppercase py-1">
                                    {day}
                                </span>
                            ))}
                            {/* Empty pads for first day of month */}
                            {Array.from({ length: startOfMonth(month).getDay() }).map((_, i) => (
                                <div key={`pad-${i}`} />
                            ))}
                            {days.map((day) => {
                                const isSelected = (date?.from && isSameDay(day, date.from)) || (date?.to && isSameDay(day, date.to))
                                const isRange = date?.from && date?.to && isWithinInterval(day, { start: date.from, end: date.to })
                                
                                return (
                                    <button
                                        key={day.toString()}
                                        onClick={() => handleDayClick(day)}
                                        className={cn(
                                            "h-9 w-9 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center",
                                            isSelected ? "bg-green-800 text-white shadow-md shadow-green-900/20" : 
                                            isRange ? "bg-green-50 text-green-800 rounded-none first:rounded-l-lg last:rounded-r-lg" :
                                            "hover:bg-gray-50 text-gray-700"
                                        )}
                                    >
                                        {format(day, "d")}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
