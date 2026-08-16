"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  "open",
  "services",
  "funnel",
  "mau",
  "projections",
  "growth",
  "funding",
  "close",
] as const;

type SlideId = (typeof SLIDES)[number];

const SERVICES = [
  {
    name: "Credit Check",
    price: "$19",
    blurb: "Payment-gated renter and buyer screening reports.",
  },
  {
    name: "3D Home Tours",
    price: "API",
    blurb: "Walkthrough-ready property experiences for listings.",
  },
  {
    name: "Draft Agreements",
    price: "API",
    blurb: "Transaction-ready agreement packets in minutes.",
  },
  {
    name: "Escrow",
    price: "API",
    blurb: "Milestone holds and controlled fund release.",
  },
  {
    name: "Broker Match",
    price: "API",
    blurb: "Local broker pairing with guided handoff.",
  },
  {
    name: "Applicant Intake",
    price: "Membership",
    blurb: "Landlord screening workflows and listing links.",
  },
  {
    name: "Move-In Planner",
    price: "Membership",
    blurb: "Deposits, utilities, and insurance readiness.",
  },
  {
    name: "Move-Out Tracker",
    price: "Membership",
    blurb: "Notice, ledger, and documentation closeout.",
  },
];

const FUNNEL = [
  { stage: "Discover", detail: "Map landing + SEO + partner listings", rate: "100%" },
  { stage: "Activate", detail: "Persona path: renter or landlord", rate: "42%" },
  { stage: "Convert", detail: "Credit check or intake signup", rate: "18%" },
  { stage: "Subscribe", detail: "Rental Ready / Landlord Growth", rate: "7%" },
  { stage: "Expand", detail: "Tours, escrow, broker, move tools", rate: "3.5%" },
];

const MAU = [
  { year: "Y1", value: "12k", label: "Launch markets" },
  { year: "Y2", value: "48k", label: "Regional density" },
  { year: "Y3", value: "140k", label: "National map" },
];

const PROJECTIONS = [
  { year: "2026", revenue: "$0.9M", gmv: "$4.2M", margin: "38%" },
  { year: "2027", revenue: "$3.8M", gmv: "$18M", margin: "46%" },
  { year: "2028", revenue: "$11.2M", gmv: "$52M", margin: "52%" },
];

const GROWTH = [
  {
    title: "Map-first acquisition",
    body: "Own intent at the service pin layer—credit, tours, escrow—before competitors own the search ad.",
  },
  {
    title: "Dual-sided flywheel",
    body: "Renters bring applications; landlords bring inventory. Each side unlocks paid APIs for the other.",
  },
  {
    title: "Membership expand",
    body: "Convert one-time credit checks into Rental Ready and Landlord Growth recurring plans.",
  },
  {
    title: "City density",
    body: "Launch in high-churn rental metros, then replicate the map playbook city by city.",
  },
];

const USE_OF_FUNDS = [
  { pct: "40%", label: "Product & engineering", detail: "Map UX, API reliability, billing, screening depth" },
  { pct: "25%", label: "Growth & partnerships", detail: "Landlord acquisition, broker network, listing supply" },
  { pct: "20%", label: "Compliance & trust", detail: "Credit data partners, escrow controls, legal ops" },
  { pct: "15%", label: "Ops & runway", detail: "Support, GTM talent, 18-month operating buffer" },
];

