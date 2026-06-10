import { useEffect, useState } from "react";

import { getDashboardSummary } from "@/app/lib/api/purifiers";
import { DashboardSummaryResponse } from "@/app/lib/types/dashboard";

export const usePurifiersDashboard = () => {
    const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            try {
                setLoading(true);

                const summaryData = await getDashboardSummary();

                if (!isMounted) return;

                setSummary(summaryData);
            } catch (err) {
                console.error("Failed to load dashboard:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    const openAddModal = () => setIsAddOpen(true);
    const closeAddModal = () => setIsAddOpen(false);

    return {
        summary,
        loading,
        isAddOpen,
        openAddModal,
        closeAddModal,
    };
};