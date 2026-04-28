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

import routes from "@/app/lib/routes";
import { login } from "@/app/lib/api/auth";
import ErrorResponse from "@/app/lib/types/api";
import { setCookie } from "@/app/lib/api/cookies";

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await login({
        email,
        password,
      });

      setCookie("access_token", res.access_token);
      setCookie("refresh_token", res.refresh_token);

      router.replace(routes.purifiers);
    } catch (err: unknown) {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        setError(err.response?.data?.detail || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Sign In</h2>
        <p className="text-sm text-muted">
          Access your smart purifier dashboard
        </p>
      </div>

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <InputField
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Icon icon="mdi:email-outline" width={20} />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          error={errors.email}
          required
        />

        <PasswordInputField
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          error={errors.password}
          required
        />

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-warning/10 px-4 py-3 text-sm text-danger">
            <Icon icon="mdi:alert-circle-outline" width={18} />
            <span>{error}</span>
          </div>
        )}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={routes.signup}
          className="font-medium text-secondary hover:text-primary"
        >
          Sign Up
        </Link>
      </p>
    </Card>
  );
};

export default LoginForm;