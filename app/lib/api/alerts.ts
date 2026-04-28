import api from "./client";
import endpoints from "./endpoints";

const getAlerts = async (params?: {
    status?: string;
    severity?: string;
}) => {
    const res = await api.get(endpoints.alerts.list, { params });
    return res.data;
};

const resolveAlert = async (id: string) => {
    const res = await api.patch(endpoints.alerts.resolve(id));
    return res.data;
};


const getActiveAlertCount = async (): Promise<{ count: number }> => {
  const res = await api.get(endpoints.alerts.active_count);
  return res.data;
};

    
export { getAlerts, resolveAlert, getActiveAlertCount };