import api from "./client";
import endpoints from "./endpoints";

import {
    MonitoringRealtimeResponse,
    MonitoringSummaryResponse,
} from "../types/monitoring";


const getMonitoringSummary = async (
    purifierId: string
): Promise<MonitoringSummaryResponse> => {
    const res = await api.get(endpoints.monitoring.summary(purifierId));
    return res.data;
};

const getMonitoringRealtime = async (
    purifierId: string,
    trendMinutes: number = 5
): Promise<MonitoringRealtimeResponse> => {
    const res = await api.get(endpoints.monitoring.realtime(purifierId), {
        params: { trend_minutes: trendMinutes },
    });
    return res.data;
};

export { getMonitoringSummary, getMonitoringRealtime };