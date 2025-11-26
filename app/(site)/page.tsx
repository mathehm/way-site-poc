import { getCurrentTenant } from "@/lib/tenant/resolve";

/**
 * Home Page - Server Component com ISR
 */
export const revalidate = 60; // ISR: revalidar a cada 60 segundos

export default async function HomePage() {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="py-20 text-white"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bem-vindo à {tenant.name}
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Uma comunidade de fé, esperança e amor. Junte-se a nós!
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <a
              href="/events"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver Eventos
            </a>
            <a
              href="/about"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Sobre Nós
            </a>
          </div>
        </div>
      </section>

      {/* Blocos de Conteúdo */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: "var(--primary)" }}
              >
                🙏
              </div>
              <h3 className="text-xl font-bold mb-2">Cultos</h3>
              <p className="text-gray-600">
                Momentos de adoração e comunhão com encontros semanais
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: "var(--primary)" }}
              >
                👥
              </div>
              <h3 className="text-xl font-bold mb-2">Comunidade</h3>
              <p className="text-gray-600">
                Conecte-se com pessoas que compartilham dos mesmos valores
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: "var(--primary)" }}
              >
                📖
              </div>
              <h3 className="text-xl font-bold mb-2">Ensino</h3>
              <p className="text-gray-600">
                Estudo bíblico aprofundado e aplicação prática para a vida
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Faça Parte da Nossa Comunidade
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Venha nos visitar e descubra como podemos crescer juntos na fé
          </p>
          <a
            href="/events"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Conheça Nossos Eventos
          </a>
        </div>
      </section>
    </div>
  );
}
