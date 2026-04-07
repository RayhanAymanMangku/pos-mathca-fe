export interface ActivityLogUser {
    name: string;
    email: string;
}

export interface ActivityLog {
    id: string;
    action: string;
    type: string;
    entityId: string;
    user: ActivityLogUser;
    createdAt: string;
}

export interface ActivityLogMeta {
    page: number;
    limit: number;
    total?: number;
}

export interface ActivityLogResponse {
    status: string;
    data: ActivityLog[];
    meta: ActivityLogMeta;
}
