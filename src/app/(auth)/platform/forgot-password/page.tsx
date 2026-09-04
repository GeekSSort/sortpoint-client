"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell, { AuthAlert, AuthButton, AuthField } from "@/components/auth/AuthShell";
import { RegistrationService } from "@/services/registrationService";

/**
 * Forgotten password, for OUR OWN staff — the platform console.
 *
 * A separate page from the company one, and that separation is the point.
 *
 * Platform staff belong to no company. If this ran through the same route as a
 * company's reset, then a customer's own address could be used to start a
 * password reset on one of our admin accounts — and the email would arrive
 * looking entirely genuine. So it is its own page, its own server route, and
 * it does not care which address it is opened on.
 *
 * Opening it on a customer's address is a mistake, not a shortcut. The banner
 * below says so, and the server refuses it regardless.
 */
export default function PlatformForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await RegistrationService.requestCode(email.trim(), "platform");
      router.push(
        `/verify-code?email=${encodeURIComponent(email.trim())}&purpose=reset&realm=platform`
      );
    } catch (err) {
      setError(RegistrationService.describeError(err));
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Console password reset"
      subtitle="For SORTPoint staff only. Customers should use their own company address."
      onSubmit={submit}
      footer={
        <>
          Not staff?
          <Link href="/login" className="font-medium text-[#f5b800]">
            Company sign in
          </Link>
        </>
      }
    >
      <AuthAlert tone="info">
        This resets a SORTPoint staff account, not a customer account. It works only
        on the console address.
      </AuthAlert>

      <AuthField
        label="Staff email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@sortpoint.com"
        required
        autoComplete="email"
      />

      {error && <AuthAlert>{error}</AuthAlert>}

      <AuthButton type="submit" disabled={busy}>
        {busy ? "Sending…" : "Send code"}
      </AuthButton>
    </AuthShell>
  );
}
