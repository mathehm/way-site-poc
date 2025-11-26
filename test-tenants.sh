#!/bin/bash

# Script helper para testar os tenants via curl
# Uso: ./test-tenants.sh

echo "🧪 Testando Multi-Tenant PoC"
echo "=============================="
echo ""

BASE_URL="http://localhost:3000"

echo "📍 Testando Igreja A..."
curl -s -H "Host: igreja-a.sua-plataforma.com" $BASE_URL | grep -o "<title>[^<]*" | sed 's/<title>//'
echo ""

echo "📍 Testando Igreja B..."
curl -s -H "Host: igreja-b.sua-plataforma.com" $BASE_URL | grep -o "<title>[^<]*" | sed 's/<title>//'
echo ""

echo "📍 Testando Igreja Vida..."
curl -s -H "Host: www.igreja-vida.com.br" $BASE_URL | grep -o "<title>[^<]*" | sed 's/<title>//'
echo ""

echo "📡 Testando API - Igreja A (eventos)..."
curl -s -H "Host: igreja-a.sua-plataforma.com" $BASE_URL/api/public/events | jq -r '.count + " eventos encontrados"'
echo ""

echo "📡 Testando API - Igreja B (eventos)..."
curl -s -H "Host: igreja-b.sua-plataforma.com" $BASE_URL/api/public/events | jq -r '.count + " eventos encontrados"'
echo ""

echo "📡 Testando API - Igreja Vida (eventos)..."
curl -s -H "Host: www.igreja-vida.com.br" $BASE_URL/api/public/events | jq -r '.count + " eventos encontrados"'
echo ""

echo "❌ Testando host inválido (deve retornar 404)..."
curl -s -w "Status: %{http_code}\n" -H "Host: invalido.com" $BASE_URL -o /dev/null
echo ""

echo "✅ Testes concluídos!"
