import {
    formatDateTime,
    formatSeconds,
} from "@/app/lib/utils/monitoring_formatters";

type Props = {
    duration: string;
    startedAt?: string | null;
    endsAt?: string | null;
    countdownSeconds?: number | null;
};

const MonitoringMixingCountdown = ({
    duration,
    startedAt,
    endsAt,
    countdownSeconds,
}: Props) => {
    return (
        <section className="rounded-3xl border border-border bg-surface px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-foreground">
                        Mixing in progress
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Moringa mixing countdown
                    </p>

                    <p className="mt-1 text-xs text-muted">
                        Duration: {duration} • Started: {formatDateTime(startedAt)} • Ends:{" "}
                        {formatDateTime(endsAt)}
                    </p>
                </div>

                <p className="font-mono text-xl font-semibold text-foreground md:text-2xl">
                    {formatSeconds(countdownSeconds)}
                </p>
            </div>
        </section>
    );
};

export default MonitoringMixingCountdown;