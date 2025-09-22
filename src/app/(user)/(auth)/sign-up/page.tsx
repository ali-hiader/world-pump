"use client";

import { SignUpResponseI } from "@/app/api/sign-up/route";
import Spinner from "@/icons/spinner";
import { useAuthStore } from "@/stores/auth_store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ContactInput from "@/components/ui/contact-input";

interface ErrorState {
  nameError: string | undefined;
  emailError: string | undefined;
  passwordError: string | undefined;
  generalError: string | undefined;
}

export default function Page() {
  const router = useRouter();
  const setUserIdAuthS = useAuthStore((state) => state.setUserIdAuthS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({
    nameError: undefined,
    emailError: undefined,
    passwordError: undefined,
    generalError: undefined,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const updateField =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError({
      nameError: undefined,
      emailError: undefined,
      passwordError: undefined,
      generalError: undefined,
    });

    const previousPage = document.referrer;
    const nextPath = previousPage ? new URL(previousPage).pathname : "/";

    const { name, email, password } = form;

    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        cache: "no-store",
      });

      const data = (await res.json()) as SignUpResponseI;
      setUserIdAuthS(data.userId);

      if (!res.ok) {
        setError({
          nameError: data.nameError,
          emailError: data.emailError,
          generalError: data.generalError,
          passwordError: data.passwordError,
        });
        return;
      }

      router.push(nextPath || "/");
    } catch (err: unknown) {
      console.log(err);
      setError((prev) => ({
        ...prev,
        generalError: "Sign-in failed. Please try again later",
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-start h-[calc(100vh-30vh)] mt-8">
      <h1 className="text-5xl font-bold headingFont mb-8 text-primary">
        Sign Up
      </h1>
      {error.generalError && (
        <p className="text-destructive text-sm text-start mb-2">
          {error.generalError}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col  min-w-full sm:min-w-lg md:min-w-xl px-4"
      >
        <div className="mb-4">
          <ContactInput
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={updateField("name")}
            required
          />
          {error.nameError && (
            <p className="text-destructive text-sm text-start mt-1">
              {error.nameError}
            </p>
          )}
        </div>
        <div className="mb-4">
          <ContactInput
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField("email")}
            required
          />
          {error.emailError && (
            <p className="text-destructive text-sm text-start mt-1">
              {error.emailError}
            </p>
          )}
        </div>
        <div className="mb-4">
          <ContactInput
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={updateField("password")}
            required
          />
        </div>
        {error.passwordError && (
          <p className="text-destructive text-sm text-start mt-1">
            {error.passwordError}
          </p>
        )}
        <p className="mt-4">
          Already have an account?{" "}
          <Link
            className="text-primary underline hover:text-primary/90"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
        <button
          className="rounded-full px-4 py-2 bg-secondary-foreground mt-6 hover:bg-secondary transition-all hover:text-white cursor-pointer group relative disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading && (
            <Spinner className="absolute top-2.5 left-2.5 animate-spin size-5 stroke-black group-hover:stroke-white " />
          )}{" "}
          Join Now
        </button>
      </form>
    </main>
  );
}
