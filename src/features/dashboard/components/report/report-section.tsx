import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { startOfMonth, endOfMonth, format } from "date-fns";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getFinancialReport } from "@/services/report-api";
import { getOutlets } from "@/services/outlet-api";
import type { DateRange } from "@/components/ui/date-picker";
import ReportFilterBar from "./report-filter-bar";
import ReportTable from "./report-table";
import { Spinner } from "@/components/ui/spinner";
import { TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const ReportSection = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });
    const [selectedOutletId, setSelectedOutletId] = useState<string>("ALL");

    // Fetch Outlets
    const { data: outlets = [] } = useQuery({
        queryKey: ["outlets"],
        queryFn: getOutlets,
    });

    // Fetch Report Data
    const { 
        data: reportData, 
        isLoading: isReportLoading,
        isFetching: isReportFetching,
    } = useQuery({
        queryKey: ["financial-report", dateRange, selectedOutletId],
        queryFn: () => getFinancialReport({
            startDate: dateRange?.from?.toISOString(),
            endDate: dateRange?.to?.toISOString(),
            outletId: selectedOutletId === "ALL" ? undefined : selectedOutletId,
        }),
        enabled: !!dateRange?.from,
    });

    const getReportPeriodString = () => {
        if (!dateRange?.from) return "All Time";
        return `${format(dateRange.from, "dd MMM yyyy")} - ${dateRange.to ? format(dateRange.to, "dd MMM yyyy") : ""}`;
    };

    const handleExportExcel = () => {
        if (!reportData?.transactions?.length) return toast.error("No data to export");
        
        const period = getReportPeriodString();
        const outletName = outlets.find(o => o.id === selectedOutletId)?.name || "All Outlets";

        // Build AOA (Array of Arrays) for better layout
        const aoaData = [
            ["FINANCIAL REPORT - POS MATCHA"],
            [`Period: ${period}`],
            [`Outlet: ${outletName}`],
            [`Generated: ${format(new Date(), "dd MMM yyyy HH:mm")}`],
            [], // Empty row
            ["Invoice Number", "Date", "Method", "Status", "Amount", "Outlet ID"], // Headers
            ...reportData.transactions.map(tx => [
                tx.invoiceNumber,
                format(new Date(tx.createdAt), "yyyy-MM-dd HH:mm"),
                tx.paymentMethod,
                tx.paymentStatus,
                tx.totalAmount,
                tx.outletId
            ]),
            [], // Empty row
            ["", "", "", "GRAND TOTAL", reportData.summary.totalRevenue, ""]
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(aoaData);
        
        // Adjust column widths
        worksheet["!cols"] = [
            { wch: 25 }, // Invoice
            { wch: 20 }, // Date
            { wch: 15 }, // Method
            { wch: 15 }, // Status
            { wch: 15 }, // Amount
            { wch: 25 }, // Outlet ID
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, `Financial_Report_${format(new Date(), "yyyyMMdd")}.xlsx`);
        toast.success("Excel report generated! 🍵");
    };

    const handleExportPDF = () => {
        if (!reportData?.transactions?.length) return toast.error("No data to export");

        const doc = new jsPDF();
        const period = getReportPeriodString();
        const outletName = outlets.find(o => o.id === selectedOutletId)?.name || "All Outlets";
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 60, 40);
        doc.text("Financial Report - POS Matcha", 14, 22);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Outlet: ${outletName}`, 14, 30);
        doc.text(`Period: ${period}`, 14, 35);
        doc.text(`Generated: ${format(new Date(), "dd MMM yyyy HH:mm")}`, 14, 40);
        
        const tableData = reportData.transactions.map((tx) => [
            tx.invoiceNumber,
            format(new Date(tx.createdAt), "dd/MM HH:mm"),
            tx.paymentMethod,
            tx.paymentStatus,
            `Rp ${tx.totalAmount.toLocaleString()}`
        ]);

        autoTable(doc, {
            head: [["Invoice", "Date", "Method", "Status", "Amount"]],
            body: tableData,
            startY: 50,
            theme: 'grid',
            headStyles: { fillColor: [40, 60, 40], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [245, 255, 245] },
            foot: [
                ["", "", "", "TOTAL", `Rp ${reportData.summary.totalRevenue.toLocaleString()}`]
            ],
            footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
        });

        doc.save(`Financial_Report_${format(new Date(), "yyyyMMdd")}.pdf`);
        toast.success("PDF report generated! 🍵");
    };

    return (
        <div className="space-y-6">
            <ReportFilterBar 
                dateRange={dateRange}
                onDateChange={setDateRange}
                selectedOutletId={selectedOutletId}
                onOutletChange={setSelectedOutletId}
                outlets={outlets}
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
                isExporting={isReportFetching}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="bg-green-800 text-white border-none shadow-lg shadow-green-900/10 rounded-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={80} />
                    </div>
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-200/80 mb-1">Total Revenue</p>
                        <h3 className="text-2xl font-black tabular-nums">
                            Rp {reportData?.summary?.totalRevenue?.toLocaleString() ?? "0"}
                        </h3>
                    </CardContent>
                </Card>
                <Card className="bg-white border-gray-100 shadow-xs rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transactions</p>
                                <h3 className="text-2xl font-black text-gray-900 tabular-nums">
                                    {reportData?.summary?.totalTransactions ?? "0"}
                                </h3>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <ShoppingBag size={18} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-gray-100 shadow-xs rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Avg Value</p>
                                <h3 className="text-2xl font-black text-gray-900 tabular-nums">
                                    Rp {Math.round(reportData?.summary?.avgTransactionValue ?? 0).toLocaleString()}
                                </h3>
                            </div>
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                <DollarSign size={18} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className={isReportFetching && !isReportLoading ? "opacity-60 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
                {isReportLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-sm rounded-2xl border border-dashed border-gray-200 gap-4">
                        <Spinner className="size-8 text-green-600 opacity-20" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Compiling Records...</p>
                    </div>
                ) : (
                    <ReportTable transactions={reportData?.transactions ?? []} />
                )}
            </div>
        </div>
    );
};

export default ReportSection;
