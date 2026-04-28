const endpoints = {
    auth: {
        register: "/auth/register",
        login: "/auth/login",
        me: "/auth/me",
        refresh: "/auth/refresh",
        logout: "/auth/logout",
    },

    dashboard: {
        summary: "/dashboard/summary",
        purifier: (id: string) => `/dashboard/purifier/${id}`,
    },

    purifiers: {
        list: "/purifiers",
        create: "/purifiers/create",
        detail: (id: string) => `/purifiers/${id}`,
        delete: (id: string) => `/purifiers/${id}`,
        update: (id: string) => `/purifiers/${id}`,
    },

    cycleHistory: {
        list: (id: string) => `/purifiers/${id}/cycles/history`,
    },

    monitoring: {
        summary: (id: string) => `/purifiers/${id}/monitoring/summary`,
        realtime: (id: string) => `/purifiers/${id}/monitoring/realtime`,
    },

    ws: {
        monitoring: (id: string) => `/ws/monitoring/${id}`,
    },

    alerts: {
        list: "/alerts",
        resolve: (id: string) => `/alerts/${id}/resolve`,
        active_count: "/alerts/active-count",
    }
}

export default endpoints;