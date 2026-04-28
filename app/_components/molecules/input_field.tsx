import { ReactNode, InputHTMLAttributes } from "react";
import Input from "../atoms/input";
import Label from "../atoms/label";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  error?: string;
};

const InputField = ({
  id,
  label,
  name,
  type = "text",
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconClick,
  error,
  ...props
}: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onRightIconClick={onRightIconClick}
        className={error ? "border-danger focus:border-danger" : ""}
        {...props}
      />

      <p className="min-h-1 text-sm text-danger">
        {error}
      </p>
    </div>
  );
};

export default InputField;