"use client";

import { SignInResponseI } from "@/app/api/sign-in/route";
import Spinner from "@/icons/spinner";
import { useAuthStore } from "@/stores/auth_store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ErrorState {
  emailError: string | undefined;
  passwordError: string | undefined;
  generalError: string | undefined;
}

export default function SignInPage() {
  const router = useRouter();
  const { setUserIdAuthS: setSession } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({
    emailError: undefined,
    passwordError: undefined,
    generalError: undefined,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError({
      emailError: undefined,
      passwordError: undefined,
      generalError: undefined,
    });

    const previousPage = document.referrer;
    const nextPath = previousPage ? new URL(previousPage).pathname : "/";

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });

      const data = (await res.json()) as SignInResponseI;
      setSession(data.userId);

      if (!res.ok) {
        setError({
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
        Sign In
      </h1>
      {error.generalError && (
        <p className="text-rose-600 text-sm text-start mb-2">
          {error.generalError}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col min-w-full sm:min-w-lg md:min-w-xl px-4"
      >
        <input
          type="email"
          className=" placeholder:text-gray-700 text-gray-800 border border-gray-400 px-4 py-2 rounded"
          placeholder="Email"
          name="email"
        />
        {error.emailError && (
          <p className="text-rose-600 text-sm text-start mt-1">
            {error.emailError}
          </p>
        )}
        <input
          type="password"
          className="mt-4 placeholder:text-gray-700 text-gray-800 border border-gray-400 px-4 py-2 rounded"
          placeholder="Password"
          name="password"
        />
        {error.passwordError && (
          <p className="text-rose-600 text-sm text-start mt-1">
            {error.passwordError}
          </p>
        )}
        <p className="mt-4">
          Don&apos;t have an account?{" "}
          <Link className="text-sky-600 underline" href="/sign-up">
            Sign up
          </Link>
        </p>
        <button
          className="rounded-full px-4 py-2 bg-secondary-foreground mt-6 hover:bg-secondary transition-all hover:text-white cursor-pointer group relative disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading && (
            <Spinner className="absolute top-2.5 left-2.5 animate-spin size-5 stroke-black group-hover:stroke-white " />
          )}{" "}
          Sign In
        </button>
      </form>
    </main>
  );
}
