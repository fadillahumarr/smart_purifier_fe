import SectionTitle from "../atoms/section_title";
import ReadingRow from "../molecules/reading_row";

type LiveReadingPanelProps = {
    title: string;
    subtitle?: string;
    readings: {
        tds: string;
        turbidity: string;
        ph: string;
        temperature: string;
        waterVolume: string;
    };
};

const LiveReadingPanel = ({
    title,
    subtitle,
    readings,
}: LiveReadingPanelProps) => {
    return (
        <div className="rounded-2xl border border-border bg-surface p-5 dark:bg-background">
            <SectionTitle title={title} subtitle={subtitle} />

            <div className="mt-4">
                <ReadingRow
                    label="TDS"
                    value={readings.tds}
                    unit="ppm"
                    icon="mdi:water"
                />
                <ReadingRow
                    label="Turbidity"
                    value={readings.turbidity}
                    unit="NTU"
                    icon="mdi:blur"
                />
                <ReadingRow
                    label="pH"
                    value={readings.ph}
                    icon="mdi:alpha-p-circle"
                />
                <ReadingRow
                    label="Temperature"
                    value={readings.temperature}
                    unit="°C"
                    icon="mdi:thermometer"
                />
                <ReadingRow
                    label="Water Volume"
                    value={readings.waterVolume}
                    unit="L"
                    icon="mdi:waves"
                />
            </div>
        </div>
    );
};

export default LiveReadingPanel;