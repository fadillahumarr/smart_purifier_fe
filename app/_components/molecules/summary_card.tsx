import { Icon } from "@iconify/react";

type SummaryCardProps = {
    title: string;
    value: string;
    icon: string;
    hint?: string;
};

const SummaryCard = ({
    title,
    value,
    icon,
    hint,
}: SummaryCardProps) => {
    return (
        <div className="rounded-2xl bg-surface p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <p className="text-sm text-muted">{title}</p>
                    <h3 className="text-2xl font-semibold text-foreground">{value}</h3>
                    {hint ? <p className="text-xs text-muted">{hint}</p> : null}
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Icon icon={icon} className="text-2xl" />
                </div>
            </div>
        </div>
    );
}

export default SummaryCard;