import AlertItem from "../molecules/alert_item";

type Alert = {
    id: string;
    title: string;
    message?: string;
    type: string;
    severity: "info" | "warning" | "critical";
    isResolved: boolean;
    createdAt: string;
    resolvedAt?: string | null;
};

type AlertsListProps = {
    alerts: Alert[];
    onResolve: (id: string) => void;
};

const AlertsList = ({ alerts, onResolve }: AlertsListProps) => {
    if (alerts.length === 0) {
        return (
            <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center dark:bg-background">
                <h3 className="text-lg font-semibold text-foreground">
                    No alerts found
                </h3>
                <p className="mt-2 text-sm text-muted">
                    There are no alerts matching the current filter.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {alerts.map((alert) => (
                <AlertItem
                    key={alert.id}
                    id={alert.id}
                    title={alert.title}
                    message={alert.message}
                    type={alert.type}
                    severity={alert.severity}
                    isResolved={alert.isResolved}
                    createdAt={alert.createdAt}
                    resolvedAt={alert.resolvedAt}
                    onResolve={onResolve}
                />
            ))}
        </div>
    );
};

export default AlertsList;