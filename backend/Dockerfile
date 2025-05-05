# Docker image of Node.js LTS on Debian
FROM node:lts AS backend

ARG USERNAME=node

# Install pnpm
RUN corepack enable pnpm

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/
