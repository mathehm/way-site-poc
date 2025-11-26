# 💡 Exemplos Práticos

Exemplos de código para casos de uso comuns na arquitetura multi-tenant.

## 📄 Server Components

### Exemplo 1: Página Simples com Tenant

```typescript
// app/(site)/contact/page.tsx
import { getCurrentTenant } from "@/lib/tenant/resolve";

export const revalidate = 60;

export default async function ContactPage() {
  const tenant = await getCurrentTenant();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--primary)" }}>
        Entre em Contato com a {tenant.name}
      </h1>

      <p className="text-gray-600">
        Envie uma mensagem para a equipe da {tenant.name}
      </p>

      {/* Formulário de contato */}
    </div>
  );
}
```

### Exemplo 2: Buscar Dados Específicos do Tenant

```typescript
// app/(site)/members/page.tsx
import { getCurrentTenant } from "@/lib/tenant/resolve";
import { getMembersByChurchId } from "@/lib/data/members";

export const revalidate = 60;

export default async function MembersPage() {
  const tenant = await getCurrentTenant();
  const members = getMembersByChurchId(tenant.churchId);

  return (
    <div>
      <h1>Membros da {tenant.name}</h1>
      <p>Total: {members.length}</p>

      <div className="grid grid-cols-3 gap-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
```

## 🎨 Usando CSS Variables do Tenant

### Exemplo 3: Botão com Cor do Tenant

```typescript
// components/PrimaryButton.tsx
export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
      style={{ backgroundColor: "var(--primary)" }}
    >
      {children}
    </button>
  );
}
```

### Exemplo 4: Card com Borda Colorida

```typescript
// components/EventCard.tsx
interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Barra superior com cor do tenant */}
      <div
        className="h-2"
        style={{ backgroundColor: "var(--primary)" }}
      />

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-gray-600">{event.description}</p>
      </div>
    </div>
  );
}
```

## 🔌 API Routes

### Exemplo 5: API com Dados do Tenant

```typescript
// app/api/public/ministers/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getMinistersByChurchId } from "@/lib/data/ministers";

export async function GET() {
  const headersList = await headers();
  const tenantId = headersList.get("X-Tenant-Id");

  if (!tenantId) {
    return NextResponse.json(
      { error: "Tenant not identified" },
      { status: 400 }
    );
  }

  const ministers = getMinistersByChurchId(tenantId);

  return NextResponse.json(
    { tenantId, ministers },
    {
      headers: {
        "Vary": "Host",
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
```

### Exemplo 6: API POST com Validação de Tenant

```typescript
// app/api/public/messages/route.ts
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const tenantId = headersList.get("X-Tenant-Id");

  if (!tenantId) {
    return NextResponse.json(
      { error: "Tenant not identified" },
      { status: 400 }
    );
  }

  const body = await request.json();

  // Validar dados
  if (!body.name || !body.message) {
    return NextResponse.json(
      { error: "Name and message are required" },
      { status: 400 }
    );
  }

  // Salvar mensagem associada ao tenant
  const message = {
    id: generateId(),
    churchId: tenantId, // ✅ Sempre associar ao tenant
    name: body.name,
    message: body.message,
    createdAt: new Date().toISOString(),
  };

  // await saveMessage(message); // Salvar no banco

  return NextResponse.json(
    { success: true, message },
    { status: 201 }
  );
}
```

## 🗂️ Estrutura de Dados

### Exemplo 7: Arquivo de Mock de Dados

```typescript
// lib/data/ministers.ts
export interface Minister {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
}

const ministersData: Record<string, Minister[]> = {
  ch_01: [
    {
      id: "min_01_01",
      name: "Pastor João Silva",
      role: "Pastor Presidente",
      photo: "/ministers/joao.jpg",
      bio: "Líder espiritual com 20 anos de ministério",
    },
    {
      id: "min_01_02",
      name: "Pastora Maria Santos",
      role: "Pastora de Jovens",
      photo: "/ministers/maria.jpg",
      bio: "Dedicada ao ministério jovem há 10 anos",
    },
  ],
  ch_02: [
    // Ministros da Igreja B
  ],
  ch_99: [
    // Ministros da Igreja Vida
  ],
};

export function getMinistersByChurchId(churchId: string): Minister[] {
  return ministersData[churchId] || [];
}

export function getMinisterById(churchId: string, ministerId: string): Minister | null {
  const ministers = getMinistersByChurchId(churchId);
  return ministers.find((m) => m.id === ministerId) || null;
}
```

