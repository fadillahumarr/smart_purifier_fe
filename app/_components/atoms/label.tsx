import { ReactNode } from "react";

type LabelProps = {
  htmlFor?: string;
  children: ReactNode;
};

const Label = ({ htmlFor, children }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children}
    </label>
  );
}

export default Label;