import api from "./base/api";
import type { ReportFilter, FinancialReportResponse } from "@/types/report";


export const getFinancialReport = async (filters: ReportFilter): Promise<FinancialReportResponse> => {
    const response = await api.get<FinancialReportResponse>(`/reports/financial`, { 
        params: {
            startDate: filters.startDate,
            endDate: filters.endDate,
            outletId: filters.outletId
        }
    });

    return response.data;
};
