"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SystemUserRecord } from "@/types/roles";
import { RoleService, RoleOption } from "@/services/roleService";
import StatusPill, { Tone } from "@/components/shared/StatusPill";
import RowActionMenu from "@/components/shared/RowActionMenu";
import TablePagination from "@/components/shared/TablePagination";
import Avatar from "@/components/shared/Avatar";
import Modal, { GOLD_GRADIENT, MODAL_GHOST, MODAL_PRIMARY, RED_GRADIENT } from "@/components/shared/Modal";

/**
 * User List — Figma 59:18134.
 *
 * Eight columns: # 50, User Name 170, Phone and Mail share, Role 135, Last
 * Login shares, Status 100, Action 83. Rows 54 tall with 12px cells. Below md
 * the grid cannot hold them, so each row becomes a card.
 */

const GRID = "grid-cols-[50px_170px_1fr_1fr_135px_1fr_100px_83px]";
const CELL = "flex items-center px-[12px]";
const HEAD =
  "text-[14px] leading-[1.5] font-medium tracking-[-0.28px] text-[#1e1e1e] whitespace-nowrap";
const BODY =
  "text-[14px] leading-[1.5] font-medium tracking-[-0.28px] text-[#525252] whitespace-nowrap";
const FIELD =
  "h-[44px] w-full rounded-[10px] bg-white px-[12px] text-[14px] text-[#1e1e1e] shadow-[inset_0_0_0_1px_#eaeaea] outline-none focus:shadow-[inset_0_0_0_1.5px_#f5b800]";

const STATUS_TONE: Record<SystemUserRecord["status"], Tone> = {
  Active: "green",
  Inactive: "rose",
};

