#!/bin/sh
set -eu

readonly CWD=$(dirname "$0")

main() {
  "$CWD/wait_for_db_service.sh"
  "$CWD"/manage.py makemigrations jet
  "$CWD"/manage.py makemigrations dashboard
  "$CWD"/manage.py migrate
  "$CWD"/manage.py ensure_adminuser --username="$ADMIN_USERNAME" \
    --email="$ADMIN_EMAIL" \
    --password="$ADMIN_PASSWORD"

  gunicorn --bind :80 --workers $NUM_WORKERS teletherap.wsgi:application
}

main "$@"
