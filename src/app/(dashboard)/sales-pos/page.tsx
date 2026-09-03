import { redirect } from "next/navigation";

/**
 * The till moved out of the dashboard into its own environment at /pos.
 * This keeps every bookmark, link and typed URL working.
 */
export default function SalesPosRedirect() {
  redirect("/pos");
}
