#!/bin/bash

# 👁️ WATCH AND AUTO DEPLOY - CÓDIGO BILIONÁRIO
# Monitora mudanças e faz deploy automático

echo "👁️ MODO WATCH ATIVADO - AUTO DEPLOY"
echo "===================================="

# Instalar inotify-tools se não estiver instalado
if ! command -v inotifywait &> /dev/null; then
    echo "📦 Instalando inotify-tools..."
    sudo apt-get update && sudo apt-get install -y inotify-tools
fi

# Diretórios para monitorar
WATCH_DIRS="src/ backend/ public/ *.json *.js *.jsx *.ts *.tsx"

echo "👁️ Monitorando mudanças em: $WATCH_DIRS"
echo "💡 Pressione Ctrl+C para parar"
echo "===================================="

# Função de deploy
deploy() {
    echo "🔄 Mudança detectada! Iniciando deploy..."
    ./scripts/auto-deploy.sh
    echo "⏱️ Aguardando próximas mudanças..."
}

# Monitorar mudanças
inotifywait -m -r -e modify,create,delete,move $WATCH_DIRS |
while read path action file; do
    # Ignorar arquivos temporários e node_modules
    if [[ "$file" == *"~"* ]] || [[ "$path" == *"node_modules"* ]] || [[ "$path" == *".git"* ]]; then
        continue
    fi
    
    echo "📝 Arquivo modificado: $path$file"
    
    # Aguardar 2 segundos para evitar múltiplos triggers
    sleep 2
    
    # Fazer deploy
    deploy
    
    # Aguardar 10 segundos antes de monitorar novamente
    sleep 10
done