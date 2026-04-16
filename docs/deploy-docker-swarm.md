# Deploy no Docker Swarm (Traefik + Portainer)

## Pré-requisitos

- Swarm ativo, **Traefik** na mesma rede overlay que a app. Neste projeto o compose assume **`network_swarm_public`** (padrão do cluster Olá / exemplo n8n), entrypoint **`websecure`** e **`letsencryptresolver`** como cert resolver.
- **PostgreSQL** acessível pela rede do Swarm (serviço interno ou URL externa).
- Registry para a imagem (Docker Hub, GHCR, registry privado).

### Rede overlay (erro: *external, but could not be found*)

O `docker-compose.yml` declara **`network_swarm_public`** como **external** (igual ao stack n8n): a rede **não é criada** por este stack; tem de já existir no Swarm (normalmente criada pelo stack do Traefik ou uma vez à mão).

1. Num **manager**: `docker network ls` e confirma que existe `network_swarm_public`.

2. **Se o teu cluster usar outro nome**, edita no repositório: bloco `networks:` (`name:` + chave), lista `networks` do serviço `web`, e a label `traefik.docker.network=...` — tudo com o **mesmo** nome que o Traefik usa.

3. Se precisares de criar a rede (só em ambientes novos):

   ```bash
   docker network create --driver overlay --attachable network_swarm_public
   ```

4. Volta a fazer deploy da stack no Portainer (ou `docker stack deploy`).

## 1. Build, push e variável `APP_IMAGE`

O compose usa **`image: ${APP_IMAGE}`**. No Portainer, em **Stack → Environment**, tens de definir **`APP_IMAGE`** com uma tag **que já exista** no registry (senão o erro é *No such image* / tarefas **rejected**).

Exemplo (Docker Hub):

```bash
docker build -t teuusuario/aprovasuprimentos:latest .
docker push teuusuario/aprovasuprimentos:latest
```

No Portainer:

| Nome | Valor (exemplo) |
|------|------------------|
| `APP_IMAGE` | `docker.io/teuusuario/aprovasuprimentos:latest` ou `teuusuario/aprovasuprimentos:latest` |

Deploy na CLI (com variável exportada):

```bash
export APP_IMAGE=teuusuario/aprovasuprimentos:latest
docker stack deploy -c docker-compose.yml aprovasuprimentos
```

## 2. Variáveis obrigatórias em runtime

| Variável | Descrição |
|----------|-----------|
| `APP_IMAGE` | Imagem Docker publicada (obrigatória — ver secção 1) |
| `DATABASE_URL` | URL Postgres (ex.: `postgresql://user:pass@postgres:5432/db?schema=public`) |
| `NEXT_PUBLIC_APP_URL` | URL pública HTTPS (ex.: `https://aprovasuprimentos.digaola.com`) |
| `NEXT_PUBLIC_APP_NAME` | Nome exibido (opcional) |

Stripe, `SETTINGS_ENCRYPTION_KEY`, etc.: ver `.env.example`.

## 3. Traefik (labels)

Edite `docker-compose.yml` na raiz do repositório:

- `image` — sua imagem/tag (build + push antes).
- `traefik.docker.network` — hoje `network_swarm_public` (alinhado ao n8n no mesmo servidor).
- `traefik.http.routers.aprovasuprimentos.rule` — produção: `Host(\`aprovasuprimentos.digaola.com\`)`.
- `traefik.http.routers.aprovasuprimentos.entrypoints` — `websecure` (como no exemplo n8n).
- `traefik.http.routers.aprovasuprimentos.tls.certresolver` — `letsencryptresolver` (como no exemplo n8n; ajusta se o teu Traefik usar outro nome).

Deploy na CLI:

```bash
docker stack deploy -c docker-compose.yml aprovacoes
```

## 4. Portainer (Git)

1. **Stacks** → **Add stack** → método **Repository**.
2. **Compose path** deve ser exatamente `docker-compose.yml` (ficheiro na raiz do Git). Se o ficheiro não existir no branch, o Portainer falha com *Open /data/compose/…/docker-compose.yml: no such file or directory*.
3. Faça **commit e push** de `docker-compose.yml` para o branch configurado (ex.: `main`).
4. Em **Environment**, defina **`APP_IMAGE`** (obrigatório), `DATABASE_URL`, `NEXT_PUBLIC_APP_URL=https://aprovasuprimentos.digaola.com`, `SETTINGS_ENCRYPTION_KEY` se aplicável, etc.
5. A rede overlay tem de existir antes do deploy — ver secção **Rede overlay** acima.

## 5. Migrações Prisma

No arranque do container roda `prisma migrate deploy` (ver `scripts/docker-entrypoint.sh`).

Para pular migrações (ex.: debug): `SKIP_PRISMA_MIGRATE=1` no ambiente do serviço.

## 6. Saúde do serviço

O `Dockerfile` define `HEALTHCHECK` em `GET /`. Ajuste timeouts no stack se o primeiro arranque for lento (migrações grandes).
