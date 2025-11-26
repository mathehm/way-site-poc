/**
 * Tenant Configuration
 *
 * Define todos os tenants suportados pela plataforma.
 * Em produção, isso poderia vir de um banco de dados.
 */

export interface TenantConfig {
  slug: string;
  churchId: string;
  name: string;
  hosts: string[];
  theme: {
    primary: string;
    secondary?: string;
    logo: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
}

export const tenants: TenantConfig[] = [
  {
    slug: "igreja-a",
    churchId: "ch_01",
    name: "Igreja A",
    hosts: [
      "igreja-a.sua-plataforma.com",
      "igreja-a.lvh.me",
      "way-site-poc.vercel.app", // Domínio padrão da Vercel
    ],
    theme: {
      primary: "#2563eb",
      logo: "/logos/a.svg",
    },
    seo: {
      title: "Igreja A - Bem-vindo",
      description: "Igreja A - Uma comunidade de fé e esperança",
      ogImage: "/og/igreja-a.jpg",
    },
  },
  {
    slug: "igreja-b",
    churchId: "ch_02",
    name: "Igreja B",
    hosts: [
      "igreja-b.sua-plataforma.com",
      "igreja-b.lvh.me",
    ],
    theme: {
      primary: "#16a34a",
      logo: "/logos/b.svg",
    },
    seo: {
      title: "Igreja B - Bem-vindo",
      description: "Igreja B - Transformando vidas através do amor",
      ogImage: "/og/igreja-b.jpg",
    },
  },
  {
    slug: "vida",
    churchId: "ch_99",
    name: "Igreja Vida",
    hosts: [
      "www.igreja-vida.com.br",
      "igreja-vida.com.br",
      "vida.lvh.me",
    ],
    theme: {
      primary: "#7c3aed",
      logo: "/logos/vida.svg",
    },
    seo: {
      title: "Igreja Vida - Comunidade de Vida",
      description: "Igreja Vida - Vivendo o propósito de Deus",
      ogImage: "/og/vida.jpg",
    },
  },
];

/**
 * Mapa otimizado para lookup rápido por host
 */
const hostToTenantMap = new Map<string, TenantConfig>();

tenants.forEach((tenant) => {
  tenant.hosts.forEach((host) => {
    hostToTenantMap.set(host.toLowerCase(), tenant);
  });
});

export function getTenantByHost(host: string): TenantConfig | null {
  const normalizedHost = host.toLowerCase();
  return hostToTenantMap.get(normalizedHost) || null;
}

export function getTenantBySlug(slug: string): TenantConfig | null {
  return tenants.find((t) => t.slug === slug) || null;
}

export function getTenantByChurchId(churchId: string): TenantConfig | null {
  return tenants.find((t) => t.churchId === churchId) || null;
}
