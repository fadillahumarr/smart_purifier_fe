"use client";

import AlertsHeader from "@/app/_components/organisms/alerts_header";
import AlertsList from "@/app/_components/organisms/alerts_list";
import Button from "@/app/_components/atoms/button";

import {
    AlertFilter,
    useAlertsData,
} from "@/app/lib/hooks/use_alerts_data";

const filterOptions: AlertFilter[] = ["all", "active", "resolved", "critical"];

const AlertsPage = () => {
    const { filteredAlerts, filter, setFilter, loading, handleResolve } =
        useAlertsData();

    return (
        <main className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <AlertsHeader />

                <section className="flex flex-wrap gap-2">
                    {filterOptions.map((item) => (
                        <Button
                            key={item}
                            variant="filter"
                            active={filter === item}
                            onClick={() => setFilter(item)}
                            className="h-10 rounded-xl px-4 capitalize"
                        >
                            {item}
                        </Button>
                    ))}
                </section>

                {loading ? (
                    <p className="flex items-center justify-center text-base text-muted">
                        Loading alerts...
                    </p>
                ) : (
                    <AlertsList alerts={filteredAlerts} onResolve={handleResolve} />
                )}
            </div>
        </main>
    );
};

export default AlertsPage;