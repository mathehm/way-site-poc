import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getEventsByChurchId } from "@/lib/data/events";

/**
 * API Route Handler - Lista de Eventos por Tenant
 *
 * GET /api/public/events
 *
 * Retorna eventos específicos do tenant identificado pelo header X-Tenant-Id
 */
export async function GET() {
  const headersList = await headers();
  const tenantId = headersList.get("X-Tenant-Id");

  if (!tenantId) {
    return NextResponse.json(
      { error: "Tenant not identified" },
      { status: 400 }
    );
  }

  // Buscar eventos do tenant
  const events = getEventsByChurchId(tenantId);

  // Retornar com headers de cache adequados
  return NextResponse.json(
    {
      tenantId,
      count: events.length,
      events,
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Vary por Host para garantir cache isolado por tenant
        "Vary": "Host",
        // Cache na edge da Vercel por 60s, serve stale por 5min
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
