import { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "filter";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  active?: boolean;
};

const Button = ({
  children,
  variant = "primary",
  fullWidth = false,
  active = false,
  className = "",
  ...props
}: Props) => {
  const styles: Record<ButtonVariant, string> = {
    primary: "bg-primary text-background hover:opacity-90",
    secondary: "bg-secondary text-background hover:opacity-90",
    ghost: "bg-transparent text-foreground hover:bg-tertiary/40",
    filter: active
      ? "bg-secondary text-background"
      : "border border-border bg-surface text-foreground hover:bg-tertiary/30 dark:bg-background",
  };

  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition cursor-pointer ${styles[variant]
        } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;