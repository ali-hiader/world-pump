"use client";

import Spinner from "@/icons/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ErrorState {
  emailError?: string;
  passwordError?: string;
  generalError?: string;
}

export default function AdminLogInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/admin-log-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setError({
          emailError: data.emailError,
          generalError: data.generalError,
          passwordError: data.passwordError,
        });
        return;
      }

      // ✅ JWT is now in cookies automatically
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError({
        generalError: "Admin login failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-start h-[calc(100vh-30vh)]">
      <h1 className="text-5xl font-bold headingFont mb-8 text-primary">
        Admin Login
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
          placeholder="Admin Email"
          defaultValue="superAdmin@worldPumps.hi"
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
          defaultValue="opentheadminpanel"
          name="password"
        />
        {error.passwordError && (
          <p className="text-rose-600 text-sm text-start mt-1">
            {error.passwordError}
          </p>
        )}

        <button
          className="rounded-full px-4 py-2 bg-secondary-foreground mt-6 hover:bg-secondary transition-all hover:text-white cursor-pointer group relative disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading && (
            <Spinner className="absolute top-2.5 left-2.5 animate-spin size-5 stroke-black group-hover:stroke-white " />
          )}
          Log In
        </button>
      </form>
    </main>
  );
}
