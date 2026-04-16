# Deploy no Docker Swarm (Traefik + Portainer)

## Pré-requisitos

- Swarm ativo, **Traefik** publicado na rede overlay (ex.: `traefik-public`) com entrypoint HTTPS (ex.: `websecure`) e `certresolver` (ex.: `letsencrypt`).
- **PostgreSQL** acessível pela rede do Swarm (serviço interno ou URL externa).
- Registry para a imagem (Docker Hub, GHCR, registry privado).

## 1. Build e push da imagem

Na máquina de CI ou local (com Docker):

```bash
docker build -t registry.example.com/aprovacoes-suprimentos:latest .
docker push registry.example.com/aprovacoes-suprimentos:latest
```

## 2. Variáveis obrigatórias em runtime

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL Postgres (ex.: `postgresql://user:pass@postgres:5432/db?schema=public`) |
| `NEXT_PUBLIC_APP_URL` | URL pública HTTPS do site (igual ao domínio no Traefik, sem barra final opcional) |
| `NEXT_PUBLIC_APP_NAME` | Nome exibido (opcional) |

Stripe, `SETTINGS_ENCRYPTION_KEY`, etc.: ver `.env.example`.

## 3. Traefik (labels)

Edite `docker-compose.yml` na raiz do repositório:

- `image` — sua imagem/tag (build + push antes).
- `traefik.docker.network` — nome da rede que o Traefik e o serviço compartilham.
- `traefik.http.routers.aprovacoes.rule` — `Host(\`seu.dominio.com\`)`.
- `traefik.http.routers.aprovacoes.entrypoints` — o entrypoint HTTPS do seu Traefik.
- `traefik.http.routers.aprovacoes.tls.certresolver` — nome do resolver ACME no Traefik.

Deploy na CLI:

```bash
docker stack deploy -c docker-compose.yml aprovacoes
```

## 4. Portainer (Git)

1. **Stacks** → **Add stack** → método **Repository**.
2. **Compose path** deve ser exatamente `docker-compose.yml` (ficheiro na raiz do Git). Se o ficheiro não existir no branch, o Portainer falha com *Open /data/compose/…/docker-compose.yml: no such file or directory*.
3. Faça **commit e push** de `docker-compose.yml` para o branch configurado (ex.: `main`).
4. Em **Environment**, defina `DATABASE_URL`, `NEXT_PUBLIC_APP_URL` (URL **pública** HTTPS do site, não `http://localhost:3000`), `SETTINGS_ENCRYPTION_KEY` se usar cifra de definições, etc.
5. A rede `traefik-public` deve existir como **external** (criada antes pelo Traefik ou manualmente).

## 5. Migrações Prisma

No arranque do container roda `prisma migrate deploy` (ver `scripts/docker-entrypoint.sh`).

Para pular migrações (ex.: debug): `SKIP_PRISMA_MIGRATE=1` no ambiente do serviço.

## 6. Saúde do serviço

O `Dockerfile` define `HEALTHCHECK` em `GET /`. Ajuste timeouts no stack se o primeiro arranque for lento (migrações grandes).
