import type { Transaction } from "./transaction";

export interface ReportFilter {
    startDate?: string;
    endDate?: string;  
    outletId?: string;
}

export interface FinancialReportResponse {
    transactions: (Transaction & { 
        outletName: string; 
        cashierName: string; 
        itemCount: number; 
    })[];
    summary: {
        totalRevenue: number;
        totalTransactions: number;
        avgTransactionValue: number;
    };
}