export default function PitchDeckPage() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const syncActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    const index = Math.round(el.scrollLeft / width);
    setActive(Math.min(Math.max(index, 0), SLIDES.length - 1));
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      el.scrollBy({ left: event.deltaY, behavior: "auto" });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", syncActive, { passive: true });
    syncActive();
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", syncActive);
    };
  }, [syncActive]);

  const goTo = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const next = event.key === "ArrowRight" ? active + 1 : active - 1;
      goTo(Math.min(Math.max(next, 0), SLIDES.length - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  return (
    <main className="pitch-deck">
      <header className="pitch-chrome">
        <Link href="/" className="pitch-brand">
          VERDANSC
        </Link>
        <nav className="pitch-dots" aria-label="Pitch slides">
          {SLIDES.map((id, index) => (
            <button
              key={id}
              type="button"
              className={`pitch-dot ${active === index ? "is-active" : ""}`}
              onClick={() => goTo(index)}
              aria-label={`Go to ${id} slide`}
              aria-current={active === index}
            />
          ))}
        </nav>
        <p className="pitch-hint">
          Scroll → · {active + 1}/{SLIDES.length}
        </p>
      </header>

      <div className="pitch-progress" aria-hidden>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div
        ref={scrollerRef}
        className="pitch-scroller"
        tabIndex={0}
        aria-label="Horizontal pitch deck"
      >
        {/* 1 — Open / Slogan */}
        <section className="pitch-slide pitch-slide--open" data-slide={"open" as SlideId}>
          <div className="pitch-atmosphere" aria-hidden />
          <div className="pitch-open-copy">
            <p className="pitch-kicker">Seed pitch · 2026</p>
            <h1 className="pitch-logo">VERDANSC</h1>
            <p className="pitch-slogan">Real estate, mapped to action.</p>
            <p className="pitch-lede">
              The map-first service portal where renters, landlords, and brokers
              run credit checks, tours, agreements, escrow, and move workflows
              from one intelligent surface.
            </p>
            <div className="pitch-open-meta">
              <span>B2C + B2B</span>
              <span>API-linked services</span>
              <span>Membership expand</span>
            </div>
          </div>
        </section>

        {/* 2 — Services */}
        <section className="pitch-slide" data-slide={"services" as SlideId}>
          <div className="pitch-slide-inner">
            <p className="pitch-kicker">Service breakdown</p>
            <h2 className="pitch-title">One map. Eight monetizable endpoints.</h2>
            <p className="pitch-sub">
              Each pin is a product surface—paid once, subscribed monthly, or
              billed through partner APIs.
            </p>
            <ul className="pitch-service-grid">
              {SERVICES.map((service) => (
                <li key={service.name} className="pitch-service">
                  <div className="pitch-service-top">
                    <h3>{service.name}</h3>
                    <span>{service.price}</span>
                  </div>
                  <p>{service.blurb}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3 — Sales funnel */}
        <section className="pitch-slide" data-slide={"funnel" as SlideId}>
          <div className="pitch-slide-inner">
            <p className="pitch-kicker">Sales funnel</p>
            <h2 className="pitch-title">From map curiosity to recurring revenue.</h2>
            <p className="pitch-sub">
              Target conversion path for launch markets. Rates are planning
              benchmarks for GTM modeling.
            </p>
            <ol className="pitch-funnel">
              {FUNNEL.map((step, index) => (
                <li key={step.stage} className="pitch-funnel-step">
                  <span className="pitch-funnel-index">0{index + 1}</span>
                  <div>
                    <h3>{step.stage}</h3>
                    <p>{step.detail}</p>
                  </div>
                  <strong>{step.rate}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4 — MAU */}
        <section className="pitch-slide" data-slide={"mau" as SlideId}>
          <div className="pitch-slide-inner">
            <p className="pitch-kicker">Monthly active users</p>
            <h2 className="pitch-title">MAU that compounds with city density.</h2>
            <p className="pitch-sub">
              Users who complete at least one service action or membership session
              in-month.
            </p>
            <div className="pitch-mau-row">
              {MAU.map((item, index) => (
                <article
                  key={item.year}
                  className="pitch-mau-card"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <p className="pitch-mau-year">{item.year}</p>
                  <p className="pitch-mau-value">{item.value}</p>
                  <p className="pitch-mau-label">{item.label}</p>
                  <div
                    className="pitch-mau-bar"
                    style={{ height: `${28 + index * 28}%` }}
                    aria-hidden
                  />
                </article>
              ))}
            </div>
            <p className="pitch-footnote">
              Mix target by Y3: ~65% renters/buyers · ~25% landlords · ~10% brokers/partners
            </p>
          </div>
        </section>

        {/* 5 — Projections */}
        <section className="pitch-slide" data-slide={"projections" as SlideId}>
          <div className="pitch-slide-inner">
            <p className="pitch-kicker">Projections</p>
            <h2 className="pitch-title">Revenue built on checks, memberships, and APIs.</h2>
            <p className="pitch-sub">
              Conservative model: credit-check volume + subscription attach +
              high-margin service attach (tours, escrow, broker).
            </p>
            <div className="pitch-table-wrap">
              <table className="pitch-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Net revenue</th>
                    <th>Service GMV</th>
                    <th>Gross margin</th>
                  </tr>
                </thead>
                <tbody>
                  {PROJECTIONS.map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>{row.revenue}</td>
                      <td>{row.gmv}</td>
                      <td>{row.margin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="pitch-unit-economics">
              <li>
                <strong>$19</strong>
                <span>avg credit-check ticket</span>
              </li>
              <li>
                <strong>$15–$249</strong>
                <span>membership ARPU band</span>
              </li>
              <li>
                <strong>7%</strong>
                <span>visitor → paid target</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 6 — Growth strategy */}
        <section className="pitch-slide" data-slide={"growth" as SlideId}>
          <div className="pitch-slide-inner">
            <p className="pitch-kicker">Growth strategy</p>
            <h2 className="pitch-title">Win the map, then widen the corridor.</h2>
            <div className="pitch-growth-grid">
              {GROWTH.map((item) => (
                <article key={item.title} className="pitch-growth-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7 — Funding */}
        <section className="pitch-slide" data-slide={"funding" as SlideId}>
          <div className="pitch-slide-inner">
            <p className="pitch-kicker">Funding ask</p>
            <h2 className="pitch-title">Raising $1.8M seed.</h2>
            <p className="pitch-sub">
              18-month runway to harden the service map, densify three launch
              metros, and prove paid MAU → membership expand.
            </p>
            <div className="pitch-ask-hero">
              <p className="pitch-ask-amount">$1.8M</p>
              <p className="pitch-ask-note">Seed · SAFE preferred</p>
            </div>
            <ul className="pitch-funds">
              {USE_OF_FUNDS.map((item) => (
                <li key={item.label}>
                  <strong>{item.pct}</strong>
                  <div>
                    <h3>{item.label}</h3>
                    <p>{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8 — Close */}
        <section className="pitch-slide pitch-slide--close" data-slide={"close" as SlideId}>
          <div className="pitch-atmosphere pitch-atmosphere--close" aria-hidden />
          <div className="pitch-open-copy">
            <p className="pitch-kicker">Next step</p>
            <h2 className="pitch-logo pitch-logo--sm">VERDANSC</h2>
            <p className="pitch-slogan">Real estate, mapped to action.</p>
            <p className="pitch-lede">
              Let&apos;s put capital on the map—and turn every pin into a
              durable revenue line.
            </p>
            <div className="pitch-cta-row">
              <a href="mailto:support@verdansc.com" className="pitch-cta-primary">
                Request the data room
              </a>
              <Link href="/" className="pitch-cta-secondary">
                Explore the live map
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
