"use client";

import { useEffect, useMemo, useState } from "react";
import MonitoringTopbar from "@/app/_components/organisms/monitoring_topbar";
import MonitoringTabs from "@/app/_components/organisms/monitoring_tabs";
import RealtimeHeader from "@/app/_components/organisms/monitoring_header";
import MetricCard from "@/app/_components/molecules/metric_card";
import CurrentProcessPanel from "@/app/_components/organisms/current_process_panel";
import RealtimeSettlingChart from "@/app/_components/organisms/monitoring_realtime_settling_chart";
import AiDecisionCard from "@/app/_components/organisms/ai_decision_card";
import CycleResultCard from "@/app/_components/organisms/cycle_result_card";
import HistoryTable from "@/app/_components/organisms/history_table";
import LiveReadingsPanel from "@/app/_components/organisms/monitoring_raw_water_panel";

import { getPurifiers } from "@/app/lib/api/purifiers";
import {
    getMonitoringRealtime,
    getMonitoringSummary,
} from "@/app/lib/api/monitoring";
import { getMonitoringWebSocketUrl } from "@/app/lib/api/monitoring_ws";

import { PurifierResponse } from "@/app/lib/types/purifiers";
import {
    MonitoringRealtimeResponse,
    MonitoringSummaryResponse,
} from "@/app/lib/types/monitoring";
import { getCycleHistory } from "@/app/lib/api/cycle_history";
import { CycleHistoryItem } from "@/app/lib/types/cycle_history";

type MonitoringTab = "overview" | "history";

type ChartItem = {
    time: string;
    turbidity: number;
    tds: number;
    ph: number;
    temperature: number;
};

const normalizeUtcDateString = (value: string | null | undefined) => {
    if (!value) return null;

    const hasTimezone =
        value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value);

    return hasTimezone ? value : `${value}Z`;
};

const parseBackendDate = (value: string | null | undefined) => {
    const normalized = normalizeUtcDateString(value);
    if (!normalized) return null;

    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return null;

    return date;
};

const formatValue = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-";
    return String(value);
};

