import { useEffect, useMemo, useState } from "react";

import { getPurifiers } from "@/app/lib/api/purifiers";
import {
    getMonitoringRealtime,
    getMonitoringSummary,
} from "@/app/lib/api/monitoring";
import { getMonitoringWebSocketUrl } from "@/app/lib/api/monitoring_ws";
import { getCycleHistory } from "@/app/lib/api/cycle_history";

import { PurifierResponse } from "@/app/lib/types/purifiers";
import {
    MonitoringRealtimeResponse,
    MonitoringSummaryResponse,
} from "@/app/lib/types/monitoring";
import { CycleHistoryItem } from "@/app/lib/types/cycle_history";

import {
    formatDateTime,
    formatStage,
    formatTime,
    formatValue,
    parseBackendDate,
} from "@/app/lib/utils/monitoring_formatters";

export type MonitoringTab = "overview" | "history";
export type DeviceStatus = "online" | "offline" | "degraded";

type ChartItem = {
    time: string;
    turbidity: number;
    tds: number;
    ph: number;
    temperature: number;
};

const normalizeDeviceStatus = (status?: string | null): DeviceStatus => {
    if (status === "online" || status === "offline" || status === "degraded") {
        return status;
    }

    return "offline";
};

const getRemainingMixingSeconds = (
    mixingStartedAt?: string | null,
    durationSeconds?: number | null
) => {
    if (!mixingStartedAt || !durationSeconds) return null;

    const startedAt = parseBackendDate(mixingStartedAt);
    if (!startedAt) return null;

    const elapsedSeconds = Math.floor((Date.now() - startedAt.getTime()) / 1000);

    return Math.max(durationSeconds - elapsedSeconds, 0);
};

const getMixingEndTime = (
    mixingStartedAt?: string | null,
    durationSeconds?: number | null
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

export const useMonitoringData = () => {
    const [activeTab, setActiveTab] = useState<MonitoringTab>("overview");

    const [purifierOptions, setPurifierOptions] = useState<
        { id: string; name: string }[]
    >([]);

    const [selectedPurifierId, setSelectedPurifierId] = useState("");
    const [summary, setSummary] = useState<MonitoringSummaryResponse | null>(null);
    const [realtime, setRealtime] =
        useState<MonitoringRealtimeResponse | null>(null);
    const [history, setHistory] = useState<CycleHistoryItem[]>([]);

    const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);

    const [isLoadingPurifiers, setIsLoadingPurifiers] = useState(true);
    const [isLoadingMonitoring, setIsLoadingMonitoring] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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

        const loadOverviewData = async () => {
            try {
                setIsLoadingMonitoring(true);
                setError(null);

                const [summaryData, realtimeData] = await Promise.all([
                    getMonitoringSummary(selectedPurifierId),
                    getMonitoringRealtime(selectedPurifierId, 5),
                ]);

                if (!isMounted) return;

                setSummary(summaryData);
                setRealtime(realtimeData);
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

        loadOverviewData();

        return () => {
            isMounted = false;
        };
    }, [selectedPurifierId]);

    useEffect(() => {
        if (!selectedPurifierId) return;

        const ws = new WebSocket(getMonitoringWebSocketUrl(selectedPurifierId));

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
                            value: data.tds ?? prev.settling_realtime.tds.value,
                            unit: "ppm",
                            recorded_at: data.recorded_at,
                        },
                        turbidity: {
                            value:
                                data.turbidity ?? prev.settling_realtime.turbidity.value,
                            unit: "NTU",
                            recorded_at: data.recorded_at,
                        },
                        ph: {
                            value: data.ph ?? prev.settling_realtime.ph.value,
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
                    settling_trend: [...prev.settling_trend, trendItem].slice(-100),
                };
            });
        };

        ws.onerror = (event) => {
            console.error("Monitoring WebSocket error:", event);
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
            } catch { }
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

        let isMounted = true;

        const loadHistory = async () => {
            try {
                setIsLoadingHistory(true);

                const data = await getCycleHistory(selectedPurifierId, 20);

                if (!isMounted) return;

                setHistory(data.items);
            } catch {
                if (isMounted) {
                    setHistory([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingHistory(false);
                }
            }
        };

        loadHistory();

        const interval = setInterval(loadHistory, 15000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [selectedPurifierId, activeTab]);

    const currentStage = summary?.current_cycle?.current_stage;
    const deviceStatus = normalizeDeviceStatus(summary?.device_status.status);

    const mixingDurationSeconds =
        summary?.ai_decision?.recommended_mixing_duration_seconds;

    const mixingDuration = mixingDurationSeconds
        ? `${mixingDurationSeconds} sec`
        : "-";

    const mixingEndAt = getMixingEndTime(
        summary?.current_cycle?.mixing_started_at,
        mixingDurationSeconds
    );

    const dose = summary?.ai_decision
        ? `${summary.ai_decision.recommended_moringa_dose_mg_per_l} mg/L`
        : "-";

    const predictedResult =
        summary?.ai_decision?.predicted_is_clean_water === undefined ||
            summary?.ai_decision === null
            ? "-"
            : summary.ai_decision.predicted_is_clean_water
                ? "Clean"
                : "Not Clean";

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

    const historyItems = history.map((item) => ({
        cycleId: item.cycle_code,
        startedAt: formatDateTime(item.started_at),
        status: formatStage(item.status),
        predicted: item.predicted ?? "-",
        actual: item.actual ?? "-",
    }));

    return {
        activeTab,
        setActiveTab,

        purifierOptions,
        selectedPurifierId,
        setSelectedPurifierId,

        isLoading: isLoadingPurifiers || isLoadingMonitoring,
        isLoadingPurifiers,
        isLoadingHistory,

        error,
        hasPurifiers: purifierOptions.length > 0,

        overviewData: {
            purifierName: summary?.purifier.name ?? "Smart Purifier",
            deviceStatus,
            lastUpdated: formatDateTime(summary?.device_status.recorded_at),
            currentStage,
            countdownSeconds,
            mixingDuration,
            mixingStartedAt: summary?.current_cycle?.mixing_started_at,
            mixingEndAt,
            settlingWater,
            rawWater,
            chartData: settlingChartData,
            processStatus: formatStage(currentStage),
            dose,
            predictedResult,
            modelType: summary?.ai_decision?.model_type ?? "-",
            modelVersion: summary?.ai_decision?.model_version ?? "-",
            finalResult,
        },

        historyItems,
    };
};