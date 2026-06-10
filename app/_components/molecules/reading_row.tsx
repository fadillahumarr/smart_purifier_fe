import { Icon } from "@iconify/react";

type ReadingRowProps = {
  label: string;
  value: string;
  unit?: string;
  icon?: string;
};

const ReadingRow = ({ label, value, unit, icon }: ReadingRowProps) => {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-none">
      <div className="flex items-center gap-3">
        {icon ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <Icon icon={icon} className="text-base" />
          </div>
        ) : null}

        <span className="text-sm text-muted">{label}</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold text-foreground">{value}</span>
        {unit ? <span className="text-xs text-muted">{unit}</span> : null}
      </div>
    </div>
  );
};

export default ReadingRow;