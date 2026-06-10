import Button from "../atoms/button";

type MonitoringTab = "overview" | "history";

type MonitoringTabsProps = {
    activeTab: MonitoringTab;
    onChange: (tab: MonitoringTab) => void;
};

const tabs: { label: string; value: MonitoringTab }[] = [
    { label: "Overview", value: "overview" },
    { label: "History", value: "history" },
];

const MonitoringTabs = ({ activeTab, onChange }: MonitoringTabsProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
                <Button
                    key={tab.value}
                    variant="filter"
                    active={activeTab === tab.value}
                    onClick={() => onChange(tab.value)}
                    className="h-10 rounded-xl px-4"
                >
                    {tab.label}
                </Button>
            ))}
        </div>
    );
};

export default MonitoringTabs;