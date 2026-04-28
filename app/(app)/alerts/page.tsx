"use client";

import { useEffect, useMemo, useState } from "react";
import AlertsHeader from "@/app/_components/organisms/alerts_header";
import AlertsList from "@/app/_components/organisms/alerts_list";
import Button from "@/app/_components/atoms/button";

import { getAlerts, resolveAlert } from "@/app/lib/api/alerts";
import { AlertResponse } from "@/app/lib/types/alerts";

type AlertFilter = "all" | "active" | "resolved" | "critical";

type AlertItem = {
    id: string;
    title: string;
    message?: string;
    type: string;
    severity: "info" | "warning" | "critical";
    isResolved: boolean;
    createdAt: string;
    resolvedAt?: string | null;
};

function mapAlert(item: AlertResponse): AlertItem {
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
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [filter, setFilter] = useState<AlertFilter>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAlerts() {
            try {
                const data = await getAlerts({
                    status:
                        filter === "all"
                            ? "all"
                            : filter === "critical"
                                ? "all"
                                : filter,
                    severity: filter === "critical" ? "critical" : undefined,
                });

                setAlerts(data.items.map(mapAlert));
            } catch (err) {
                console.error("Failed to load alerts:", err);
            } finally {
                setLoading(false);
            }
        }

        loadAlerts();
    }, [filter]);

    const filteredAlerts = useMemo(() => {
        if (filter === "critical") {
            return alerts.filter((a) => a.severity === "critical");
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

    return (
        <main className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <AlertsHeader />

                {/* FILTER */}
                <section className="flex flex-wrap gap-2">
                    {["all", "active", "resolved", "critical"].map((f) => (
                        <Button
                            key={f}
                            variant="filter"
                            active={filter === f}
                            onClick={() => setFilter(f as AlertFilter)}
                            className="h-10 rounded-xl px-4 capitalize"
                        >
                            {f}
                        </Button>
                    ))}
                </section>

                {/* LIST */}
                {loading ? (
                    <p className="text-sm text-muted">Loading alerts...</p>
                ) : (
                    <AlertsList alerts={filteredAlerts} onResolve={handleResolve} />
                )}
            </div>
        </main>
    );
}