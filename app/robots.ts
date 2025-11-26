import { headers } from "next/headers";
import { MetadataRoute } from "next";
import { getTenantByHost } from "@/lib/tenant/config";

/**
 * Robots.txt dinâmico por tenant
 *
 * Gera robots.txt específico baseado no host da requisição
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Identificar tenant pelo host
  const tenant = getTenantByHost(host);

  if (!tenant) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // URL base do tenant
  const baseUrl = `https://${tenant.hosts[0]}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
