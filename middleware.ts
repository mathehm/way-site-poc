import { NextRequest, NextResponse } from "next/server";
import { getTenantByHost } from "./lib/tenant/config";

/**
 * Middleware Multi-Tenant
 *
 * Roda no Edge Runtime da Vercel.
 * Identifica o tenant pelo header Host e injeta headers customizados.
 */
export function middleware(request: NextRequest) {
  // Em desenvolvimento, Next.js pode normalizar o hostname para localhost
  // Por isso, lemos o header Host diretamente
  const hostHeader = request.headers.get("host") || request.nextUrl.hostname;

  // Normalizar hostname (lowercase, remover porta se houver)
  const normalizedHost = hostHeader.toLowerCase().split(":")[0];

  // Debug: Log para desenvolvimento
  console.log("[Middleware] Host header:", hostHeader);
  console.log("[Middleware] Normalized host:", normalizedHost);

  // Buscar tenant
  const tenant = getTenantByHost(normalizedHost);

  // Se não encontrar tenant, retornar 404
  if (!tenant) {
    console.log("[Middleware] Tenant not found for host:", normalizedHost);
    return new NextResponse(`Tenant not found for host: ${normalizedHost}`, { status: 404 });
  }

  console.log("[Middleware] Tenant found:", tenant.slug);

  // Clonar headers da request
  const requestHeaders = new Headers(request.headers);

  // Injetar headers do tenant
  requestHeaders.set("X-Tenant-Id", tenant.churchId);
  requestHeaders.set("X-Tenant-Slug", tenant.slug);

  // Continuar request com os novos headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Configuração do matcher
 *
 * Aplica middleware em todas as rotas, exceto:
 * - Static files (_next/static)
 * - Assets públicos (imagens, fonts, etc)
 * - Favicon
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
