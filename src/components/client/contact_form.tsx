"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TextField from "@mui/material/TextField";

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
          className="bg-secondary hover:bg-secondary/90"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send Message"}
        </Button>
        {success && <span className="text-emerald-600 text-sm">{success}</span>}
        {error && <span className="text-rose-600 text-sm">{error}</span>}
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

function ContactInput({
  name,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <TextField
      id={name}
      name={name}
      variant="standard"
      fullWidth
      size="small"
      slotProps={{
        input: {
          sx: { fontSize: 14 }, // dY`^ input text font size
        },
        inputLabel: {
          sx: { fontSize: 14 }, // dY`^ label font size
        },
      }}
      required={required}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => onChange(e)}
    />
  );
}

interface Props {
  name: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function CustomTextarea({
  name,
  required = false,
  placeholder = "Your message...",
  value,
  onChange,
}: Props) {
  return (
    <div className="w-full">
      <Textarea
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={1} // single line height
        className="w-full border-0 border-b transition-all border-gray-400 p-0 h-fit
                 rounded-none focus-visible:ring-0 focus:border-black
                 text-sm placeholder:text-gray-400 hover:border-b-2 hover:border-b-black"
      />
    </div>
  );
}
