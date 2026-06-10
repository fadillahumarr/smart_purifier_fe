"use client";

import DashboardSummaryPanel from "@/app/_components/organisms/dashboard_summary_panel";
import ListPurifiers from "@/app/_components/organisms/list_purifiers";
import WaterPurifiersHeader from "@/app/_components/organisms/water_purifiers_header";

import { usePurifiersDashboard } from "@/app/lib/hooks/use_purifiers_dashboard";

const PurifiersPage = () => {
  const {
    summary,
    loading,
    isAddOpen,
    openAddModal,
    closeAddModal,
  } = usePurifiersDashboard();

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <WaterPurifiersHeader onAddClick={openAddModal} />

        <DashboardSummaryPanel
          totalPurifiers={summary?.total_purifiers}
          onlinePurifiers={summary?.online_purifiers}
          offlinePurifiers={summary?.offline_purifiers}
          activeAlerts={summary?.active_alerts}
          loading={loading}
        />

        <ListPurifiers
          isAddOpen={isAddOpen}
          onCloseAdd={closeAddModal}
        />
      </div>
    </main>
  );
};

export default PurifiersPage;