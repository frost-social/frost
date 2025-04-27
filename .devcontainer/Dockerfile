# +----------------------------------------------------------------------------------------+ #
# |  _____                                          _             _                        | #
# | |  __ \                                        | |           (_)                       | #
# | | |  | |   ___  __   __   ___    ___    _ __   | |_    __ _   _   _ __     ___   _ __  | #
# | | |  | |  / _ \ \ \ / /  / __|  / _ \  | '_ \  | __|  / _` | | | | '_ \   / _ \ | '__| | #
# | | |__| | |  __/  \ V /  | (__  | (_) | | | | | \ |_  | (_| | | | | | | | |  __/ | |    | #
# | |_____/   \___|   \_/    \___|  \___/  |_| |_|  \__|  \__,_| |_| |_| |_|  \___| |_|    | #
# |                                                                                        | #
# +----------------------------------------------------------------------------------------+ #

FROM mcr.microsoft.com/devcontainers/base:noble AS devcontainer
RUN apt-get update

# Add sudoers (for post_create_custom.sh)
RUN echo "vscode ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/vscode

# Install network tools
RUN apt-get install -y iputils-ping net-tools

# Install PostgreSQL
# RUN apt-get install -y postgresql postgresql-contrib

# Install Deno
ENV DENO_INSTALL=/usr/local
RUN curl -fsSL https://deno.land/install.sh \
  | sh
