import SectionTitle from "../atoms/section_title";
import ProcessInfoItem from "../molecules/process_info_item";

type CycleResultCardProps = {
    finalTds: string;
    finalTurbidity: string;
    finalPh: string;
    isCleanWater: string;
};

const CycleResultCard = ({
    finalTds,
    finalTurbidity,
    finalPh,
    isCleanWater,
}: CycleResultCardProps) => {
    return (
        <div className="rounded-2xl border border-border bg-surface p-5 dark:bg-background">
            <SectionTitle
                title="Latest Result"
                subtitle="Actual result after settling process"
            />

            <div className="mt-4">
                <ProcessInfoItem label="Final TDS" value={finalTds} />
                <ProcessInfoItem label="Final Turbidity" value={finalTurbidity} />
                <ProcessInfoItem label="Final pH" value={finalPh} />
                <ProcessInfoItem label="Is Clean Water" value={isCleanWater} />
            </div>
        </div>
    );
};

export default CycleResultCard;