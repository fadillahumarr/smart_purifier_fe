import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

const Card = ({ children }: CardProps) => (
  <div className="rounded-4xl border border-border bg-background dark:bg-background p-8 shadow-card transition">
    {children}
  </div>
);

export default Card;