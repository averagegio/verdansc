#!/usr/bin/env node
/**
 * Local Stripe PaymentIntents proxy for the outreach tracker Payments tab.
 * Reads STRIPE_SECRET_KEY from the environment only. Do not commit keys.
 *
 *   export STRIPE_SECRET_KEY=sk_test_...
 *   node stripe-proxy.mjs
 *
 * GET /charges  → recent PaymentIntents (amount, status, created, description)
 */
import http from "node:http";

const HOST = process.env.STRIPE_PROXY_HOST || "127.0.0.1";
const PORT = Number(process.env.STRIPE_PROXY_PORT || 4242);
const STRIPE_API_BASE = (process.env.STRIPE_API_BASE || "https://api.stripe.com").replace(
  /\/$/,
  ""
);
const LIMIT = 25;

function keyMode(key) {
  if (!key) return "missing";
  if (key.startsWith("sk_live")) return "live";
  if (key.startsWith("sk_test")) return "test";
  return "unknown";
}

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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
      status: 503,
      body: {
        ok: false,
        error: "STRIPE_SECRET_KEY is not set on the proxy process.",
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
      status: 502,
      body: {
        ok: false,
        error: `Stripe API ${response.status}`,
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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${HOST}:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method !== "GET") {
    send(res, 405, { ok: false, error: "GET only" });
    return;
  }

  if (url.pathname === "/" || url.pathname === "/health") {
    send(res, 200, {
      ok: true,
      service: "verdansc-outreach-stripe-proxy",
      charges: "/charges",
      mode: keyMode(process.env.STRIPE_SECRET_KEY || ""),
    });
    return;
  }

  if (url.pathname !== "/charges") {
    send(res, 404, { ok: false, error: "Not found" });
    return;
  }

  try {
    const result = await listPaymentIntents();
    send(res, result.status, result.body);
  } catch {
    send(res, 502, { ok: false, error: "Stripe request failed" });
  }
});

server.listen(PORT, HOST, () => {
  const mode = keyMode(process.env.STRIPE_SECRET_KEY || "");
  console.log(`stripe-proxy http://${HOST}:${PORT}/charges  mode=${mode}`);
  if (mode === "missing") {
    console.log("Set STRIPE_SECRET_KEY in the environment. Do not commit it.");
  }
});
