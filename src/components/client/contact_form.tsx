"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send message");
      setSuccess("Thanks! Your message has been sent.");
      toast.success("Message sent successfully");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      const msg = err?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          required
          placeholder="Your Name"
          value={form.name}
          onChange={update("name")}
        />
        <Input
          required
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={update("email")}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={update("phone")}
        />
        <Input
          required
          placeholder="Subject"
          value={form.subject}
          onChange={update("subject")}
        />
      </div>
      <Textarea
        required
        rows={6}
        placeholder="Your message..."
        value={form.message}
        onChange={update("message")}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={submitting}>
          {submitting ? "Sending..." : "Send Message"}
        </Button>
        {success && <span className="text-emerald-600 text-sm">{success}</span>}
        {error && <span className="text-rose-600 text-sm">{error}</span>}
      </div>
    </form>
  );
}
