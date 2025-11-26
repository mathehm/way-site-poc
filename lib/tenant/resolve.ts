import { headers } from "next/headers";
import { getTenantBySlug, type TenantConfig } from "./config";

/**
 * Server-side helper para obter o tenant atual
 *
 * Lê os headers injetados pelo middleware.ts
 */
export async function getCurrentTenant(): Promise<TenantConfig | null> {
  const headersList = await headers();
  const tenantSlug = headersList.get("X-Tenant-Slug");

  if (!tenantSlug) {
    return null;
  }

  return getTenantBySlug(tenantSlug);
}

/**
 * Server-side helper para obter o tenant ID
 */
export async function getCurrentTenantId(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("X-Tenant-Id");
}

/**
 * Server-side helper para obter o tenant slug
 */
export async function getCurrentTenantSlug(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("X-Tenant-Slug");
}
