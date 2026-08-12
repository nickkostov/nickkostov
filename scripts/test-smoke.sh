#!/bin/sh

set -eu

cleanup() {
    docker compose down --remove-orphans
}

trap cleanup EXIT INT TERM

docker compose up --build -d

attempt=0
until curl --fail --silent --output /dev/null http://127.0.0.1:8090/; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 30 ]; then
        echo "Site did not become ready on http://127.0.0.1:8090" >&2
        exit 1
    fi
    sleep 1
done

npx playwright test
