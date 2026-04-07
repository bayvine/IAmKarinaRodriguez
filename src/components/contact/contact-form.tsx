"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { HeroDarkSubmitButton } from "@/components/slices/hero/hero-action-link";

type ContactFormProps = {
  submitLabel?: string | null;
  successMessage?: string | null;
};

type FormStatus = "idle" | "loading" | "success" | "error";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

function encode(values: Record<string, string>) {
  return new URLSearchParams(values).toString();
}

export function ContactForm({
  submitLabel,
  successMessage,
}: ContactFormProps) {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encode({
          "form-name": "contact",
          "bot-field": "",
          ...values,
        }),
      });

      if (!response.ok) {
        throw new Error("The form submission did not complete.");
      }

      setStatus("success");
      setValues(initialValues);
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong while sending your message. Please try again or use the direct contact options below.",
      );
    }
  }

  const resolvedSubmitLabel = submitLabel?.trim() || "Send Inquiry";
  const resolvedSuccessMessage =
    successMessage?.trim() ||
    "Thanks. Your message was sent successfully and Karina will be in touch soon.";

  return (
    <div className="mt-8 sm:mt-10">
      <form
        className="space-y-5"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        name="contact"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden">
          <label>
            Don’t fill this out if you’re human:
            <input name="bot-field" />
          </label>
        </p>

        <div className="grid gap-5">
          <label className="block">
            <span className="sr-only">Name</span>
            <input
              autoComplete="name"
              className="w-full border-b border-night/14 bg-transparent px-0 py-3 font-sans text-base text-night outline-none transition duration-200 placeholder:text-night/42 focus:border-night"
              name="name"
              onChange={(event) =>
                setValues((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Jane Doe"
              required
              type="text"
              value={values.name}
            />
          </label>

          <label className="block">
            <span className="sr-only">Email</span>
            <input
              autoComplete="email"
              className="w-full border-b border-night/14 bg-transparent px-0 py-3 font-sans text-base text-night outline-none transition duration-200 placeholder:text-night/42 focus:border-night"
              name="email"
              onChange={(event) =>
                setValues((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="John@Doe.com"
              required
              type="email"
              value={values.email}
            />
          </label>

          <label className="block">
            <span className="sr-only">Phone</span>
            <input
              autoComplete="tel"
              className="w-full border-b border-night/14 bg-transparent px-0 py-3 font-sans text-base text-night outline-none transition duration-200 placeholder:text-night/42 focus:border-night"
              name="phone"
              onChange={(event) =>
                setValues((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="(123) 234-5678"
              type="tel"
              value={values.phone}
            />
          </label>

          <label className="block">
            <span className="sr-only">How can I help?</span>
            <textarea
              className="min-h-32 w-full resize-y border-b border-night/14 bg-transparent px-0 py-3 font-sans text-base text-night outline-none transition duration-200 placeholder:text-night/42 focus:border-night"
              name="message"
              onChange={(event) =>
                setValues((current) => ({ ...current, message: event.target.value }))
              }
              placeholder="Any information you're willing to share with me..."
              required
              value={values.message}
            />
          </label>
        </div>

        <div className="pt-4">
          <HeroDarkSubmitButton
            className="w-full sm:w-full"
            disabled={status === "loading"}
            isLoading={status === "loading"}
            label={resolvedSubmitLabel}
            loadingLabel="Sending..."
          />
        </div>
      </form>

      <div aria-live="polite" className="mt-4">
        {status === "success" ? (
          <div className="flex items-start gap-3 rounded-2xl border border-night/10 bg-night/3 px-4 py-3 text-night">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-bordeaux" />
            <p className="font-sans text-sm">{resolvedSuccessMessage}</p>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="flex items-start gap-3 rounded-2xl border border-accent-bordeaux/24 bg-accent-bordeaux/6 px-4 py-3 text-night">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent-bordeaux" />
            <p className="font-sans text-sm">{errorMessage}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
