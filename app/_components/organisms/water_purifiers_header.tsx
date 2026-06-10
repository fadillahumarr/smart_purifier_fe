import { Icon } from "@iconify/react";
import Button from "../atoms/button";

type WaterPurifiersHeaderProps = {
  onAddClick: () => void;
};

const WaterPurifiersHeader = ({
  onAddClick,
}: WaterPurifiersHeaderProps) => {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Water Purifiers
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your registered smart water purifier devices.
        </p>
      </div>

      <Button variant="secondary" onClick={onAddClick}>
        <Icon icon="mdi:plus" className="text-lg" />
        Add Purifier
      </Button>
    </div>
  );
};

export default WaterPurifiersHeader;