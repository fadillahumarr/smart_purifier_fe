import endpoints from "./endpoints";

const getMonitoringWebSocketUrl = (purifierId: string) => {
    const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/api/v1";

    return wsUrl + endpoints.ws.monitoring(purifierId);
};

export { getMonitoringWebSocketUrl };