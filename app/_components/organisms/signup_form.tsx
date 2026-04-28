"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

import Button from "../atoms/button";
import Card from "../atoms/card";
import InputField from "../molecules/input_field";
import PasswordInputField from "../molecules/password_input_field";

import ErrorResponse from "@/app/lib/types/api";
import routes from "@/app/lib/routes";
import { register } from "@/app/lib/api/auth";

import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/app/lib/utils/validation";

const SignupForm = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
      });

      router.push(routes.login);
    } catch (err: unknown) {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        setError(err.response?.data?.detail || "Register failed");
      } else {
        setError("Register failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">
          Create Account
        </h2>
        <p className="text-sm text-muted">
          Register to access your smart purifier dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-2">
        {/* NAME */}
        <InputField
          id="name"
          name="name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          leftIcon={<Icon icon="mdi:account-outline" width={20} />}
          error={errors.name}
        />

        {/* EMAIL */}
        <InputField
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          leftIcon={<Icon icon="mdi:email-outline" width={20} />}
          error={errors.email}
        />

        {/* PASSWORD */}
        <PasswordInputField
          id="password"
          name="password"
          label="Password"
          placeholder="Create your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          error={errors.password}
        />

        {/* CONFIRM PASSWORD */}
        <PasswordInputField
          id="confirm-password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          error={errors.confirmPassword}
        />

        {/* GLOBAL ERROR */}
        {error && <p className="text-sm text-warning">{error}</p>}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={routes.login}
          className="font-medium text-secondary transition hover:text-primary"
        >
          Sign In
        </Link>
      </p>
    </Card>
  );
};

export default SignupForm;