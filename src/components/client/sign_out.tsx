"use client";

import { useAuthStore } from "@/stores/auth_store";
import { redirect } from "next/navigation";

function SignOutBtn() {
  const { setUserIdAuthS } = useAuthStore();

  function signout() {
    fetch("/api/sign-out", {
      cache: "no-store",
    });
    setUserIdAuthS(undefined);
    redirect("/");
  }

  return (
    <form action={signout}>
      <button
        type="submit"
        className="rounded-md px-5 py-2.5 bg-primary/20 text-gray-700 font-medium cursor-pointer "
      >
        <span className="button-label">Sign out</span>
      </button>
    </form>
  );
}

export default SignOutBtn;
