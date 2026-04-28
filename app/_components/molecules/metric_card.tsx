import { formatByType } from "@/app/lib/utils/format_number";
import { Icon } from "@iconify/react";

type MetricCardProps = {
    label: string;
    value: string;
    unit?: string;
    icon: string;
    tone?: "primary" | "success" | "warning" | "danger";
    hint?: string;
};

const toneStyles = {
    primary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
};

const MetricCard = ({
    label,
    value,
    unit,
    icon,
    tone = "primary",
    hint,
}: MetricCardProps) => {
    return (
        <div className="rounded-2xl bg-surface p-5 dark:bg-primary/10 border border-border">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <p className="text-sm text-muted">{label}</p>
                    <div className="flex items-end gap-1">
                        <h3 className="text-3xl font-semibold leading-none text-foreground">
                            {formatByType(value)}
                        </h3>
                        {
                            unit ? <span className="text-sm text-muted">{unit}</span> : null
                        }
                    </div>
                    {
                        hint ? <p className="text-xs text-muted">{hint}</p> : null
                    }
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneStyles[tone]}`}>
                    <Icon icon={icon} className="text-2xl" />
                </div>
            </div>
        </div>
    )
}

export default MetricCard;