### Exemplo 8: Dados com Relacionamentos

```typescript
// lib/data/classes.ts
export interface Class {
  id: string;
  title: string;
  description: string;
  ministerId: string; // FK para minister
  schedule: {
    day: string;
    time: string;
  };
}

const classesData: Record<string, Class[]> = {
  ch_01: [
    {
      id: "cls_01_01",
      title: "Escola Bíblica Dominical",
      description: "Estudo aprofundado da Palavra",
      ministerId: "min_01_01",
      schedule: {
        day: "Domingo",
        time: "09:00",
      },
    },
  ],
  // ...
};

export function getClassesByChurchId(churchId: string): Class[] {
  return classesData[churchId] || [];
}

// Helper para popular ministro na classe
export async function getClassesWithMinisters(churchId: string) {
  const classes = getClassesByChurchId(churchId);
  const ministers = getMinistersByChurchId(churchId);

  return classes.map((cls) => ({
    ...cls,
    minister: ministers.find((m) => m.id === cls.ministerId),
  }));
}
```

## 🎭 Layouts Customizados por Tenant

### Exemplo 9: Override de Layout para Tenant Específico

```typescript
// app/(tenants)/[slug]/layout.tsx
import { notFound } from "next/navigation";
import { getTenantBySlug } from "@/lib/tenant/config";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export default function TenantSpecificLayout({
  children,
  params,
}: TenantLayoutProps) {
  const tenant = getTenantBySlug(params.slug);

  if (!tenant) {
    notFound();
  }

  // Layout completamente customizado para este tenant
  return (
    <div className="custom-layout">
      <header className="custom-header">
        <h1>{tenant.name} - Layout Especial</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
```

### Exemplo 10: Página Override por Tenant

```typescript
// app/(tenants)/vida/page.tsx
// Página especial apenas para Igreja Vida

export default function VidaHomePage() {
  return (
    <div>
      <h1>Experiência Vida</h1>
      {/* Conteúdo completamente diferente */}
      <video src="/videos/vida-intro.mp4" autoPlay />
    </div>
  );
}
```

## 🔍 SEO e Metadata

### Exemplo 11: Metadata Dinâmica Avançada

```typescript
// app/(site)/events/[id]/page.tsx
import { Metadata } from "next";
import { getCurrentTenant } from "@/lib/tenant/resolve";
import { getEventById } from "@/lib/data/events";

interface EventPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  const event = getEventById(tenant.churchId, params.id);

  if (!event) {
    return {
      title: "Evento não encontrado",
    };
  }

  return {
    title: `${event.title} - ${tenant.name}`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [
        {
          url: event.image || tenant.seo.ogImage,
          width: 1200,
          height: 630,
        },
      ],
      siteName: tenant.name,
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description,
      images: [event.image || tenant.seo.ogImage],
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const tenant = await getCurrentTenant();
  const event = getEventById(tenant.churchId, params.id);

  if (!event) {
    return <div>Evento não encontrado</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
    </div>
  );
}
```

## 📊 Analytics por Tenant

### Exemplo 12: Tracking de Eventos por Tenant

```typescript
// lib/analytics.ts
import { getCurrentTenant } from "@/lib/tenant/resolve";

export async function trackEvent(eventName: string, properties?: Record<string, any>) {
  const tenant = await getCurrentTenant();

  if (!tenant) return;

  // Enviar para analytics (ex: PostHog, Mixpanel)
  await fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: eventName,
      properties: {
        ...properties,
        tenant_id: tenant.churchId,
        tenant_slug: tenant.slug,
      },
    }),
  });
}

// Uso
await trackEvent("page_view", { page: "/events" });
await trackEvent("button_click", { button: "register" });
```

