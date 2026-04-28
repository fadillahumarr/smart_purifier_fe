import { DashboardSummaryResponse } from "../types/dashboard";
import { PurifierResponse } from "../types/purifiers";
import api from "./client";
import endpoints from "./endpoints";

const getDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
    const res = await api.get(endpoints.dashboard.summary);
    return res.data;
}


const getPurifiers = async (): Promise<PurifierResponse[]> => {
    const res = await api.get(endpoints.purifiers.list);
    return res.data;
};

const getPurifierById = async (id: string): Promise<PurifierResponse> => {
    const res = await api.get(endpoints.purifiers.detail(id));
    return res.data;
};

const createPurifier = async (
    payload: {
        name: string;
        location?: string | null;
        mac_address?: string | null;
        device_code: string;
        mqtt_topic_base: string;
        firmware_version?: string | null;
    }
): Promise<PurifierResponse> => {
    const res = await api.post(endpoints.purifiers.create, payload);
    return res.data;
};

const updatePurifier = async (
    id: string,
    payload: Partial<{
        name: string;
        location?: string | null;
        mac_address?: string | null;
        device_code: string;
        mqtt_topic_base: string;
        firmware_version?: string | null;
    }>
): Promise<PurifierResponse> => {
    const res = await api.put(endpoints.purifiers.update(id), payload);
    return res.data;
};

const deletePurifier = async (id: string): Promise<void> => {
    await api.delete(endpoints.purifiers.delete(id));
};

export {
    getDashboardSummary,
    getPurifiers,
    getPurifierById,
    createPurifier,
    updatePurifier,
    deletePurifier,
};