export const formatByType = (val: string, unit?: string) => {
    if (!val || val === "-") return "-";

    const num = Number(val);
    if (isNaN(num)) return val;

    // pH → 2 decimal
    if (unit === "") return num.toFixed(2);

    // NTU & ppm → 2 decimal
    if (unit === "NTU" || unit === "ppm") return num.toFixed(2);

    // suhu → integer
    if (unit === "°C") return Math.round(num).toString();

    return String(num);
};