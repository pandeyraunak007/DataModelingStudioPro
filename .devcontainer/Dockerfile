FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install additional tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    postgresql-client \
    && apt-get autoremove -y && apt-get clean -y

# Install global npm packages
RUN npm install -g @prisma/cli prisma

USER node