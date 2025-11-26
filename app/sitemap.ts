import { headers } from "next/headers";
import { MetadataRoute } from "next";
import { getTenantByHost } from "@/lib/tenant/config";

/**
 * Sitemap dinâmico por tenant
 *
 * Gera sitemap específico baseado no host da requisição
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Identificar tenant pelo host
  const tenant = getTenantByHost(host);

  if (!tenant) {
    return [];
  }

  // URL base do tenant
  const baseUrl = `https://${tenant.hosts[0]}`;

  // Rotas públicas
  const routes = [
    "",
    "/events",
    "/about",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/events" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  })) as MetadataRoute.Sitemap;
}
