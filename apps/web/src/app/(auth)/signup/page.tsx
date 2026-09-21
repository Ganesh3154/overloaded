"use client";

import RegisterForm from "@/src/components/register-form";
import { register } from "@/src/services/auth.service";
import { RegisterFormData } from "@/src/types/form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: () => router.push("/onboarding"),
  });

  return (
    <div>
      <RegisterForm onSubmit={(data: RegisterFormData) => mutate(data)} isPending={isPending} />
    </div>
  );
}
