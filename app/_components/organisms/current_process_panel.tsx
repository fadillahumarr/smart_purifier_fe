import SectionTitle from "../atoms/section_title";
import ProcessInfoItem from "../molecules/process_info_item";

type CurrentProcessPanelProps = {
    status: string;
    dose: string;
    mixingDuration: string;
    predictedResult: string;
};

const CurrentProcessPanel = ({
    status,
    dose,
    mixingDuration,
    predictedResult,
}: CurrentProcessPanelProps) => {
    return (
        <div className="rounded-2xl border border-border bg-surface p-5 dark:bg-background">
            <SectionTitle
                title="Current Process"
                subtitle="Latest active purification cycle"
            />

            <div className="mt-4">
                <ProcessInfoItem label="Status" value={status} />
                <ProcessInfoItem label="Moringa Dose" value={dose} />
                <ProcessInfoItem label="Mixing Duration" value={mixingDuration} />
                <ProcessInfoItem label="Predicted Result" value={predictedResult} />
            </div>
        </div>
    );
};

export default CurrentProcessPanel;