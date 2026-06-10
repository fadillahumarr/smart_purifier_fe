import { CycleStatus } from "./monitoring";

type CycleHistoryItem = {
    cycle_uuid: string;
    cycle_code: string;
    started_at: string;
    status: CycleStatus;
    predicted: string | null;
    actual: string | null;
};

type CycleHistoryResponse = {
    purifier_id: string;
    items: CycleHistoryItem[];
};

export type { CycleHistoryItem, CycleHistoryResponse };