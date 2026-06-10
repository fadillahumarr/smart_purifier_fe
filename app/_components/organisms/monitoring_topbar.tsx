import PurifierSelect from "../molecules/purifier_select";

type PurifierOption = {
  id: string;
  name: string;
};

type MonitoringTopbarProps = {
  selectedPurifierId: string;
  purifierOptions: PurifierOption[];
  loading?: boolean;
  onPurifierChange: (id: string) => void;
};

const MonitoringTopbar = ({
  selectedPurifierId,
  purifierOptions,
  loading = false,
  onPurifierChange,
}: MonitoringTopbarProps) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Monitoring</h1>
        <p className="text-sm text-muted">
          Realtime monitoring, current process, AI decision, and history.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          Smart Purifier
        </span>

        <PurifierSelect
          value={selectedPurifierId}
          options={purifierOptions}
          loading={loading}
          onChange={onPurifierChange}
        />
      </div>
    </div>
  );
};

export default MonitoringTopbar;