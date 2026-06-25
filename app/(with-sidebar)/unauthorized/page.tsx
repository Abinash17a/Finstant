"use client";

import Link from "next/link";
import { ShieldX, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-hover)] p-10 text-center text-white">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm mx-auto flex items-center justify-center border border-white/20">
              <ShieldX className="w-12 h-12 text-[var(--color-accent)]" />
            </div>

            <h1 className="text-4xl font-bold mt-6">
              401 Unauthorized
            </h1>

            <p className="mt-3 text-white/80 text-lg">
              You don't have permission to access this page.
            </p>
          </div>

          {/* Content */}
          <div className="p-10">

            <div className="flex items-start gap-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] p-5">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-[var(--color-brand)]" />
              </div>

              <div>
                <h3 className="font-semibold text-[var(--color-ink)]">
                  Access Restricted
                </h3>

                <p className="text-sm text-[var(--color-muted)] mt-1 leading-6">
                  This section requires authentication or additional permissions.
                  Please sign in with an authorized account or contact your
                  administrator if you believe this is an error.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">

              <Button
                asChild
                className="h-11 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
              >
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 border-[var(--color-border)]"
              >
                <Link href="/">
                  Go to Home
                </Link>
              </Button>

            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-[var(--color-muted)]">
                Need access? Contact your administrator or log in with the correct account.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}