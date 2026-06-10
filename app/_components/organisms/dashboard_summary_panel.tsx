import SummaryCard from "../molecules/summary_card";

type DashboardSummaryPanelProps = {
    totalPurifiers?: number;
    onlinePurifiers?: number;
    offlinePurifiers?: number;
    activeAlerts?: number;
    loading?: boolean;
};

const DashboardSummaryPanel = ({
    totalPurifiers,
    onlinePurifiers,
    offlinePurifiers,
    activeAlerts,
    loading = false,
}: DashboardSummaryPanelProps) => {
    const display = (value?: number) => {
        if (loading) return "...";
        if (value === undefined || value === null) return "0";
        return value.toString();
    };

    return (
        <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
            <SummaryCard
                title="Total Purifiers"
                value={display(totalPurifiers)}
                icon="material-symbols:air-purifier-outline-rounded"
                hint="Registered devices"
            />

            <SummaryCard
                title="Online Purifiers"
                value={display(onlinePurifiers)}
                icon="mdi:wifi-check"
                hint="Currently active"
            />

            <SummaryCard
                title="Offline Purifiers"
                value={display(offlinePurifiers)}
                icon="mdi:wifi-off"
                hint="Currently offline"
            />

            <SummaryCard
                title="Active Alerts"
                value={display(activeAlerts)}
                icon="fluent:alert-16-regular"
                hint="Need attention"
            />
        </section>
    );
};

export default DashboardSummaryPanel;