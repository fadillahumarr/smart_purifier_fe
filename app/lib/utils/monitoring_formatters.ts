export const normalizeUtcDateString = (value?: string | null) => {
    if (!value) return null;

    const hasTimezone = value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value);
    return hasTimezone ? value : `${value}Z`;
};

export const parseBackendDate = (value?: string | null) => {
    const normalized = normalizeUtcDateString(value);
    if (!normalized) return null;

    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const formatValue = (value?: number | null) => {
    if (value === null || value === undefined) return "-";
    return String(value);
};

export const formatDateTime = (value?: string | null) => {
    const date = parseBackendDate(value);
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

export const formatTime = (value?: string | null) => {
    const date = parseBackendDate(value);
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
};

export const formatSeconds = (seconds?: number | null) => {
    if (seconds === null || seconds === undefined) return "-";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return [h, m, s].map((item) => String(item).padStart(2, "0")).join(":");
};

export const formatStage = (stage?: string | null) => {
    if (!stage) return "Idle";

    return stage
        .split("_")
        .map((word) => word[0]?.toUpperCase() + word.slice(1))
        .join(" ");
};