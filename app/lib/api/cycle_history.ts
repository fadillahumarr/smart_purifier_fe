import { CycleHistoryResponse } from "../types/cycle_history";
import api from "./client";
import endpoints from "./endpoints";


const getCycleHistory = async (
    purifierId: string,
    limit: number = 20
): Promise<CycleHistoryResponse> => {
    const res = await api.get(endpoints.cycleHistory.list(purifierId), {
        params: { limit },
    });

    return res.data;
};

export { getCycleHistory };