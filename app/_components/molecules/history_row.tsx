type HistoryRowProps = {
  cycleId: string;
  startedAt: string;
  status: string;
  predicted: string;
  actual: string;
};

const HistoryRow = ({
  cycleId,
  startedAt,
  status,
  predicted,
  actual,
}: HistoryRowProps) => {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-border py-4 text-sm md:grid-cols-5 md:gap-4">
      <span className="font-medium text-foreground">{cycleId}</span>
      <span className="text-muted">{startedAt}</span>
      <span className="text-foreground">{status}</span>
      <span className="text-foreground">{predicted}</span>
      <span className="text-foreground">{actual}</span>
    </div>
  );
};

export default HistoryRow;