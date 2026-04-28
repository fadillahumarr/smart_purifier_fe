"use client";

import DashboardSummaryPanel from "@/app/_components/organisms/dashboard_summary_panel";
import ListPurifiers from "@/app/_components/organisms/list_purifiers";
import WaterPurifiersHeader from "@/app/_components/organisms/water_purifiers_header";
import { getDashboardSummary } from "@/app/lib/api/purifiers";
import { DashboardSummaryResponse } from "@/app/lib/types/dashboard";
import { useEffect, useState } from "react";

const PurifiersPage = () => {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [summaryData] = await Promise.all([
          getDashboardSummary(),
        ]);

        setSummary(summaryData);

      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);


  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <WaterPurifiersHeader onAddClick={() => setIsAddOpen(true)} />
        <DashboardSummaryPanel
          totalPurifiers={summary?.total_purifiers}
          onlinePurifiers={summary?.online_purifiers}
          offlinePurifiers={summary?.offline_purifiers}
          activeAlerts={summary?.active_alerts}
          loading={loading}
        />
        <ListPurifiers
          isAddOpen={isAddOpen}
          onCloseAdd={() => setIsAddOpen(false)}
        />
      </div>
    </main>
  );
};

export default PurifiersPage;