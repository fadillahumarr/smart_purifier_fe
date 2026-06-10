import { Icon } from "@iconify/react";
import Badge from "../atoms/badge";
import Button from "../atoms/button";

type AlertSeverity = "info" | "warning" | "critical";

type AlertItemProps = {
    id: string;
    title: string;
    message?: string;
    createdAt: string;
    resolvedAt?: string | null;
    type?: string;
    severity?: AlertSeverity;
    isResolved?: boolean;
    onResolve?: (id: string) => void;
};

const labelMap: Record<AlertSeverity, string> = {
    info: "Info",
    warning: "Warning",
    critical: "Critical",
};

const iconMap: Record<AlertSeverity, string> = {
    info: "mdi:information-outline",
    warning: "mdi:alert-outline",
    critical: "mdi:alert-circle-outline",
};

const badgeVariantMap: Record<AlertSeverity, "neutral" | "warning" | "danger"> = {
    info: "neutral",
    warning: "warning",
    critical: "danger",
};

const AlertItem = ({
    id,
    title,
    message,
    createdAt,
    resolvedAt,
    type,
    severity = "warning",
    isResolved = false,
    onResolve,
}: AlertItemProps) => {
    return (
        <div className="flex flex-col gap-4 bg-surface rounded-xl border border-border px-4 py-4 transition dark:bg-background hover:border-secondary/40">
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <div className="mt-0.5 text-muted">
                        <Icon icon={iconMap[severity]} className="text-xl" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{title}</p>

                        {message && (
                            <p className="text-xs leading-relaxed text-muted">
                                {message}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                            <span>{createdAt}</span>

                            {type && (
                                <span className="rounded-full border border-border px-2 py-0.5">
                                    {type}
                                </span>
                            )}

                            <span
                                className={`rounded-full px-2 py-0.5 ${isResolved
                                        ? "bg-success/10 text-success"
                                        : "bg-warning/10 text-warning"
                                    }`}
                            >
                                {isResolved ? "Resolved" : "Active"}
                            </span>

                            {isResolved && resolvedAt && (
                                <span className="rounded-full border border-border px-2 py-0.5">
                                    Resolved at {resolvedAt}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <Badge
                    label={labelMap[severity]}
                    variant={badgeVariantMap[severity]}
                />
            </div>

            {!isResolved && onResolve && (
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        className="h-9 border border-border px-3"
                        onClick={() => onResolve(id)}
                    >
                        Resolve
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AlertItem;