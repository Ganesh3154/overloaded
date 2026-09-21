"use client";

import LoginForm from "@/src/components/login-form";
import { login } from "@/src/services/auth.service";
import { LoginFormData } from "@/src/types/form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => router.push(data.isOnboarded ? "/dashboard" : "/onboarding"),
  });

  return (
    <div>
      <LoginForm onSubmit={(data: LoginFormData) => mutate(data)} isPending={isPending} />
    </div>
  );
}
