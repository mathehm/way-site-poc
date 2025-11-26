# 📖 Índice da Documentação

Guia de navegação rápida pela documentação da PoC Multi-Tenant.

## 🚀 Por Onde Começar?

### Se você quer rodar a aplicação AGORA (5 min)
👉 [QUICKSTART.md](QUICKSTART.md)

### Se você quer entender TUDO sobre o projeto
👉 [README.md](README.md)

### Se você quer entender a ARQUITETURA
👉 [ARCHITECTURE.md](ARCHITECTURE.md)

### Se você quer ver EXEMPLOS práticos de código
👉 [EXAMPLES.md](EXAMPLES.md)

### Se você quer entender a ESTRUTURA de arquivos
👉 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

### Se você quer um RESUMO executivo
👉 [SUMMARY.md](SUMMARY.md)

---

## 📚 Documentos por Categoria

### 🎯 Para Iniciantes

| Documento | Descrição | Tempo de Leitura |
|-----------|-----------|------------------|
| [QUICKSTART.md](QUICKSTART.md) | Guia de 5 minutos para rodar a PoC | ⚡ 5 min |
| [README.md](README.md) | Documentação principal completa | 📖 15 min |
| [SUMMARY.md](SUMMARY.md) | Resumo executivo do que foi implementado | 📋 5 min |

### 🏗️ Para Desenvolvedores

| Documento | Descrição | Tempo de Leitura |
|-----------|-----------|------------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitetura detalhada com diagramas | 🏗️ 20 min |
| [EXAMPLES.md](EXAMPLES.md) | 18 exemplos práticos de código | 💡 30 min |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Estrutura completa de arquivos | 📂 10 min |

### 🔍 Referência Rápida

