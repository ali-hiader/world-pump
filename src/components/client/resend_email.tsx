"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function ResendEmailButton({ orderId }: { orderId: number }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const resend = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${orderId}/resend`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setSent(true);
      } else {
        alert(data.error || "Failed to resend email");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" variant="secondary" onClick={resend} disabled={loading || sent}>
      {sent ? "Email Sent" : loading ? "Sending..." : "Resend Email"}
    </Button>
  );
}

