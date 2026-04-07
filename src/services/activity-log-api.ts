import api from "./base/api";
import type { ActivityLog } from "@/types/activity-log";

const getAllActivityLogs = async (): Promise<ActivityLog[]> => {
    const response = await api.get("/audit-logs/")
    return response.data;
}

export {
    getAllActivityLogs
}