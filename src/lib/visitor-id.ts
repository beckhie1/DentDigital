"use client";

/**
 * Stable per-visitor id used as Meta `external_id` (advanced matching).
 * Not PII — a random UUID kept in localStorage so the browser pixel and the
 * Conversions API send the same identifier and Meta can match the two.
 */
const KEY = "dd_xid";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(KEY);
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      id = crypto.randomUUID();
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return ""; // private mode / storage blocked
  }
}
