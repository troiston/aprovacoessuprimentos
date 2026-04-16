#!/bin/sh
set -e
if [ "${SKIP_PRISMA_MIGRATE:-}" != "1" ]; then
  prisma migrate deploy --schema /app/prisma/schema.prisma
fi
exec "$@"
