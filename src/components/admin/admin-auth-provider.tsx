"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Spinner from "@/icons/spinner";

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export default function AdminAuthProvider({
  children,
}: AdminAuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/log-in") {
      setIsAuthenticated(true);
      return;
    }

    // Check if admin session exists
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth-check", {
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/admin/log-in");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        router.push("/admin/log-in");
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner className="animate-spin h-8 w-8 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show children if authenticated or on login page
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // This shouldn't be reached due to router.push, but just in case
  return null;
}
