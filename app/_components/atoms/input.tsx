import { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
};

const Input = ({
  className,
  leftIcon,
  rightIcon,
  onRightIconClick,
  ...props
}: InputProps) => {
  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          {leftIcon}
        </div>
      )}

      <input
        {...props}
        className={`h-12 w-full rounded-2xl border border-border bg-background text-sm text-foreground outline-none placeholder:text-muted focus:border-secondary
        ${leftIcon ? "pl-10" : "px-4"}
        ${rightIcon ? "pr-10" : "px-4"}
        ${className}`}
      />

      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};

export default Input;