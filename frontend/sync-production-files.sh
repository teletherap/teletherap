#!/usr/bin/env sh

set -euo pipefail

# TODO use rsync instead of cp
cp -rf /app/build/* /mnt/frontend/
echo "Frontend files updated."
