type BadgeVariant = "success" | "warning" | "danger" | "neutral";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const badgeStyles: Record<BadgeVariant, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-tertiary text-foreground",
};

const Badge =({
  label,
  variant = "neutral",
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[variant]}`}
    >
      {label}
    </span>
  );
}

export default Badge;