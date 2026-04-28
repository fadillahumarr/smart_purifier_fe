"use client";

import SectionTitle from "../atoms/section_title";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type ChartData = {
    time: string;
    turbidity: number;
    tds: number;
    ph: number;
    temperature: number;
};

type RealtimeSettlingChartProps = {
    data: ChartData[];
};

const RealtimeSettlingChart = ({ data }: RealtimeSettlingChartProps) => {
    return (
        <div className="rounded-2xl border border-border bg-surface p-5 dark:bg-background">
            <div className="flex items-center justify-between">
                <SectionTitle
                    title="Settling Water Trend"
                    subtitle="Realtime monitoring for turbidity, TDS, pH, and temperature"
                />
                <span className="text-xs text-muted">Auto-updating</span>
            </div>

            <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid
                            stroke="var(--border)"
                            strokeDasharray="3 3"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 12, fill: "var(--muted)" }}
                            axisLine={{ stroke: "var(--border)" }}
                            tickLine={{ stroke: "var(--border)" }}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: "var(--muted)" }}
                            axisLine={{ stroke: "var(--border)" }}
                            tickLine={{ stroke: "var(--border)" }}
                            width={44}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: "12px",
                                color: "var(--foreground)",
                                fontSize: "12px",
                            }}
                            formatter={(value, name) => {
                                if (name === "turbidity") return [`${value} NTU`, "Turbidity"];
                                if (name === "tds") return [`${value} ppm`, "TDS"];
                                if (name === "ph") return [value, "pH"];
                                if (name === "temperature") return [`${value} °C`, "Temperature"];
                                return [value, name];
                            }}
                        />
                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="turbidity"
                            name="Turbidity"
                            stroke="var(--secondary)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="tds"
                            name="TDS"
                            stroke="var(--primary)"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="ph"
                            name="pH"
                            stroke="var(--success)"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="temperature"
                            name="Temperature"
                            stroke="var(--warning)"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RealtimeSettlingChart;