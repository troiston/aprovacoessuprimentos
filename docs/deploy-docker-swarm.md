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

Edite `docker-stack.example.yml`:

- `image` — sua imagem/tag.
- `traefik.docker.network` — nome da rede que o Traefik e o serviço compartilham.
- `traefik.http.routers.aprovacoes.rule` — `Host(\`seu.dominio.com\`)`.
- `traefik.http.routers.aprovacoes.entrypoints` — o entrypoint HTTPS do seu Traefik.
- `traefik.http.routers.aprovacoes.tls.certresolver` — nome do resolver ACME no Traefik.

Deploy:

```bash
docker stack deploy -c docker-stack.example.yml aprovacoes
```

## 4. Portainer

1. **Stacks** → **Add stack** → colar o YAML (ou Git) baseado em `docker-stack.example.yml`.
2. Em **Environment**, defina `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, etc. (ou use *Secrets* do Swarm e mapeie para env, conforme sua política).
3. A rede `traefik-public` deve existir como **external** (criada antes pelo Traefik ou manualmente).

## 5. Migrações Prisma

No arranque do container roda `prisma migrate deploy` (ver `scripts/docker-entrypoint.sh`).

Para pular migrações (ex.: debug): `SKIP_PRISMA_MIGRATE=1` no ambiente do serviço.

## 6. Saúde do serviço

O `Dockerfile` define `HEALTHCHECK` em `GET /`. Ajuste timeouts no stack se o primeiro arranque for lento (migrações grandes).
