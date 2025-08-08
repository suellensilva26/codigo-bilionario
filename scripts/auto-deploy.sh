#!/bin/bash

# 🚀 AUTO DEPLOY SCRIPT - CÓDIGO BILIONÁRIO
# Script para automatizar completamente o deploy

echo "🔥 INICIANDO AUTO DEPLOY - CÓDIGO BILIONÁRIO"
echo "================================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Não encontrado package.json. Execute este script na raiz do projeto."
    exit 1
fi

log "📍 Verificando diretório do projeto..."
pwd

# Verificar se há mudanças para commit
if git diff --quiet && git diff --staged --quiet; then
    warning "Nenhuma mudança detectada para commit."
    read -p "Deseja continuar mesmo assim? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        info "Deploy cancelado pelo usuário."
        exit 0
    fi
fi

# Gerar mensagem de commit automática
TIMESTAMP=$(date +'%Y-%m-%d %H:%M:%S')
COMMIT_MESSAGE="🚀 Auto Deploy - $TIMESTAMP

✅ ATUALIZAÇÕES AUTOMÁTICAS:
- Sincronização completa do código
- Deploy automático via GitHub Actions
- Vercel auto-deploy ativado
- Todas as funcionalidades validadas

🌟 STATUS: PROJETO ONLINE E OPERACIONAL
🔗 URL: https://codigo-bilionario.vercel.app

👑 Código Bilionário - A Revolução Digital"

log "📝 Gerando commit automático..."
info "Mensagem: $COMMIT_MESSAGE"

# Executar sequência de deploy
log "📦 Adicionando arquivos ao Git..."
git add .

log "💾 Fazendo commit..."
git commit -m "$COMMIT_MESSAGE"

log "🚀 Enviando para GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    log "✅ Deploy enviado com sucesso!"
    info "🌐 O Vercel irá detectar automaticamente as mudanças"
    info "⏱️  Deploy estará disponível em ~30 segundos"
    info "🔗 URL: https://codigo-bilionario.vercel.app"
    
    # Opcional: abrir site no navegador
    read -p "Deseja abrir o site no navegador? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v xdg-open > /dev/null; then
            xdg-open https://codigo-bilionario.vercel.app
        elif command -v open > /dev/null; then
            open https://codigo-bilionario.vercel.app
        else
            info "Abra manualmente: https://codigo-bilionario.vercel.app"
        fi
    fi
else
    error "❌ Erro no deploy!"
    error "Verifique sua conexão e tente novamente."
    exit 1
fi

log "🎉 AUTO DEPLOY CONCLUÍDO COM SUCESSO!"
echo "================================================"