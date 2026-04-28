import { Icon } from "@iconify/react";

type SensorStatus = "normal" | "warning" | "danger";

type SensorItemProps = {
    label: string;
    value: string;
    unit?: string;
    icon?: string;
    status?: SensorStatus;
};

const statusColor: Record<SensorStatus, string> = {
    normal: "text-success",
    warning: "text-warning",
    danger: "text-danger",
};

const SensorItem = ({
    label,
    value,
    unit,
    icon,
    status = "normal",
}: SensorItemProps) => {
    return (
        <div className="flex items-center justify-between border-b border-border py-4 last:border-none">
            {/* LEFT */}
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                        <Icon icon={icon} className="text-lg" />
                    </div>
                )}
                <span className="text-sm text-muted">{label}</span>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-1">
                <span className={`text-sm font-semibold ${statusColor[status]}`}>
                    {value}
                </span>
                {unit && <span className="text-xs text-muted">{unit}</span>}
            </div>
        </div>
    );
};

export default SensorItem;