import { useEffect, useMemo, useState } from "react";

import { getAlerts, resolveAlert } from "@/app/lib/api/alerts";
import { AlertResponse } from "@/app/lib/types/alerts";

export type AlertFilter = "all" | "active" | "resolved" | "critical";

export type AlertItem = {
    id: string;
    title: string;
    message?: string;
    type: string;
    severity: "info" | "warning" | "critical";
    isResolved: boolean;
    createdAt: string;
    resolvedAt?: string | null;
};

const mapAlert = (item: AlertResponse): AlertItem => {
    return {
        id: item.id,
        title: item.title,
        message: item.message ?? "",
        type: item.alert_type,
        severity: item.severity,
        isResolved: item.is_resolved,
        createdAt: new Date(item.created_at).toLocaleString(),
        resolvedAt: item.resolved_at
            ? new Date(item.resolved_at).toLocaleString()
            : null,
    };
};

export const useAlertsData = () => {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [filter, setFilter] = useState<AlertFilter>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadAlerts = async () => {
            try {
                setLoading(true);

                const data = await getAlerts({
                    status:
                        filter === "all"
                            ? "all"
                            : filter === "critical"
                                ? "all"
                                : filter,
                    severity: filter === "critical" ? "critical" : undefined,
                });

                if (!isMounted) return;

                setAlerts(data.items.map(mapAlert));
            } catch (err) {
                console.error("Failed to load alerts:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadAlerts();

        return () => {
            isMounted = false;
        };
    }, [filter]);

    const filteredAlerts = useMemo(() => {
        if (filter === "critical") {
            return alerts.filter((alert) => alert.severity === "critical");
        }

        return alerts;
    }, [alerts, filter]);

    const handleResolve = async (id: string) => {
        try {
            await resolveAlert(id);

            setAlerts((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            isResolved: true,
                            resolvedAt: new Date().toLocaleString(),
                        }
                        : item
                )
            );
        } catch (err) {
            console.error("Resolve alert failed:", err);
        }
    };

    return {
        alerts,
        filteredAlerts,
        filter,
        setFilter,
        loading,
        handleResolve,
    };
};