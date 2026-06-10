import { Icon } from "@iconify/react";

type PurifierCardProps = {
    id: string;
    name: string;
    location: string;
    macAddress: string;
    deviceCode: string;
    mqttTopicBase: string;
    firmwareVersion: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
};

const PurifierCard = ({
    id,
    name,
    location,
    macAddress,
    deviceCode,
    mqttTopicBase,
    firmwareVersion,
    onEdit,
    onDelete,
}: PurifierCardProps) => {
    return (
        <div className="group rounded-3xl border border-border bg-surface p-6 transition-all duration-300 hover:border-secondary/40 hover:shadow-card dark:bg-background">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                            <Icon
                                icon="material-symbols:air-purifier-outline-rounded"
                                className="text-3xl"
                            />
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-xl font-semibold text-foreground">
                                {name}
                            </h3>
                            <p className="mt-1 truncate text-sm text-muted">
                                {location}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            Device Code
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {deviceCode}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            Firmware
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {firmwareVersion || "-"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            MAC Address
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {macAddress || "-"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            MQTT Topic
                        </p>
                        <p className="mt-2 break-all text-sm font-semibold text-foreground">
                            {mqttTopicBase}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t border-border pt-4">
                    <div className="flex items-center gap-2 ">
                        <button
                            type="button"
                            onClick={() => onEdit(id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted cursor-pointer transition hover:bg-tertiary/30 hover:text-foreground"
                            aria-label="Edit purifier"
                            title="Edit"
                        >
                            <Icon icon="mdi:pencil-outline" className="text-lg" />
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted cursor-pointer transition hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
                            aria-label="Delete purifier"
                            title="Delete"
                        >
                            <Icon icon="mdi:trash-can-outline" className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurifierCard;