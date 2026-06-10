type ProcessInfoItemProps = {
  label: string;
  value: string;
};

const ProcessInfoItem = ({ label, value }: ProcessInfoItemProps) => {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-none">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
};

export default ProcessInfoItem;