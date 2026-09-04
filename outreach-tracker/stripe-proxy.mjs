#!/usr/bin/env node
/**
 * Outreach tracker server: static PWA + Stripe PaymentIntents on one origin.
 * Reads STRIPE_SECRET_KEY from the environment only. Do not commit keys.
 *
 *   export STRIPE_SECRET_KEY=sk_test_...
 *   node stripe-proxy.mjs
 *
 * Default: http://0.0.0.0:4173  (PWA + GET /charges)
 * Override bind with STRIPE_PROXY_HOST / STRIPE_PROXY_PORT.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const HOST = process.env.STRIPE_PROXY_HOST || "0.0.0.0";
const PORT = Number(process.env.STRIPE_PROXY_PORT || 4173);
const STRIPE_API_BASE = (process.env.STRIPE_API_BASE || "https://api.stripe.com").replace(
  /\/$/,
  ""
);
const LIMIT = 25;
const BLOCKED_FILES = new Set(["stripe-proxy.mjs", "README.md", "make_icons.py"]);
const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff2": "font/woff2",
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function keyMode(key) {
  if (!key) return "missing";
  if (key.startsWith("sk_live")) return "live";
  if (key.startsWith("sk_test")) return "test";
  return "unknown";
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Cache-Control": "no-store",
    ...corsHeaders(),
  });
  res.end(payload);
}

function formatAmount(cents, currency) {
  const code = (currency || "usd").toUpperCase();
  const amount = Number(cents || 0) / 100;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${code}`;
  }
}

function summarizeIntent(pi) {
  const description =
    (typeof pi.description === "string" && pi.description.trim()) ||
    (pi.metadata && typeof pi.metadata.product === "string" && pi.metadata.product) ||
    "";
  return {
    id: pi.id,
    amount: Number(pi.amount || 0),
    amountFormatted: formatAmount(pi.amount, pi.currency),
    currency: (pi.currency || "usd").toLowerCase(),
    status: pi.status || "unknown",
    created: Number(pi.created || 0),
    description,
  };
}

async function listPaymentIntents() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key) {
    return {
      status: 200,
      body: {
        error: "STRIPE_SECRET_KEY not set",
        charges: [],
      },
    };
  }

  const url = `${STRIPE_API_BASE}/v1/payment_intents?limit=${LIMIT}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Stripe-Version": "2024-06-20",
    },
  });

  if (!response.ok) {
    return {
      status: 200,
      body: {
        error: `Stripe API ${response.status}`,
        charges: [],
      },
    };
  }

  const payload = await response.json();
  const charges = Array.isArray(payload.data) ? payload.data.map(summarizeIntent) : [];
  return {
    status: 200,
    body: {
      ok: true,
      source: "payment_intents",
      mode: keyMode(key),
      charges,
    },
  };
}

function safeStaticPath(urlPath) {
  let rel = decodeURIComponent(urlPath.split("?")[0] || "/");
  if (rel === "/" || rel === "") rel = "/index.html";
  if (rel.includes("\0") || rel.includes("\\")) return null;
  const resolved = path.resolve(ROOT, `.${rel}`);
  const rootWithSep = ROOT.endsWith(path.sep) ? ROOT : ROOT + path.sep;
  if (resolved !== ROOT && !resolved.startsWith(rootWithSep)) return null;
  const base = path.basename(resolved);
  if (base.startsWith(".") || BLOCKED_FILES.has(base)) return null;
  return resolved;
}

function serveStatic(req, res, urlPath) {
  const filePath = safeStaticPath(urlPath);
  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": ext === ".html" || ext === ".js" || ext === ".css" ? "no-cache" : "public, max-age=3600",
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || `${HOST}:${PORT}`}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { error: "GET only", charges: [] });
    return;
  }

  if (url.pathname === "/health") {
    sendJson(res, 200, {
      ok: true,
      service: "verdansc-outreach-tracker",
      charges: "/charges",
      mode: keyMode(process.env.STRIPE_SECRET_KEY || ""),
    });
    return;
  }

  if (url.pathname === "/charges" || url.pathname === "/api/charges") {
    try {
      const result = await listPaymentIntents();
      sendJson(res, result.status, result.body);
    } catch {
      sendJson(res, 200, { error: "Stripe request failed", charges: [] });
    }
    return;
  }

  serveStatic(req, res, url.pathname);
});

server.listen(PORT, HOST, () => {
  const mode = keyMode(process.env.STRIPE_SECRET_KEY || "");
  console.log(`outreach-tracker http://${HOST}:${PORT}/  charges=/charges  mode=${mode}`);
  if (mode === "missing") {
    console.log("Set STRIPE_SECRET_KEY in the environment. Do not commit it.");
  }
});
