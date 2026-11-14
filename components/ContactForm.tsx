"use client";

import { type FormEvent, useEffect, useState } from "react";
import { site } from "@/content/site";
import { type ContactErrors, type ContactInput, topics, validateContact } from "@/lib/contact";
import { btnDark } from "@/lib/ui";

const field =
  "mt-2 w-full rounded-xl bg-white px-4 py-3.5 text-ink ring-1 ring-ink/20 outline-none transition focus:ring-2 focus:ring-ink aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-700";

export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [topic, setTopic] = useState("general");
  const [sent, setSent] = useState(false);

  // Preselect topic from ?topic= (links on /next-steps) without forcing a dynamic page.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("topic");
    if (t && t in topics) setTopic(t);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as ContactInput;
    const found = validateContact(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // ponytail: no backend yet. Hands off to the visitor's mail app; swap for a
    // POST to an API route / form service when one exists.
    console.info("[contact] submit", data);
    const body = `${data.message}\n\n${data.name}\n${data.email}${data.phone ? `\n${data.phone}` : ""}`;
    const subject = `[Website] ${topics[data.topic as keyof typeof topics]}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const err = (k: keyof ContactInput) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-2 text-sm text-red-700">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof ContactInput) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-6" aria-describedby={sent ? "form-status" : undefined}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block font-medium">
          Nama
          <input name="name" autoComplete="name" required className={field} {...a11y("name")} />
          {err("name")}
        </label>
        <label className="block font-medium">
          Email
          <input name="email" type="email" autoComplete="email" required className={field} {...a11y("email")} />
          {err("email")}
        </label>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block font-medium">
          No. HP <span className="font-normal text-stone">(opsional)</span>
          <input name="phone" type="tel" autoComplete="tel" className={field} {...a11y("phone")} />
          {err("phone")}
        </label>
        <label className="block font-medium">
          Topik
          <select name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={field} {...a11y("topic")}>
            {Object.entries(topics).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {err("topic")}
        </label>
      </div>
      <label className="block font-medium">
        Pesan
        <textarea name="message" rows={6} required className={field} {...a11y("message")} />
        {err("message")}
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className={btnDark}>
          Kirim pesan
        </button>
        <p id="form-status" role="status" className="text-sm text-stone">
          {sent && `Aplikasi email kamu terbuka dengan pesan siap kirim ke ${site.email}.`}
        </p>
      </div>
    </form>
  );
}
