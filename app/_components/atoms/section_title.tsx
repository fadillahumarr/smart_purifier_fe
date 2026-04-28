type SectionTitleProps = {
    title: string;
    subtitle?: string;
};

const SectionTitle = ({
    title,
    subtitle,
}: SectionTitleProps) => {
    return (
        <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {subtitle ? (
                <p className="text-sm text-muted">{subtitle}</p>
            ) : null}
        </div>
    );
}

export default SectionTitle;