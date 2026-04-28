type DeviceStatus = "online" | "offline" | "degraded";

type CycleStatus = "running" | "settling" | "completed" | "failed";

type CycleStage =
    | "raw_sampling"
    | "mixing"
    | "settling"
    | "completed"
    | "failed";

interface MetricReading {
    value: number | null;
    unit: string;
    recorded_at: string | null;
}

interface DeviceStatusOut {
    is_live: boolean;
    status: DeviceStatus | null;
    message: string | null;
    recorded_at: string | null;
}

interface PurifierMini {
    id: string;
    name: string;
    location: string;
    device_code: string;
    firmware_version: string;
}

interface RawSnapshot {
    tds: number | null;
    turbidity: number | null;
    ph: number | null;
    temperature: number | null;
    water_volume: number | null;
    recorded_at: string | null;
}

interface CurrentCycle {
    id: string;
    current_stage: CycleStage | null;
    status: CycleStatus;
    started_at: string;

    mixing_started_at: string | null;
    mixing_end_at: string | null;
    remaining_mixing_seconds: number | null;

    settled_at: string | null;
    finished_at: string | null;

    notes: string | null;
}

interface AIDecision {
    id: string;
    purification_cycle_id: string;

    model_type: string;
    model_version: string;

    raw_tds: number;
    raw_turbidity: number;
    raw_water_volume: number;
    raw_temperature: number;
    raw_ph: number;

    recommended_moringa_dose_mg_per_l: number;
    recommended_mixing_duration_seconds: number;

    predicted_is_clean_water: boolean;

    created_at: string;
}

interface LatestResult {
    id: string;
    purification_cycle_id: string;

    final_tds: number | null;
    final_turbidity: number | null;
    final_ph: number | null;

    is_clean_water: boolean;
    created_at: string;
}

interface MonitoringSummaryResponse {
    purifier: PurifierMini;
    device_status: DeviceStatusOut;
    initial_raw_snapshot: RawSnapshot;

    current_cycle: CurrentCycle | null;
    ai_decision: AIDecision | null;
    latest_result: LatestResult | null;
}

interface SettlingRealtime {
    turbidity: MetricReading;
    tds: MetricReading;
    ph: MetricReading;
    temperature: MetricReading;
    water_volume: MetricReading;
}

interface TrendPoint {
    time: string;
    tds: number | null;
    turbidity: number | null;
    ph: number | null;
    temperature: number | null;
    water_volume: number | null;
}

interface MonitoringRealtimeResponse {
    purifier_id: string;
    device_status: DeviceStatusOut;
    settling_realtime: SettlingRealtime;
    settling_trend: TrendPoint[];
}

export type {
    DeviceStatus,
    CycleStatus,
    CycleStage,
    MetricReading,
    DeviceStatusOut,
    PurifierMini,
    RawSnapshot,
    CurrentCycle,
    AIDecision,
    LatestResult,
    MonitoringSummaryResponse,
    SettlingRealtime,
    TrendPoint,
    MonitoringRealtimeResponse,
};