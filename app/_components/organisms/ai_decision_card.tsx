import SectionTitle from "../atoms/section_title";
import ProcessInfoItem from "../molecules/process_info_item";

type AiDecisionCardProps = {
    modelType: string;
    modelVersion: string;
    dose: string;
    mixingDuration: string;
    predictedResult: string;
};

const AiDecisionCard = ({
    modelType,
    modelVersion,
    dose,
    mixingDuration,
    predictedResult,
}: AiDecisionCardProps) => {
    return (
        <div className="rounded-2xl border border-border bg-surface p-5 dark:bg-background">
            <SectionTitle
                title="AI Decision"
                subtitle="Latest recommendation from edge ML"
            />

            <div className="mt-4">
                <ProcessInfoItem label="Model Type" value={modelType} />
                <ProcessInfoItem label="Model Version" value={modelVersion} />
                <ProcessInfoItem label="Moringa Dose" value={dose} />
                <ProcessInfoItem label="Mixing Duration" value={mixingDuration} />
                <ProcessInfoItem label="Predicted Clean Water" value={predictedResult} />
            </div>
        </div>
    );
};

export default AiDecisionCard;