const FILTERS = ["All Users", "Active", "Inactive"] as const;

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <circle cx="11" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0">
      <path d="M2.25 4.5h13.5M4.5 9h9m-6.75 4.5h4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CaretIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="m5.5 7.75 4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
      <path d="M10 4.375v11.25M4.375 10h11.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function RolesPermissionsPage() {
  const [rows, setRows] = useState<SystemUserRecord[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All Users");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [roleOf, setRoleOf] = useState<SystemUserRecord | null>(null);
  const [nextRole, setNextRole] = useState("");
  const [dropOf, setDropOf] = useState<SystemUserRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await RoleService.getUsers({
          search: query || undefined,
          status: filter === "All Users" ? undefined : filter,
          page,
          limit: pageSize,
        });
        if (cancelled) return;
        setRows(res.data);
        setTotal(res.total);
      } catch (e) {
        if (!cancelled) setNote(RoleService.describeError(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query, filter, page, pageSize, reloadKey]);

  useEffect(() => {
    let cancelled = false;
    RoleService.getRoles()
      .then((r) => !cancelled && setRoles(r))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!filterOpen) return;
    const onDown = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFilterOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  const act = async (fn: () => Promise<void>, done: string) => {
    setSaving(true);
    try {
      await fn();
      setNote(done);
      setRoleOf(null);
      setDropOf(null);
      setReloadKey((k) => k + 1);
    } catch (e) {
      setNote(RoleService.describeError(e));
    } finally {
      setSaving(false);
    }
  };

  const openRole = (row: SystemUserRecord) => {
    setNextRole(row.role.split(" ")[0] === "—" ? "" : row.role.split(" ")[0]);
    setRoleOf(row);
  };

  return (
    <div className="flex w-full flex-col gap-[14px] select-none">
      {/* Headline — 59:18136 */}
      <div className="flex w-full flex-col items-stretch gap-[16px] lg:h-[48px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div className="flex h-[44px] w-full items-center justify-between gap-[12px] overflow-clip rounded-[10px] bg-white px-[12px] py-[10px] shadow-[inset_0_0_0_1px_#eaeaea] lg:w-[370px]">
          <div className="flex min-w-0 flex-1 items-center gap-[6px] text-[#525252]">
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, phone or role..."
              aria-label="Search users"
              className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.5] tracking-[-0.28px] text-[#525252] outline-none placeholder:text-[#525252]"
            />
          </div>
          <button
            type="button"
            aria-label="Filter"
            onClick={() => setFilterOpen((v) => !v)}
            className="shrink-0 cursor-pointer text-[#525252] transition-colors hover:text-[#1e1e1e]"
          >
            <FilterIcon />
          </button>
        </div>

        <div className="flex flex-col items-stretch gap-[12px] sm:flex-row sm:items-center sm:gap-[16px]">
          <div ref={filterRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={filterOpen}
              className="flex h-[48px] w-full cursor-pointer items-center justify-between gap-[12px] rounded-[12px] border border-solid border-[#eaeaea] bg-white px-[16px] py-[12px] text-[16px] leading-[24px] font-medium whitespace-nowrap text-[#525252] transition-colors hover:bg-[#fafafa] sm:w-auto"
            >
              {filter}
              <CaretIcon open={filterOpen} />
            </button>

            {filterOpen && (
              <ul
                role="listbox"
                className="absolute right-0 z-30 mt-[6px] w-[168px] overflow-hidden rounded-[10px] border border-[#eaeaea] bg-white py-[4px] shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
              >
                {FILTERS.map((f) => (
                  <li key={f}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={f === filter}
                      onClick={() => {
                        setFilter(f);
                        setPage(1);
                        setFilterOpen(false);
                      }}
                      className={`w-full cursor-pointer px-[14px] py-[9px] text-left text-[14px] transition-colors hover:bg-[#fdf7e6] ${
                        f === filter ? "bg-[#fdf7e6] font-medium text-[#1e1e1e]" : "text-[#525252]"
                      }`}
                    >
                      {f}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href="/roles-permissions/add"
            style={{ backgroundImage: GOLD_GRADIENT }}
            className="flex h-[48px] shrink-0 cursor-pointer items-center justify-center gap-[12px] rounded-[12px] px-[16px] py-[8px] text-[16px] leading-[24px] font-semibold whitespace-nowrap text-white shadow-[inset_0px_0px_1.5px_0px_rgba(255,255,255,0.25)]"
          >
            <AddIcon />
            Add New
          </Link>
        </div>
      </div>

      {/* Table card — 59:18163 */}
      <div className="w-full overflow-hidden rounded-[12px] bg-white shadow-[inset_0_0_0_1px_#eaeaea]">
        {note && (
          <p role="status" className="mx-[16px] mt-[16px] rounded-[8px] bg-[#fdf7e6] px-[12px] py-[8px] text-[13px] text-[#6d5b46]">
            {note}
          </p>
        )}

        <div className="hidden px-[16px] pt-[16px] md:block">
          <div className="overflow-x-auto">
            <div className="min-w-[1050px]">
              <div className={`grid ${GRID} items-start overflow-clip`}>
                <div className={`${CELL} h-[40px] border-b border-solid border-[#eaeaea]`}><span className={HEAD}>#</span></div>
                <div className={`${CELL} h-[40px] border-b border-solid border-[#eaeaea]`}><span className={HEAD}>User Name</span></div>
                <div className={`${CELL} h-[40px] border-b border-solid border-[#eaeaea]`}><span className={HEAD}>Phone</span></div>
                <div className={`${CELL} h-[40px] border-b border-solid border-[#eaeaea]`}><span className={HEAD}>Mail</span></div>
                <div className={`${CELL} h-[40px] border-b border-solid border-[#eaeaea]`}><span className={HEAD}>Role</span></div>
                <div className={`${CELL} h-[40px] border-b border-solid border-[#eaeaea]`}><span className={HEAD}>Last Login</span></div>
                <div className={`${CELL} h-[40px] justify-center border-b border-solid border-[#eaeaea]`}><span className={HEAD}>Status</span></div>
                <div className={`${CELL} h-[40px] justify-center border-b border-solid border-[#eaeaea]`}><span className={HEAD}>Action</span></div>

                {loading && (
                  <div className="col-span-8 px-[12px] py-[28px] text-center text-[14px] text-[#525252]">
                    Loading users...
                  </div>
                )}

                {!loading && rows.length === 0 && (
                  <div className="col-span-8 px-[12px] py-[28px] text-center text-[14px] text-[#525252]">
                    No users match this view.
                  </div>
                )}

                {!loading &&
                  rows.map((u) => (
                    <React.Fragment key={u.id}>
                      <div className={`${CELL} h-[54px] border-b border-solid border-[#eaeaea]`}>
                        <span className={BODY}>{u.index}</span>
                      </div>
                      <div className={`${CELL} h-[54px] gap-[8px] border-b border-solid border-[#eaeaea]`}>
                        <Avatar radius={4} name={u.name} />
                        <span className={`${BODY} truncate`}>{u.name}</span>
                      </div>
                      <div className={`${CELL} h-[54px] border-b border-solid border-[#eaeaea]`}>
                        <span className={`${BODY} truncate`}>{u.phone}</span>
                      </div>
                      <div className={`${CELL} h-[54px] border-b border-solid border-[#eaeaea]`}>
                        <span className={`${BODY} truncate`}>{u.mail}</span>
                      </div>
                      <div className={`${CELL} h-[54px] border-b border-solid border-[#eaeaea]`}>
                        <span className={`${BODY} truncate`}>{u.role}</span>
                      </div>
                      <div className={`${CELL} h-[54px] border-b border-solid border-[#eaeaea]`}>
                        <span className={BODY}>{u.lastLogin}</span>
                      </div>
                      <div className={`${CELL} h-[54px] justify-center border-b border-solid border-[#eaeaea]`}>
                        <StatusPill label={u.status} tone={STATUS_TONE[u.status]} />
                      </div>
                      <div className={`${CELL} h-[54px] justify-center border-b border-solid border-[#eaeaea]`}>
                        <RowActionMenu
                          label={`Actions for ${u.name}`}
                          actions={[
                            { label: "Change role", onSelect: () => openRole(u) },
                            {
                              label: "Resend invite",
                              onSelect: () =>
                                act(() => RoleService.resendInvite(u.id), `Invitation sent to ${u.mail}.`),
                            },
                            ...(u.status === "Active"
                              ? [{ label: "Deactivate", onSelect: () => setDropOf(u) }]
                              : []),
                          ]}
                        />
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Below md the grid cannot hold eight columns; each row becomes a card. */}
        <div className="flex flex-col gap-[10px] px-[16px] pt-[16px] md:hidden">
          {rows.map((u) => (
            <div key={u.id} className="rounded-[10px] p-[12px] shadow-[inset_0_0_0_1px_#eaeaea]">
              <div className="flex items-start justify-between gap-[10px]">
                <div className="flex min-w-0 items-center gap-[8px]">
                  <Avatar radius={4} name={u.name} />
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium text-[#1e1e1e]">{u.name}</p>
                    <p className="truncate text-[13px] text-[#525252]">{u.mail}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-[8px]">
                  <StatusPill label={u.status} tone={STATUS_TONE[u.status]} />
                  <RowActionMenu
                    label={`Actions for ${u.name}`}
                    actions={[
                      { label: "Change role", onSelect: () => openRole(u) },
                      {
                        label: "Resend invite",
                        onSelect: () =>
                          act(() => RoleService.resendInvite(u.id), `Invitation sent to ${u.mail}.`),
                      },
                      ...(u.status === "Active"
                        ? [{ label: "Deactivate", onSelect: () => setDropOf(u) }]
                        : []),
                    ]}
                  />
                </div>
              </div>
              <div className="mt-[8px] grid grid-cols-2 gap-x-[12px] gap-y-[4px] text-[13px] text-[#525252]">
                <span className="truncate">{u.phone}</span>
                <span className="truncate text-right">{u.role}</span>
                <span className="col-span-2">Last login {u.lastLogin}</span>
              </div>
            </div>
          ))}
        </div>

        <TablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(n) => {
            setPageSize(n);
            setPage(1);
          }}
        />
      </div>

      {/* Change role */}
      <Modal
        open={roleOf !== null}
        onClose={() => setRoleOf(null)}
        title="Change role"
        width={420}
        footer={
          <>
            <button type="button" className={MODAL_GHOST} onClick={() => setRoleOf(null)}>
              Cancel
            </button>
            <button
              type="button"
              disabled={saving || !nextRole}
              style={{ backgroundImage: GOLD_GRADIENT }}
              className={`${MODAL_PRIMARY} disabled:cursor-not-allowed disabled:opacity-60`}
              onClick={() =>
                roleOf &&
                act(
                  () => RoleService.setRole(roleOf.id, nextRole),
                  `${roleOf.name} is now ${nextRole}.`
                )
              }
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center gap-[12px]">
            <Avatar radius={4} name={roleOf?.name ?? ""} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium text-[#1e1e1e]">{roleOf?.name}</p>
              <p className="truncate text-[13px] text-[#525252]">{roleOf?.mail}</p>
            </div>
          </div>

          <label className="flex flex-col gap-[6px]">
            <span className="text-[13px] font-medium text-[#1e1e1e]">Role</span>
            <select value={nextRole} onChange={(e) => setNextRole(e.target.value)} className={FIELD}>
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Modal>

      {/* Deactivate */}
      <Modal
        open={dropOf !== null}
        onClose={() => setDropOf(null)}
        title="Deactivate user"
        width={420}
        footer={
          <>
            <button type="button" className={MODAL_GHOST} onClick={() => setDropOf(null)}>
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              style={{ backgroundImage: RED_GRADIENT }}
              className={`${MODAL_PRIMARY} disabled:cursor-not-allowed disabled:opacity-60`}
              onClick={() =>
                dropOf && act(() => RoleService.deactivate(dropOf.id), `${dropOf.name} deactivated.`)
              }
            >
              {saving ? "Working..." : "Deactivate"}
            </button>
          </>
        }
      >
        <p className="text-[14px] leading-[1.6] text-[#525252]">
          <span className="font-medium text-[#1e1e1e]">{dropOf?.name}</span> will not be able to
          sign in and stops using a plan seat. Their history is kept.
        </p>
      </Modal>
    </div>
  );
}
