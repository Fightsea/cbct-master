#! /bin/bash
#
# Usage: bash docker-build.sh <asset-provider-domain> <auth-store-encryption-key>
# $1: asset-provider-domain
# $2: auth-store-encryption-key

# Build docker image for server
docker build -t cbct-server -f apps/server/Dockerfile .

# Build docker image for client
docker build \
  -t cbct-client \
  -f apps/client/Dockerfile \
  --build-arg ASSET_PROVIDER_DOMAIN=$1 \
  --build-arg AUTH_STORE_ENCRYPTION_KEY=$2 \
  .