const formatDateTime = (value: string | null | undefined) => {
    const date = parseBackendDate(value);
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

const formatTime = (value: string | null | undefined) => {
    const date = parseBackendDate(value);
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
};

const formatSeconds = (seconds: number | null | undefined) => {
    if (seconds === null || seconds === undefined) return "-";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return [h, m, s].map((item) => String(item).padStart(2, "0")).join(":");
};

const formatStage = (stage: string | null | undefined) => {
    if (!stage) return "Idle";

    return stage
        .split("_")
        .map((word) => word[0]?.toUpperCase() + word.slice(1))
        .join(" ");
};

const getRemainingMixingSeconds = (
    mixingStartedAt: string | null | undefined,
    durationSeconds: number | null | undefined
) => {
    if (!mixingStartedAt || !durationSeconds) return null;

    const startedAt = parseBackendDate(mixingStartedAt);
    if (!startedAt) return null;

    const elapsedSeconds = Math.floor(
        (Date.now() - startedAt.getTime()) / 1000
    );

    return Math.max(durationSeconds - elapsedSeconds, 0);
};

const getMixingEndTime = (
    mixingStartedAt: string | null | undefined,
    durationSeconds: number | null | undefined
) => {
    if (!mixingStartedAt || !durationSeconds) return null;

    const startedAt = parseBackendDate(mixingStartedAt);
    if (!startedAt) return null;

    return new Date(startedAt.getTime() + durationSeconds * 1000).toISOString();
};

const mapChartData = (
    realtime: MonitoringRealtimeResponse | null
): ChartItem[] => {
    if (!realtime) return [];

    return realtime.settling_trend.map((item) => ({
        time: formatTime(item.time),
        turbidity: item.turbidity ?? 0,
        tds: item.tds ?? 0,
        ph: item.ph ?? 0,
        temperature: item.temperature ?? 0,
    }));
};

export default function MonitoringPage() {
    const [activeTab, setActiveTab] = useState<MonitoringTab>("overview");
    const [history, setHistory] = useState<CycleHistoryItem[]>([]);
    const [purifierOptions, setPurifierOptions] = useState<
        { id: string; name: string }[]
    >([]);
    const [selectedPurifierId, setSelectedPurifierId] = useState<string>("");
    const [summary, setSummary] = useState<MonitoringSummaryResponse | null>(
        null
    );
    const [realtime, setRealtime] = useState<MonitoringRealtimeResponse | null>(
        null
    );
    const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);
    const [isLoadingPurifiers, setIsLoadingPurifiers] = useState(true);
    const [isLoadingMonitoring, setIsLoadingMonitoring] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const settlingChartData = useMemo(() => mapChartData(realtime), [realtime]);

    useEffect(() => {
        let isMounted = true;

        const loadPurifiers = async () => {
            try {
                setIsLoadingPurifiers(true);
                setError(null);

                const data: PurifierResponse[] = await getPurifiers();

                if (!isMounted) return;

                const options = data.map((item) => ({
                    id: item.id,
                    name: item.name,
                }));

                setPurifierOptions(options);

                if (options.length > 0) {
                    setSelectedPurifierId(options[0].id);
                }
            } catch {
                if (isMounted) {
                    setError("Failed to load purifier list.");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingPurifiers(false);
                }
            }
        };

        loadPurifiers();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!selectedPurifierId) return;

        let isMounted = true;

        const loadInitialMonitoringData = async () => {
            try {
                setIsLoadingMonitoring(true);
                setError(null);

                const [summaryData, realtimeData, historyData] =
                    await Promise.all([
                        getMonitoringSummary(selectedPurifierId),
                        getMonitoringRealtime(selectedPurifierId, 5),
                        getCycleHistory(selectedPurifierId, 20),
                    ]);

                if (!isMounted) return;

                setSummary(summaryData);
                setRealtime(realtimeData);
                setHistory(historyData.items);
            } catch {
                if (isMounted) {
                    setError("Failed to load monitoring data.");
                    setSummary(null);
                    setRealtime(null);
                    setCountdownSeconds(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingMonitoring(false);
                }
            }
        };

        loadInitialMonitoringData();

        return () => {
            isMounted = false;
        };
    }, [selectedPurifierId]);

    useEffect(() => {
        if (!selectedPurifierId) return;

        const ws = new WebSocket(getMonitoringWebSocketUrl(selectedPurifierId));

        ws.onopen = () => {
            console.log("Monitoring WebSocket connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            setRealtime((prev) => {
                if (!prev) return prev;

                const trendItem = {
                    time: data.recorded_at,
                    tds: data.tds ?? null,
                    turbidity: data.turbidity ?? null,
                    ph: data.ph ?? null,
                    temperature: data.temperature ?? null,
                    water_volume: data.water_volume ?? null,
                };

                return {
                    ...prev,
                    settling_realtime: {
                        tds: {
                            value:
                                data.tds ??
                                prev.settling_realtime.tds.value,
                            unit: "ppm",
                            recorded_at: data.recorded_at,
                        },

                        turbidity: {
                            value:
                                data.turbidity ??
                                prev.settling_realtime.turbidity.value,
                            unit: "NTU",
                            recorded_at: data.recorded_at,
                        },

                        ph: {
                            value:
                                data.ph ??
                                prev.settling_realtime.ph.value,
                            unit: "",
                            recorded_at: data.recorded_at,
                        },

                        temperature: {
                            value:
                                data.temperature ??
                                prev.settling_realtime.temperature.value,
                            unit: "°C",
                            recorded_at: data.recorded_at,
                        },

                        water_volume: {
                            value:
                                data.water_volume ??
                                prev.settling_realtime.water_volume.value,
                            unit: "L",
                            recorded_at: data.recorded_at,
                        },
                    },

                    settling_trend: [
                        ...prev.settling_trend,
                        trendItem,
                    ].slice(-100),
                };
            });
        };

        ws.onerror = (event) => {
            console.error("Monitoring WebSocket error:", event);
        };

        ws.onclose = () => {
            console.log("Monitoring WebSocket disconnected");
        };

        return () => {
            ws.close();
        };
    }, [selectedPurifierId]);

    useEffect(() => {
        if (!selectedPurifierId) return;

        const loadSummary = async () => {
            try {
                const data = await getMonitoringSummary(selectedPurifierId);
                setSummary(data);
            } catch {
            }
        };

        const interval = setInterval(loadSummary, 5000);

        return () => clearInterval(interval);
    }, [selectedPurifierId]);

    useEffect(() => {
        if (summary?.current_cycle?.current_stage !== "mixing") {
            setCountdownSeconds(null);
            return;
        }

        const updateCountdown = () => {
            const remaining = getRemainingMixingSeconds(
                summary.current_cycle?.mixing_started_at,
                summary.ai_decision?.recommended_mixing_duration_seconds
            );

            setCountdownSeconds(remaining);
        };

        updateCountdown();

        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [
        summary?.current_cycle?.current_stage,
        summary?.current_cycle?.mixing_started_at,
        summary?.ai_decision?.recommended_mixing_duration_seconds,
    ]);

    useEffect(() => {
        if (!selectedPurifierId || activeTab !== "history") return;

        const loadHistory = async () => {
            const data = await getCycleHistory(selectedPurifierId, 20);
            setHistory(data.items);
        };

        loadHistory();

        const interval = setInterval(loadHistory, 15000);

        return () => clearInterval(interval);
    }, [selectedPurifierId, activeTab]);

    const purifierName = summary?.purifier.name ?? "Smart Purifier";
    const deviceStatus = summary?.device_status.status ?? "offline";
    const lastUpdated = formatDateTime(summary?.device_status.recorded_at);

    const rawWater = {
        tds: formatValue(summary?.initial_raw_snapshot.tds),
        turbidity: formatValue(summary?.initial_raw_snapshot.turbidity),
        ph: formatValue(summary?.initial_raw_snapshot.ph),
        temperature: formatValue(summary?.initial_raw_snapshot.temperature),
        waterVolume: formatValue(summary?.initial_raw_snapshot.water_volume),
    };

    const settlingWater = {
        tds: formatValue(realtime?.settling_realtime.tds.value),
        turbidity: formatValue(realtime?.settling_realtime.turbidity.value),
        ph: formatValue(realtime?.settling_realtime.ph.value),
        temperature: formatValue(realtime?.settling_realtime.temperature.value),
        waterVolume: formatValue(realtime?.settling_realtime.water_volume.value),
    };

    const currentStage = summary?.current_cycle?.current_stage;
    const processStatus = formatStage(currentStage);

    const dose = summary?.ai_decision
        ? `${summary.ai_decision.recommended_moringa_dose_mg_per_l} mg/L`
        : "-";

    const mixingDurationSeconds =
        summary?.ai_decision?.recommended_mixing_duration_seconds;

    const mixingDuration = mixingDurationSeconds
        ? `${mixingDurationSeconds} sec`
        : "-";

    const mixingEndAt = getMixingEndTime(
        summary?.current_cycle?.mixing_started_at,
        mixingDurationSeconds
    );

    const predictedResult =
        summary?.ai_decision?.predicted_is_clean_water === undefined ||
            summary?.ai_decision === null
            ? "-"
            : summary.ai_decision.predicted_is_clean_water
                ? "Clean"
                : "Not Clean";

    const finalResult = {
        finalTds:
            summary?.latest_result?.final_tds !== null &&
                summary?.latest_result?.final_tds !== undefined
                ? `${summary.latest_result.final_tds} ppm`
                : "-",
        finalTurbidity:
            summary?.latest_result?.final_turbidity !== null &&
                summary?.latest_result?.final_turbidity !== undefined
                ? `${summary.latest_result.final_turbidity} NTU`
                : "-",
        finalPh:
            summary?.latest_result?.final_ph !== null &&
                summary?.latest_result?.final_ph !== undefined
                ? String(summary.latest_result.final_ph)
                : "-",
        isCleanWater:
            summary?.latest_result?.is_clean_water === undefined ||
                summary?.latest_result === null
                ? "Pending"
                : summary.latest_result.is_clean_water
                    ? "Yes"
                    : "No",
    };

    const isLoading = isLoadingPurifiers || isLoadingMonitoring;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">Loading monitoring data...</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl text-danger">{error}</div>
            </main>
        );
    }

    if (purifierOptions.length === 0) {
        return (
            <main className="flex flex-col justify-center items-center min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    No purifier registered yet.
                </div>
            </main>
        );
    }

    const mappedHistory = history.map((item) => ({
        cycleId: item.cycle_code,
        startedAt: formatDateTime(item.started_at),
        status: formatStage(item.status),
        predicted: item.predicted ?? "-",
        actual: item.actual ?? "-",
    }));

    return (
        <main className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <MonitoringTopbar
                    selectedPurifierId={selectedPurifierId}
                    purifierOptions={purifierOptions}
                    loading={isLoadingPurifiers}
                    onPurifierChange={setSelectedPurifierId}
                />

                <MonitoringTabs activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === "overview" && (
                    <section className="space-y-6">
                        <RealtimeHeader
                            purifierName={purifierName}
                            deviceStatus={deviceStatus}
                            lastUpdated={lastUpdated}
                        />

                        {currentStage === "mixing" && (
                            <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                                            Mixing in progress
                                        </p>

                                        <h2 className="mt-2 text-lg font-semibold text-foreground">
                                            Moringa Mixing Countdown
                                        </h2>

                                        <p className="mt-1 text-sm text-muted">
                                            Duration: {mixingDuration}
                                        </p>

                                        <p className="mt-1 text-xs text-muted">
                                            Started at{" "}
                                            {formatDateTime(
                                                summary?.current_cycle
                                                    ?.mixing_started_at
                                            )}{" "}
                                            • Ends at{" "}
                                            {formatDateTime(mixingEndAt)}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-border bg-surface/80 px-5 py-4 text-center shadow-sm">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                            Remaining
                                        </p>

                                        <div className="mt-1 font-mono text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                                            {formatSeconds(countdownSeconds)}
                                        </div>

                                        <p className="mt-1 text-xs text-muted">
                                            HH : MM : SS
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
                            <MetricCard
                                label="Settling Turbidity"
                                value={settlingWater.turbidity}
                                unit="NTU"
                                icon="mdi:chart-line"
                                tone="success"
                                hint="Main realtime quality"
                            />
                            <MetricCard
                                label="Settling TDS"
                                value={settlingWater.tds}
                                unit="ppm"
                                icon="mdi:water"
                                tone="primary"
                                hint="Current dissolved solids"
                            />
                            <MetricCard
                                label="Settling pH"
                                value={settlingWater.ph}
                                unit=""
                                icon="mdi:alpha-p-circle"
                                tone="success"
                                hint="Current acidity level"
                            />
                            <MetricCard
                                label="Settling Temperature"
                                value={settlingWater.temperature}
                                unit="°C"
                                icon="mdi:thermometer"
                                tone="warning"
                                hint="Current tank temperature"
                            />
                            <MetricCard
                                label="Settling Water Volume"
                                value={settlingWater.waterVolume}
                                unit="L"
                                icon="mdi:waves"
                                tone="primary"
                                hint="Tank fill level"
                            />
                        </section>

                        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
                            <RealtimeSettlingChart data={settlingChartData} />

                            <LiveReadingsPanel
                                title="Initial Raw Water Snapshot"
                                subtitle="One-time sensor reading before mixing process"
                                readings={rawWater}
                            />
                        </section>

                        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <CurrentProcessPanel
                                status={processStatus}
                                dose={dose}
                                mixingDuration={mixingDuration}
                                predictedResult={predictedResult}
                            />

                            <AiDecisionCard
                                modelType={summary?.ai_decision?.model_type ?? "-"}
                                modelVersion={
                                    summary?.ai_decision?.model_version ?? "-"
                                }
                                dose={dose}
                                mixingDuration={mixingDuration}
                                predictedResult={predictedResult}
                            />

                            <CycleResultCard
                                finalTds={finalResult.finalTds}
                                finalTurbidity={finalResult.finalTurbidity}
                                finalPh={finalResult.finalPh}
                                isCleanWater={finalResult.isCleanWater}
                            />
                        </section>
                    </section>
                )}

                {activeTab === "history" && (
                    <HistoryTable items={mappedHistory} />
                )}
            </div>
        </main>
    );
}