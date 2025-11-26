import { getCurrentTenant } from "@/lib/tenant/resolve";
import { getEventsByChurchId } from "@/lib/data/events";

/**
 * Events Page - Lista de eventos por tenant
 */
export const revalidate = 60;

export default async function EventsPage() {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  const events = getEventsByChurchId(tenant.churchId);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)]">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>
            Próximos Eventos
          </h1>
          <p className="text-gray-600 text-lg">
            Confira nossa programação e participe dos nossos eventos
          </p>
        </div>

        {/* Lista de Eventos */}
        {events.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">Nenhum evento agendado no momento.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="h-3"
                  style={{ backgroundColor: "var(--primary)" }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">📅</span>
                      <span>
                        {new Date(event.date + "T00:00:00").toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">🕐</span>
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <button
                    className="mt-6 w-full py-2 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    Mais Informações
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
