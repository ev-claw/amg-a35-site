#!/usr/bin/env bash
# deploy.sh — Deploy amg-a35-site to a35.r3x.io
# Usage: sudo bash deploy.sh
set -euo pipefail

APP=amg-a35-site
APP_DIR=/srv/apps/$APP
DOMAIN=a35.r3x.io
REPO=git@github.com:ev-claw/amg-a35-site.git

# Phase 2: post-pull steps (re-exec'd from freshly-pulled script)
if [ "${_DEPLOY_PHASE:-}" = "post-pull" ]; then
  GIT_HASH=$(runuser -u deploy -- git -C "$APP_DIR" rev-parse --short HEAD)
  DEPLOY_TS=$(date '+%d %b %Y, %H:%M UTC')
  echo "==> Injecting cache-busting hash: $GIT_HASH"

  sed -i \
    -e "s|href=\"styles\.css\"|href=\"styles.css?v=$GIT_HASH\"|g" \
    -e "s|src=\"script\.js\"|src=\"script.js?v=$GIT_HASH\"|g" \
    "$APP_DIR/index.html"

  cat > /etc/caddy/conf.d/$APP.caddy <<'CONF'
a35.r3x.io {
    root * /srv/apps/amg-a35-site
    file_server
    encode gzip

    # HTML: always revalidate
    @html path / /index.html
    header @html Cache-Control "no-cache, must-revalidate"

    # Assets: long-lived cache, busted by ?v=hash
    @assets path *.css *.js *.png *.jpg *.jpeg *.webp *.svg *.ico *.woff *.woff2
    header @assets Cache-Control "public, max-age=31536000, immutable"

    header {
        X-Content-Type-Options nosniff
        X-Frame-Options SAMEORIGIN
        Referrer-Policy strict-origin-when-cross-origin
    }
}
CONF

  caddy fmt --overwrite /etc/caddy/conf.d/$APP.caddy
  caddy validate --config /etc/caddy/Caddyfile
  systemctl reload caddy

  echo "==> Verifying…"
  MAX_ATTEMPTS=10
  WAIT=3
  HTTP_STATUS=""
  for attempt in $(seq 1 $MAX_ATTEMPTS); do
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "https://$DOMAIN" 2>/dev/null || true)
    echo "==> Attempt $attempt/$MAX_ATTEMPTS — HTTP status: ${HTTP_STATUS:-curl-error}"
    if [ "$HTTP_STATUS" = "200" ]; then
      break
    fi
    if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
      echo "    Waiting ${WAIT}s before retry…"
      sleep "$WAIT"
      WAIT=$(( WAIT * 2 > 60 ? 60 : WAIT * 2 ))
    fi
  done

  if [ "$HTTP_STATUS" = "200" ]; then
    echo ""
    echo "✅ AMG A35 site deployed successfully!"
    echo "   https://$DOMAIN  (commit: $GIT_HASH)"
  else
    echo "⚠️  Unexpected HTTP status after $MAX_ATTEMPTS attempts: ${HTTP_STATUS:-curl-error}"
    echo "   Check Caddy logs: journalctl -u caddy -n 50"
  fi
  exit 0
fi

# Phase 1: clone or pull, then re-exec phase 2
echo "==> Deploying $APP to $DOMAIN"

if [ -d "$APP_DIR/.git" ]; then
  echo "==> Pulling latest from GitHub…"
  # Reset index.html before pulling (deploy.sh modifies it for cache-busting)
  runuser -u deploy -- git -C "$APP_DIR" checkout -- index.html
  runuser -u deploy -- git -C "$APP_DIR" pull --ff-only
else
  echo "==> Cloning from GitHub…"
  mkdir -p "$APP_DIR"
  runuser -u deploy -- sh -c "GIT_SSH_COMMAND='ssh -o StrictHostKeyChecking=accept-new' git clone $REPO $APP_DIR"
fi

exec env _DEPLOY_PHASE=post-pull bash "$APP_DIR/deploy.sh"
