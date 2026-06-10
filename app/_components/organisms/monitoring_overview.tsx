import RealtimeHeader from "@/app/_components/organisms/monitoring_header";
import MetricCard from "@/app/_components/molecules/metric_card";
import CurrentProcessPanel from "@/app/_components/organisms/current_process_panel";
import RealtimeSettlingChart from "@/app/_components/organisms/monitoring_realtime_settling_chart";
import AiDecisionCard from "@/app/_components/organisms/ai_decision_card";
import CycleResultCard from "@/app/_components/organisms/cycle_result_card";
import LiveReadingsPanel from "@/app/_components/organisms/monitoring_raw_water_panel";
import MonitoringMixingCountdown from "@/app/_components/organisms/monitoring_mixing_countdown";

type DeviceStatus = "online" | "offline" | "degraded";

type ReadingData = {
    tds: string;
    turbidity: string;
    ph: string;
    temperature: string;
    waterVolume: string;
};

type ChartItem = {
    time: string;
    turbidity: number;
    tds: number;
    ph: number;
    temperature: number;
};

type Props = {
    purifierName: string;
    deviceStatus: DeviceStatus;
    lastUpdated: string;
    currentStage?: string | null;
    countdownSeconds?: number | null;
    mixingDuration: string;
    mixingStartedAt?: string | null;
    mixingEndAt?: string | null;
    settlingWater: ReadingData;
    rawWater: ReadingData;
    chartData: ChartItem[];
    processStatus: string;
    dose: string;
    predictedResult: string;
    modelType: string;
    modelVersion: string;
    finalResult: {
        finalTds: string;
        finalTurbidity: string;
        finalPh: string;
        isCleanWater: string;
    };
};

const MonitoringOverview = ({
    purifierName,
    deviceStatus,
    lastUpdated,
    currentStage,
    countdownSeconds,
    mixingDuration,
    mixingStartedAt,
    mixingEndAt,
    settlingWater,
    rawWater,
    chartData,
    processStatus,
    dose,
    predictedResult,
    modelType,
    modelVersion,
    finalResult,
}: Props) => {
    return (
        <section className="space-y-6">
            <RealtimeHeader
                purifierName={purifierName}
                deviceStatus={deviceStatus}
                lastUpdated={lastUpdated}
            />

            {currentStage === "mixing" && (
                <MonitoringMixingCountdown
                    duration={mixingDuration}
                    startedAt={mixingStartedAt}
                    endsAt={mixingEndAt}
                    countdownSeconds={countdownSeconds}
                />
            )}

            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
                <MetricCard
                    label="Settling Turbidity"
                    value={settlingWater.turbidity}
                    unit="NTU"
                    icon="mdi:chart-line"
                    tone="success"
                    hint="Main realtime quality"
                />

                <MetricCard
                    label="Settling TDS"
                    value={settlingWater.tds}
                    unit="ppm"
                    icon="mdi:water"
                    tone="primary"
                    hint="Current dissolved solids"
                />

                <MetricCard
                    label="Settling pH"
                    value={settlingWater.ph}
                    unit=""
                    icon="mdi:alpha-p-circle"
                    tone="success"
                    hint="Current acidity level"
                />

                <MetricCard
                    label="Settling Temperature"
                    value={settlingWater.temperature}
                    unit="°C"
                    icon="mdi:thermometer"
                    tone="warning"
                    hint="Current tank temperature"
                />

                <MetricCard
                    label="Settling Water Volume"
                    value={settlingWater.waterVolume}
                    unit="L"
                    icon="mdi:waves"
                    tone="primary"
                    hint="Tank fill level"
                />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
                <RealtimeSettlingChart data={chartData} />

                <LiveReadingsPanel
                    title="Initial Raw Water Snapshot"
                    subtitle="One-time sensor reading before mixing process"
                    readings={rawWater}
                />
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <CurrentProcessPanel
                    status={processStatus}
                    dose={dose}
                    mixingDuration={mixingDuration}
                    predictedResult={predictedResult}
                />

                <AiDecisionCard
                    modelType={modelType}
                    modelVersion={modelVersion}
                    dose={dose}
                    mixingDuration={mixingDuration}
                    predictedResult={predictedResult}
                />

                <CycleResultCard
                    finalTds={finalResult.finalTds}
                    finalTurbidity={finalResult.finalTurbidity}
                    finalPh={finalResult.finalPh}
                    isCleanWater={finalResult.isCleanWater}
                />
            </section>
        </section>
    );
};

export default MonitoringOverview;