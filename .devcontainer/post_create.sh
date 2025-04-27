#!/usr/bin/env bash

# +----------------------------------------------------------------------------------------+ #
# |  _____                                          _             _                        | #
# | |  __ \                                        | |           (_)                       | #
# | | |  | |   ___  __   __   ___    ___    _ __   | |_    __ _   _   _ __     ___   _ __  | #
# | | |  | |  / _ \ \ \ / /  / __|  / _ \  | '_ \  | __|  / _` | | | | '_ \   / _ \ | '__| | #
# | | |__| | |  __/  \ V /  | (__  | (_) | | | | | \ |_  | (_| | | | | | | | |  __/ | |    | #
# | |_____/   \___|   \_/    \___|  \___/  |_| |_|  \__|  \__,_| |_| |_| |_|  \___| |_|    | #
# |                                                                                        | #
# +----------------------------------------------------------------------------------------+ #

# Bash Strict Mode (http://redsymbol.net/articles/unofficial-bash-strict-mode/)
set -euo pipefail
IFS=$'\n\t'

# Constants
WORKSPACE_PATH=/workspace
SPEC_PACKAGE_PATH="${WORKSPACE_PATH}/spec"
BACKEND_PACKAGE_PATH="${WORKSPACE_PATH}/backend"
BACKEND_DENO_PACKAGE_PATH="${WORKSPACE_PATH}/backend-deno"
FRONTEND_PACKAGE_PATH="${WORKSPACE_PATH}/frontend"
CUSTOM_POST_CREATE_SCRIPT_PATH="${WORKSPACE_PATH}/.devcontainer/post_create_custom.sh"

# SSH ディレクトリのパーミッションを設定
sudo chmod 700 /home/vscode/.ssh
find /home/vscode/.ssh -type f -exec chmod 600 {} \;
find /home/vscode/.ssh -name "*.pub" -exec chmod 644 {} \;
sudo chown -R vscode:vscode /home/vscode/.ssh

# 各パッケージの package.json を参照して pnpm と依存関係をインストールする
echo "Install root dependencies..."
corepack pnpm install --frozen-lockfile

echo "Install spec dependencies..."
cd "$SPEC_PACKAGE_PATH"
corepack pnpm install --frozen-lockfile

echo "Install backend dependencies..."
cd "$BACKEND_PACKAGE_PATH"
corepack pnpm install --frozen-lockfile

echo "Install backend dependencies..."
cd "$BACKEND_DENO_PACKAGE_PATH"
deno install --frozen=true

echo "Install frontend dependencies..."
cd "$FRONTEND_PACKAGE_PATH"
corepack pnpm install --frozen-lockfile

# Run custom post create script
if [ -f "$CUSTOM_POST_CREATE_SCRIPT_PATH" ]; then
  echo "Run custom post create script ($CUSTOM_POST_CREATE_SCRIPT_PATH)..."
  eval "$CUSTOM_POST_CREATE_SCRIPT_PATH"
fi
