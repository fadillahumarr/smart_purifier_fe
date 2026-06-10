type Props = {
  title: string;
  description?: string;
};

const SectionHeader = ({ title, description }: Props) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
      ) : null}
    </div>
  );
};

export default SectionHeader;