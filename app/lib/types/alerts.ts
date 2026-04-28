export type AlertResponse = {
    id: string;
    water_purifier_id: string;
    purifier_name?: string | null;
    alert_type: string;
    severity: "info" | "warning" | "critical";
    title: string;
    message?: string | null;
    is_resolved: boolean;
    created_at: string;
    resolved_at?: string | null;
};

export type AlertListResponse = {
    items: AlertResponse[];
};