## 🔄 Formulários Multi-Tenant

### Exemplo 13: Form com Server Action

```typescript
// app/(site)/contact/page.tsx
import { getCurrentTenant } from "@/lib/tenant/resolve";

async function submitContactForm(formData: FormData) {
  "use server";

  const tenant = await getCurrentTenant();

  const data = {
    churchId: tenant.churchId,
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  // Salvar no banco de dados associado ao tenant
  // await saveContactMessage(data);

  return { success: true };
}

export default async function ContactPage() {
  const tenant = await getCurrentTenant();

  return (
    <form action={submitContactForm}>
      <h1>Contato - {tenant.name}</h1>

      <input type="text" name="name" placeholder="Nome" required />
      <input type="email" name="email" placeholder="E-mail" required />
      <textarea name="message" placeholder="Mensagem" required />

      <button
        type="submit"
        style={{ backgroundColor: "var(--primary)" }}
      >
        Enviar
      </button>
    </form>
  );
}
```

## 🖼️ Upload de Arquivos por Tenant

### Exemplo 14: Upload Namespaced

```typescript
// app/api/upload/route.ts
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const tenantId = headersList.get("X-Tenant-Id");

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  // Salvar arquivo com namespace do tenant
  const filename = `${tenantId}/${Date.now()}_${file.name}`;

  // Upload para Vercel Blob, S3, etc.
  // const url = await uploadFile(file, filename);

  return NextResponse.json({
    success: true,
    url: `/uploads/${filename}`,
  });
}
```

## 🔐 Autenticação Multi-Tenant

### Exemplo 15: NextAuth com Tenant

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { getCurrentTenant } from "@/lib/tenant/resolve";

const handler = NextAuth({
  providers: [
    // Providers...
  ],
  callbacks: {
    async session({ session, token }) {
      // Adicionar tenant na sessão
      const tenant = await getCurrentTenant();

      return {
        ...session,
        tenant: {
          id: tenant.churchId,
          slug: tenant.slug,
          name: tenant.name,
        },
      };
    },
  },
});

export { handler as GET, handler as POST };
```

### Exemplo 16: Middleware de Autenticação

```typescript
// middleware.ts (adicionar ao existente)
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // 1. Resolver tenant (código existente)
  const tenant = getTenantByHost(hostname);

  if (!tenant) {
    return new NextResponse("Tenant not found", { status: 404 });
  }

  // 2. Verificar autenticação para rotas protegidas
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verificar se usuário pertence ao tenant
    if (token.churchId !== tenant.churchId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
  }

  // 3. Injetar headers do tenant
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("X-Tenant-Id", tenant.churchId);
  requestHeaders.set("X-Tenant-Slug", tenant.slug);

  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

## 🌍 Internacionalização por Tenant

### Exemplo 17: i18n com Tenant

```typescript
// lib/i18n.ts
import { getCurrentTenant } from "@/lib/tenant/resolve";

const translations: Record<string, Record<string, Record<string, string>>> = {
  ch_01: {
    pt: { welcome: "Bem-vindo" },
    en: { welcome: "Welcome" },
  },
  ch_02: {
    pt: { welcome: "Olá" },
    en: { welcome: "Hello" },
  },
};

export async function t(key: string, locale: string = "pt") {
  const tenant = await getCurrentTenant();
  return translations[tenant.churchId]?.[locale]?.[key] || key;
}

// Uso
const welcomeText = await t("welcome", "pt");
```

## 📱 Notificações por Tenant

### Exemplo 18: Push Notifications Isoladas

```typescript
// lib/notifications.ts
import { getCurrentTenant } from "@/lib/tenant/resolve";

export async function sendNotification(userId: string, message: string) {
  const tenant = await getCurrentTenant();

  // Enviar notificação apenas para usuários do tenant
  await fetch("/api/notifications", {
    method: "POST",
    body: JSON.stringify({
      userId,
      message,
      tenant_id: tenant.churchId, // Filtro por tenant
    }),
  });
}
```

---

**Mais exemplos?** Consulte a [ARCHITECTURE.md](ARCHITECTURE.md) para entender a estrutura completa!
