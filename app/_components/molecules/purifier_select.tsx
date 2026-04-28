"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

type PurifierOption = {
    id: string;
    name: string;
    device_code?: string | null;
};

type PurifierSelectProps = {
    value: string;
    options: PurifierOption[];
    loading?: boolean;
    onChange: (id: string) => void;
};

const getPurifierLabel = (item: PurifierOption) => {
    return item.device_code ? `${item.name} - ${item.device_code}` : item.name;
};

const PurifierSelect = ({
    value,
    options,
    loading = false,
    onChange,
}: PurifierSelectProps) => {
    const [open, setOpen] = useState(false);

    const selected = options.find((item) => item.id === value);
    const disabled = loading || options.length === 0;

    return (
        <div className="relative w-full">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 text-left text-sm font-medium text-foreground shadow-sm transition hover:border-secondary/50 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-background"
            >
                <span className="truncate">
                    {loading
                        ? "Loading purifiers..."
                        : selected
                            ? getPurifierLabel(selected)
                            : "No purifier available"}
                </span>

                <Icon
                    icon="mdi:chevron-down"
                    className={`ml-3 text-xl text-muted transition ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && !disabled && (
                <>
                    <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />

                    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-card dark:bg-background">
                        {options.map((item) => {
                            const active = item.id === value;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(item.id);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition ${active
                                            ? "bg-secondary/10 text-secondary"
                                            : "text-foreground hover:bg-tertiary/40"
                                        }`}
                                >
                                    <span className="truncate">{getPurifierLabel(item)}</span>

                                    {active && <Icon icon="mdi:check" className="text-lg" />}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default PurifierSelect;