"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Input from "../atoms/input";
import Label from "../atoms/label";

type Props = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type"
> & {
    label: string;
    error?: string;
};

const PasswordInputField = ({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    required,
    error,
    ...props
}: Props) => {
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>

            <Input
                id={id}
                name={name}
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                leftIcon={<Icon icon="mdi:lock-outline" width={20} />}
                rightIcon={
                    <Icon
                        icon={show ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                        width={20}
                    />
                }
                onRightIconClick={() => setShow((prev) => !prev)}
                className={error ? "border-danger focus:border-danger" : ""}
                {...props}
            />

            <p className="min-h-2 text-sm text-danger">
                {error}
            </p>
        </div>
    );
};

export default PasswordInputField;