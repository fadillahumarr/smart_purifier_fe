const routes = {
    signup: "/signup",
    login: "/login",
    purifiers: "/purifiers",
    purifierDetail: (id: string) => `/purifiers/${id}`,
    monitoring: "/monitoring",
    alerts: "/alerts",
};

export default routes;