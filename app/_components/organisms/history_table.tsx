import SectionTitle from "../atoms/section_title";
import HistoryRow from "../molecules/history_row";

type HistoryItem = {
    cycleId: string;
    startedAt: string;
    status: string;
    predicted: string;
    actual: string;
};

type HistoryTableProps = {
    items: HistoryItem[];
};

const HistoryTable = ({ items }: HistoryTableProps) => {
    return (
        <div className="rounded-2xl border border-border bg-surface p-5 dark:bg-background">
            <SectionTitle
                title="Cycle History"
                subtitle="Recent purification cycles"
            />

            <div className="mt-4 hidden grid-cols-5 gap-4 border-b border-border pb-3 text-xs font-medium uppercase tracking-wide text-muted md:grid">
                <span>Cycle ID</span>
                <span>Started At</span>
                <span>Status</span>
                <span>Predicted</span>
                <span>Actual</span>
            </div>

            <div className="mt-1">
                {items.map((item) => (
                    <HistoryRow
                        key={item.cycleId}
                        cycleId={item.cycleId}
                        startedAt={item.startedAt}
                        status={item.status}
                        predicted={item.predicted}
                        actual={item.actual}
                    />
                ))}
            </div>
        </div>
    );
};

export default HistoryTable;