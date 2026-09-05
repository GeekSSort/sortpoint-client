"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlatformService, TenantRow } from "@/services/platformService";
import { AuthService } from "@/services/authService";
import { ApiError } from "@/services/apiClient";

/**
 * The console home: every customer company on the platform.
 *
 * Where our own staff land after signing in at the console address. Before
 * this page existed they landed on /dashboard, a shop screen that refuses a
 * console token on every request.
 *
 * Plain on purpose. The server already returns plan, status and counts in one
 * query, so showing them costs nothing.
 */

const STATUS_TONE: Record<string, string> = {
  ACTIVE: "bg-[#e4f0e9] text-[#1c6b45]",
  TRIALING: "bg-[#eef4fd] text-[#1b4a8a]",
  PAST_DUE: "bg-[#faeedd] text-[#8a5209]",
  SUSPENDED: "bg-[#f9e8e6] text-[#a02620]",
  CANCELLED: "bg-[#ececec] text-[#525252]",
};

export default function PlatformHomePage() {
  const router = useRouter();
  const [rows, setRows] = useState<TenantRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await PlatformService.listTenants(search || undefined);
        if (cancelled) return;
        setRows(res.data);
        setTotal(res.total);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof ApiError && e.code === "REALM_MISMATCH"
            ? "This is a shop account. The console needs a SORTPoint staff sign-in."
            : e instanceof ApiError
              ? e.message
              : "Could not load companies."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search]);

  return (
    <div className="min-h-screen bg-[#faf9f7] px-[24px] py-[28px]">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-[20px]">
        <header className="flex flex-wrap items-center justify-between gap-[12px]">
          <div>
            <p className="text-[12px] font-medium tracking-[0.12em] text-[#8a5209] uppercase">
              Platform console
            </p>
            <h1 className="text-[26px] leading-[1.2] font-semibold tracking-[-0.5px] text-[#1e1e1e]">
              Customer companies
            </h1>
          </div>
          <button
            type="button"
            onClick={async () => {
              await AuthService.logout();
              router.replace("/login");
            }}
            className="h-[40px] cursor-pointer rounded-[10px] border border-[#e5e5e5] bg-white px-[16px] text-[14px] font-medium text-[#525252] transition-colors hover:bg-[#f5f5f5]"
          >
            Sign out
          </button>
        </header>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or address…"
          className="h-[44px] w-full max-w-[380px] rounded-[10px] border border-[#e5e5e5] bg-white px-[14px] text-[14px] outline-none focus:border-[#1e1e1e]"
        />

        {error && (
          <p role="alert" className="rounded-[10px] bg-[#f9e8e6] px-[16px] py-[12px] text-[14px] font-medium text-[#a02620]">
            {error}
          </p>
        )}

        <div className="overflow-x-auto rounded-[12px] border border-[#e5e5e5] bg-white">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#e5e5e5] text-left text-[12px] tracking-[0.06em] text-[#737373] uppercase">
                <th className="px-[16px] py-[12px] font-medium">Company</th>
                <th className="px-[16px] py-[12px] font-medium">Address</th>
                <th className="px-[16px] py-[12px] font-medium">Plan</th>
                <th className="px-[16px] py-[12px] font-medium">Status</th>
                <th className="px-[16px] py-[12px] text-right font-medium">Branches</th>
                <th className="px-[16px] py-[12px] text-right font-medium">Staff</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-[16px] py-[24px] text-center text-[#737373]">
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && rows.length === 0 && !error && (
                <tr>
                  <td colSpan={6} className="px-[16px] py-[24px] text-center text-[#737373]">
                    No companies yet.
                  </td>
                </tr>
              )}

              {rows.map((t) => (
                <tr key={t.id} className="border-b border-[#f0f0f0] last:border-b-0">
                  <td className="px-[16px] py-[12px] font-medium text-[#1e1e1e]">{t.name}</td>
                  <td className="px-[16px] py-[12px] font-mono text-[13px] text-[#525252]">
                    {t.subdomain ? `${t.subdomain}.` : <span className="text-[#a3a3a3]">not set</span>}
                  </td>
                  <td className="px-[16px] py-[12px] text-[#525252]">{t.plan ?? "—"}</td>
                  <td className="px-[16px] py-[12px]">
                    <span
                      className={`rounded-[4px] px-[8px] py-[3px] text-[12px] font-medium ${
                        STATUS_TONE[t.status || ""] || "bg-[#ececec] text-[#525252]"
                      }`}
                    >
                      {t.status ?? "none"}
                    </span>
                  </td>
                  <td className="px-[16px] py-[12px] text-right tabular-nums text-[#525252]">{t.branchCount}</td>
                  <td className="px-[16px] py-[12px] text-right tabular-nums text-[#525252]">{t.userCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && !error && (
          <p className="text-[13px] text-[#737373]">
            {total} {total === 1 ? "company" : "companies"}
          </p>
        )}
      </div>
    </div>
  );
}
