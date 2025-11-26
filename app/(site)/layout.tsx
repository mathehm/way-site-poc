import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getCurrentTenant } from "@/lib/tenant/resolve";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Layout Multi-Tenant
 *
 * Server Component que aplica tema e SEO por tenant
 */
export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    return {
      title: "Not Found",
      description: "Tenant not found",
    };
  }

  return {
    title: tenant.seo.title,
    description: tenant.seo.description,
    openGraph: {
      title: tenant.seo.title,
      description: tenant.seo.description,
      images: tenant.seo.ogImage ? [tenant.seo.ogImage] : [],
    },
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    return (
      <html lang="pt-BR">
        <body>Tenant not found</body>
      </html>
    );
  }

  // Aplicar CSS variables do tenant
  const themeStyles = {
    "--primary": tenant.theme.primary,
    "--secondary": tenant.theme.secondary || tenant.theme.primary,
  } as React.CSSProperties;

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={themeStyles}
      >
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b bg-white">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tenant.theme.logo}
                  alt={`${tenant.name} logo`}
                  className="h-10 w-10"
                />
                <h1 className="text-xl font-bold" style={{ color: "var(--primary)" }}>
                  {tenant.name}
                </h1>
              </div>

              <nav className="flex gap-6">
                <a
                  href="/"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Início
                </a>
                <a
                  href="/events"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Eventos
                </a>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sobre
                </a>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-sm text-gray-600">
                <p>&copy; {new Date().getFullYear()} {tenant.name}. Todos os direitos reservados.</p>
                <p className="mt-2 text-xs text-gray-500">
                  Plataforma Multi-Tenant • churchId: {tenant.churchId}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
