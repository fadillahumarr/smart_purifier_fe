import LiveBadge from "../molecules/live_badge";

type RealtimeHeaderProps = {
    purifierName: string;
    deviceStatus: "online" | "offline" | "degraded";
    lastUpdated: string;
};

const statusStyles = {
    online: "bg-success/10 text-success",
    offline: "bg-danger/10 text-danger",
    degraded: "bg-warning/10 text-warning",
};

const RealtimeHeader = ({
    purifierName,
    deviceStatus,
    lastUpdated,
}: RealtimeHeaderProps) => {
    return (
        <div className="rounded-2xl border border-border bg-surface p-5 dark:bg-background">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-foreground">
                        Realtime Monitoring
                    </h2>
                    <p className="text-sm text-muted">
                        Live overview for{" "}
                        <span className="font-medium text-foreground">{purifierName}</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <LiveBadge />

                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[deviceStatus]}`}
                    >
                        {deviceStatus}
                    </span>

                    <div className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                        Last updated: {lastUpdated}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealtimeHeader;