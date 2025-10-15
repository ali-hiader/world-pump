"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ContactInput from "@/components/ui/contact-input";
import CustomTextarea from "@/components/ui/custom-textarea";

const fields = [
  { name: "name", placeholder: "Your Name", type: "text", required: true },
  { name: "email", placeholder: "Your Email", type: "email", required: true },
  {
    name: "phone",
    placeholder: "Phone (optional)",
    type: "text",
    required: false,
  },
  { name: "subject", placeholder: "Subject", type: "text", required: true },
];

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

  const update =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        {fields.map((field) => (
          <ContactInput
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            type={field.type}
            required={field.required}
            value={form[field.name as keyof typeof form] as string}
            onChange={update(field.name)}
          />
        ))}
      </div>

      <CustomTextarea
        name="message"
        required
        placeholder="Your message..."
        value={form.message}
        onChange={update("message")}
      />
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          className="bg-secondary hover:bg-secondary/90 text-white"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send Message"}
        </Button>
        {success && <span className="text-emerald-600 text-sm">{success}</span>}
        {error && <span className="text-destructive text-sm">{error}</span>}
      </div>
    </form>
  );
}

export interface InputProps {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}