| Tópico | Onde Encontrar |
|--------|----------------|
| Como adicionar um novo tenant | [README.md#-adicionando-um-novo-tenant](README.md) |
| Como funciona o middleware | [ARCHITECTURE.md#2-middleware](ARCHITECTURE.md) |
| Como usar getCurrentTenant() | [EXAMPLES.md#exemplo-1](EXAMPLES.md) |
| Como fazer deploy na Vercel | [README.md#-deploy-na-vercel](README.md) |
| Como testar localmente | [QUICKSTART.md#-testar-via-api](QUICKSTART.md) |
| Como funciona o cache | [README.md#-como-o-cache-funciona-na-vercel](README.md) |
| Estrutura de pastas | [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) |
| Troubleshooting | [README.md#-troubleshooting](README.md) |

---

## 📂 Arquivos de Código por Função

### 🔑 Core Multi-Tenant

| Arquivo | O que faz | Ver em |
|---------|-----------|--------|
| [middleware.ts](middleware.ts) | Detecta tenant pelo host | [ARCHITECTURE.md](ARCHITECTURE.md#2-middleware) |
| [lib/tenant/config.ts](lib/tenant/config.ts) | Config de todos os tenants | [ARCHITECTURE.md](ARCHITECTURE.md#1-tenant-config) |
| [lib/tenant/resolve.ts](lib/tenant/resolve.ts) | Helpers para Server Components | [ARCHITECTURE.md](ARCHITECTURE.md#3-tenant-resolver) |

### 🎨 Interface

| Arquivo | O que faz | Ver em |
|---------|-----------|--------|
| [app/(site)/layout.tsx](app/(site)/layout.tsx) | Layout com tema dinâmico | [ARCHITECTURE.md](ARCHITECTURE.md#4-layout-dinâmico) |
| [app/(site)/page.tsx](app/(site)/page.tsx) | Home page | [EXAMPLES.md](EXAMPLES.md#exemplo-1) |
| [app/(site)/events/page.tsx](app/(site)/events/page.tsx) | Lista de eventos | [EXAMPLES.md](EXAMPLES.md#exemplo-2) |
| [app/(site)/about/page.tsx](app/(site)/about/page.tsx) | Página sobre | - |

### 📡 API & Dados

| Arquivo | O que faz | Ver em |
|---------|-----------|--------|
| [app/api/public/events/route.ts](app/api/public/events/route.ts) | API de eventos | [ARCHITECTURE.md](ARCHITECTURE.md#5-api-routes) |
| [lib/data/events.ts](lib/data/events.ts) | Mock de dados | [EXAMPLES.md](EXAMPLES.md#exemplo-7) |

### 🔍 SEO

| Arquivo | O que faz | Ver em |
|---------|-----------|--------|
| [app/sitemap.ts](app/sitemap.ts) | Sitemap dinâmico | [README.md](README.md#-sitemap--robots) |
| [app/robots.ts](app/robots.ts) | Robots.txt dinâmico | [README.md](README.md#-sitemap--robots) |

---

## 🎓 Aprender por Tópico

### Quero aprender sobre Multi-Tenancy

1. Leia: [ARCHITECTURE.md - Fluxo de Requisição](ARCHITECTURE.md#-fluxo-de-requisição)
2. Veja: [EXAMPLES.md - Exemplo 1 e 2](EXAMPLES.md#-server-components)
3. Pratique: Adicione um novo tenant seguindo [README.md](README.md#como-adicionar-um-novo-tenant)

### Quero aprender sobre Server Components

1. Leia: [README.md - Server Components](README.md#server-components)
2. Veja: [EXAMPLES.md - Exemplos 1-4](EXAMPLES.md#-server-components)
3. Pratique: Crie uma nova página

### Quero aprender sobre ISR e Cache

1. Leia: [README.md - ISR e Cache](README.md#-isr-e-cache-por-tenant)
2. Leia: [ARCHITECTURE.md - Performance](ARCHITECTURE.md#-performance-na-vercel)
3. Entenda: Por que usar `Vary: Host`

### Quero aprender sobre Deploy

1. Leia: [README.md - Deploy na Vercel](README.md#-deploy-na-vercel)
2. Entenda: Wildcard domains e DNS
3. Pratique: Faça deploy de teste

---

## 🔍 Buscar por Palavra-Chave

### Middleware
- [middleware.ts](middleware.ts)
- [ARCHITECTURE.md - Middleware](ARCHITECTURE.md#2-middleware)
- [README.md - Middleware](README.md#-como-funciona-layout-por-tenant)

### Tenant
- [lib/tenant/config.ts](lib/tenant/config.ts)
- [lib/tenant/resolve.ts](lib/tenant/resolve.ts)
- [ARCHITECTURE.md - Sistema Multi-Tenant](ARCHITECTURE.md#-componentes-chave)

### Cache
- [README.md - Cache por Tenant](README.md#-isr-e-cache-por-tenant)
- [ARCHITECTURE.md - Cache e Performance](ARCHITECTURE.md#-cache-e-performance)
- [app/api/public/events/route.ts](app/api/public/events/route.ts)

### SEO
- [app/sitemap.ts](app/sitemap.ts)
- [app/robots.ts](app/robots.ts)
- [app/(site)/layout.tsx](app/(site)/layout.tsx) - generateMetadata()

### API
- [app/api/public/events/route.ts](app/api/public/events/route.ts)
- [EXAMPLES.md - API Routes](EXAMPLES.md#-api-routes)
- [ARCHITECTURE.md - API Routes](ARCHITECTURE.md#5-api-routes)

### Deploy
- [README.md - Deploy](README.md#-deploy-na-vercel)
- [QUICKSTART.md - Deploy](QUICKSTART.md#-deploy-na-vercel)

### Temas/CSS
- [app/(site)/layout.tsx](app/(site)/layout.tsx)
- [ARCHITECTURE.md - Sistema de Temas](ARCHITECTURE.md#-sistema-de-temas)
- [EXAMPLES.md - Usando CSS Variables](EXAMPLES.md#-usando-css-variables-do-tenant)

---

## 📊 Diagrama de Navegação

```
📖 Começar Aqui
│
├─── 🚀 Ação Rápida (5 min)
│    └─── QUICKSTART.md → npm run dev
│
├─── 📚 Aprendizado Completo
│    ├─── README.md (visão geral)
│    ├─── ARCHITECTURE.md (como funciona)
│    └─── EXAMPLES.md (exemplos práticos)
│
├─── 🔍 Referência
│    ├─── PROJECT_STRUCTURE.md (onde está cada coisa)
│    └─── SUMMARY.md (o que foi feito)
│
└─── 💻 Código
     ├─── middleware.ts
     ├─── lib/tenant/
     ├─── app/(site)/
     └─── app/api/
```

---

## 🎯 Jornadas Recomendadas

### 👨‍💻 "Quero apenas rodar e ver funcionando"

1. [QUICKSTART.md](QUICKSTART.md) - 5 minutos
2. Abra `http://igreja-a.lvh.me:3000` no navegador
3. ✅ Pronto!

### 🧑‍🎓 "Quero entender como funciona"

1. [README.md](README.md) - 15 minutos
2. [ARCHITECTURE.md](ARCHITECTURE.md) - 20 minutos
3. Explore o código em [lib/tenant/](lib/tenant/) e [middleware.ts](middleware.ts)
4. ✅ Você entende a arquitetura!

### 👨‍🔧 "Quero implementar algo parecido"

1. [QUICKSTART.md](QUICKSTART.md) - rodar local
2. [ARCHITECTURE.md](ARCHITECTURE.md) - entender fluxo
3. [EXAMPLES.md](EXAMPLES.md) - copiar exemplos
4. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - ver onde cada coisa está
5. ✅ Você pode replicar!

### 🚀 "Quero fazer deploy em produção"

1. [README.md - Deploy na Vercel](README.md#-deploy-na-vercel)
2. Configure DNS (wildcard)
3. Teste com domínios reais
4. Leia [README.md - Próximos Passos](README.md#-próximos-passos) para produção
5. ✅ Em produção!

---

## 📞 Precisa de Ajuda?

### Problemas Técnicos
👉 [README.md - Troubleshooting](README.md#-troubleshooting)

### Dúvidas Conceituais
👉 [README.md - Perguntas Frequentes](README.md#-perguntas-frequentes)

### Exemplos de Código
👉 [EXAMPLES.md](EXAMPLES.md)

### Arquitetura
👉 [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🗂️ Todos os Documentos

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [README.md](README.md) | Documentação principal completa | ✅ Completo |
| [QUICKSTART.md](QUICKSTART.md) | Guia de 5 minutos | ✅ Completo |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitetura detalhada | ✅ Completo |
| [EXAMPLES.md](EXAMPLES.md) | 18 exemplos práticos | ✅ Completo |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Estrutura de arquivos | ✅ Completo |
| [SUMMARY.md](SUMMARY.md) | Resumo executivo | ✅ Completo |
| [INDEX.md](INDEX.md) | Este arquivo | ✅ Completo |

---

**Comece agora:** [QUICKSTART.md](QUICKSTART.md) 🚀
