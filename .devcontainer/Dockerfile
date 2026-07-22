FROM node:22

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Official node images ship a "node" user on UID/GID 1000.
# Remove it so the non-root user can claim 1000 (official Dev Containers pattern).
RUN if id "node" >/dev/null 2>&1; then userdel -f -r node; fi \
    && if id "ubuntu" >/dev/null 2>&1; then userdel -f -r ubuntu; fi \
    && if getent group node >/dev/null 2>&1; then groupdel node; fi \
    && if getent group ubuntu >/dev/null 2>&1; then groupdel ubuntu; fi

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends git curl ca-certificates sudo \
    && groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && mkdir -p /home/$USERNAME/.npm \
    && chown -R $USERNAME:$USERNAME /home/$USERNAME \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
RUN chown $USERNAME:$USERNAME /workspace

USER $USERNAME
