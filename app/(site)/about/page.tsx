import { getCurrentTenant } from "@/lib/tenant/resolve";

/**
 * About Page - Página sobre personalizada por tenant
 */
export const revalidate = 60;

export default async function AboutPage() {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="py-16 text-white"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Sobre a {tenant.name}</h1>
          <p className="text-xl opacity-90">
            Conheça nossa história, missão e valores
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--primary)" }}>
              Nossa História
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              A {tenant.name} nasceu do desejo de criar uma comunidade acolhedora
              onde pessoas de todas as idades e origens pudessem se conectar com
              Deus e uns com os outros. Desde o início, nosso compromisso tem sido
              transformar vidas através do amor, da fé e do serviço.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12" style={{ color: "var(--primary)" }}>
              Missão
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Nossa missão é compartilhar o evangelho de forma relevante e
              autêntica, equipando cada pessoa para viver uma vida de propósito
              e significado. Acreditamos que a fé se expressa através de ações
              concretas de amor e serviço ao próximo.
            </p>

            <h2 className="text-3xl font-bold mb-6 mt-12" style={{ color: "var(--primary)" }}>
              Valores
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-xl mb-3">❤️ Amor</h3>
                <p className="text-gray-600">
                  Demonstramos amor incondicional e acolhemos a todos sem distinção
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-xl mb-3">🙌 Adoração</h3>
                <p className="text-gray-600">
                  Cultivamos uma vida de adoração genuína e comunhão com Deus
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-xl mb-3">📚 Ensino</h3>
                <p className="text-gray-600">
                  Valorizamos o estudo e ensino da Palavra com excelência e relevância
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-xl mb-3">🤝 Comunidade</h3>
                <p className="text-gray-600">
                  Fomentamos relacionamentos autênticos e apoio mútuo
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg mt-12 text-center">
              <p className="text-gray-700 text-lg mb-4">
                <strong>Identificador técnico:</strong> {tenant.churchId}
              </p>
              <p className="text-gray-500 text-sm">
                Este site faz parte da plataforma multi-tenant e é personalizado
                especialmente para a {tenant.name}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
