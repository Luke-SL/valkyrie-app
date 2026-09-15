# Estágio 1: Build
FROM node:22-alpine AS build-stage

WORKDIR /app

# Instala o Quasar CLI globalmente
RUN npm install -g @quasar/cli

# Copia os manifestos de dependências
COPY package*.json yarn.lock* ./

# Instala dependências pulando scripts de postinstall (para evitar o quasar prepare antecipado)
RUN yarn install --ignore-engines --ignore-scripts

# Copia o restante do código-fonte
COPY . .

# Executa o prepare com o contexto completo do projeto disponível
RUN quasar prepare

# Compila para produção (SPA)
RUN quasar build

# Estágio 2: Produção com Nginx
FROM nginx:alpine AS production-stage

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]