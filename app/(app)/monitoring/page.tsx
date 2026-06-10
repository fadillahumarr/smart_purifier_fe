"use client";

import MonitoringTopbar from "@/app/_components/organisms/monitoring_topbar";
import MonitoringTabs from "@/app/_components/organisms/monitoring_tabs";
import MonitoringOverview from "@/app/_components/organisms/monitoring_overview";
import HistoryTable from "@/app/_components/organisms/history_table";

import { useMonitoringData } from "@/app/lib/hooks/use_monitoring_data";

const MonitoringPage = () => {
    const {
        activeTab,
        setActiveTab,
        purifierOptions,
        selectedPurifierId,
        setSelectedPurifierId,
        isLoading,
        isLoadingPurifiers,
        isLoadingHistory,
        error,
        hasPurifiers,
        overviewData,
        historyItems,
    } = useMonitoringData();

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-4 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl text-base">
                    Loading monitoring data...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-4 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl text-base">{error}</div>
            </main>
        );
    }

    if (!hasPurifiers) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl text-base">
                    No purifier registered yet.
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <MonitoringTopbar
                    selectedPurifierId={selectedPurifierId}
                    purifierOptions={purifierOptions}
                    loading={isLoadingPurifiers}
                    onPurifierChange={setSelectedPurifierId}
                />

                <MonitoringTabs activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === "overview" && <MonitoringOverview {...overviewData} />}

                {activeTab === "history" &&
                    (isLoadingHistory ? (
                        <div className="rounded-3xl border border-border bg-surface p-6 text-sm text-muted">
                            Loading history data...
                        </div>
                    ) : (
                        <HistoryTable items={historyItems} />
                    ))}
            </div>
        </main>
    );
};

export default MonitoringPage;