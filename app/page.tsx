"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "./lib/analytics";

type ApiPin = {
  id: string;
  label: string;
  blurb: string;
  href: string;
  top: string;
  left: string;
};

type Persona = "renter" | "landlord";

const API_PINS: ApiPin[] = [
  {
    id: "credit-check",
    label: "Credit Check",
    blurb: "Pre-screen renters and buyers with fast payment-gated reports.",
    href: "/credit-check",
    top: "76%",
    left: "63%",
  },
  {
    id: "home-tour",
    label: "3D Home Tours",
    blurb: "Generate walkthrough-ready property experiences for listings.",
    href: "/3d-home-tour",
    top: "49%",
    left: "44%",
  },
  {
    id: "draft-agreements",
    label: "Draft Agreements",
    blurb: "Create transaction-ready agreement packets faster.",
    href: "/draft-agreements",
    top: "58%",
    left: "31%",
  },
  {
    id: "escrow",
    label: "Escrow Services",
    blurb: "Handle milestones and fund release workflows securely.",
    href: "/hold-in-escrow",
    top: "68%",
    left: "18%",
  },
  {
    id: "broker-services",
    label: "Broker Services",
    blurb: "Match clients with local brokers and offer guidance.",
    href: "/broker-services",
    top: "36%",
    left: "70%",
  },
  {
    id: "rental-application",
    label: "Applicant Intake Setup",
    blurb: "Configure landlord intake and screening workflow in one flow.",
    href: "/rental-application",
    top: "52%",
    left: "57%",
  },
  {
    id: "rental-application-listings",
    label: "Rental Application Listings",
    blurb: "Browse active listings and compare application fees before applying.",
    href: "/listings",
    top: "43%",
    left: "53%",
  },
  {
    id: "move-in-planner",
    label: "Move-In Planner",
    blurb: "Track move-in readiness tasks for deposits, utilities, and insurance.",
    href: "/move-in-planner",
    top: "47%",
    left: "62%",
  },
  {
    id: "move-out-tracker",
    label: "Move-Out Tracker",
    blurb: "Track notice, ledger, and documentation readiness for move-out workflows.",
    href: "/move-out-tracker",
    top: "60%",
    left: "66%",
  },
];

export default function Home() {
  const [persona, setPersona] = useState<Persona>("renter");
  const [activePin, setActivePin] = useState<string>(API_PINS[0].id);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMapMove = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    setTilt({
      x: (py - 0.5) * 12,
      y: (px - 0.5) * -12,
    });
  };

  const onMapLeave = () => setTilt({ x: 0, y: 0 });

  useEffect(() => {
    trackEvent("landing_view", { page: "/" });
  }, []);

  const personaText =
    persona === "renter"
      ? {
          title: "For renters and buyers",
          subtitle:
            "Run your credit check, submit a rental request, and move forward with confidence.",
          ctaLabel: "Start My Credit Check - $19",
          ctaHref: "/credit-check",
        }
      : {
          title: "For landlords and managers",
          subtitle:
            "Set up applicant intake, screen renters, and manage transaction services in one place.",
          ctaLabel: "Set Up Applicant Intake",
          ctaHref: "/rental-application",
        };

  return (
    <main className="map-landing">
      <section className="map-shell">
        <div className="map-topbar">
          <button
            type="button"
            className="hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <header className="verdansc-header">
            <h1>VERDANSC</h1>
            <p>Intelligent Real Estate API Map</p>
          </header>
        </div>

        <article
          className="map-stage"
          onMouseMove={onMapMove}
          onMouseLeave={onMapLeave}
          style={
            {
              "--tilt-x": `${tilt.x}deg`,
              "--tilt-y": `${tilt.y}deg`,
              "--glow-x": `${50 + tilt.y * -2}%`,
              "--glow-y": `${50 + tilt.x * 2}%`,
            } as React.CSSProperties
          }
        >
          <div className="map-surface" role="img" aria-label="Aerial city map">
            {API_PINS.map((pin) => (
              <Link
                key={pin.id}
                href={pin.href}
                className={`map-pin ${activePin === pin.id ? "is-active" : ""}`}
                style={{ top: pin.top, left: pin.left }}
                onMouseEnter={() => setActivePin(pin.id)}
                onFocus={() => setActivePin(pin.id)}
                aria-label={pin.label}
              >
                <span className="pin-head" />
                <span className="pin-label">{pin.label}</span>
              </Link>
            ))}
          </div>
        </article>

        <section className="persona-switch" aria-label="Choose your path">
          <p className="persona-kicker">Choose your path</p>
          <div className="persona-buttons" role="tablist" aria-label="Audience">
            <button
              type="button"
              className={`persona-btn ${persona === "renter" ? "is-active" : ""}`}
              onClick={() => {
                setPersona("renter");
                trackEvent("persona_selected", { persona: "renter" });
              }}
            >
              Renter / Buyer
            </button>
            <button
              type="button"
              className={`persona-btn ${persona === "landlord" ? "is-active" : ""}`}
              onClick={() => {
                setPersona("landlord");
                trackEvent("persona_selected", { persona: "landlord" });
              }}
            >
              Landlord / Manager
            </button>
          </div>
          <p className="persona-title">{personaText.title}</p>
        </section>

        <p className="map-tagline">
          {personaText.subtitle}
        </p>

        <div className="map-cta-row">
          <Link
            href={personaText.ctaHref}
            className="map-primary-cta"
            onClick={() =>
              trackEvent("landing_primary_cta_click", {
                persona,
                destination: personaText.ctaHref,
              })
            }
          >
            {personaText.ctaLabel}
          </Link>
          <Link
            href="/pricing"
            className="map-secondary-cta"
            onClick={() =>
              trackEvent("landing_membership_cta_click", {
                persona,
                destination: "/pricing",
              })
            }
          >
            Explore membership plans
          </Link>
        </div>

        <footer className="map-footer">
          <span>VERDANSC 2026 INC</span>
          <nav className="footer-links">
            <Link href="/pricing">Pricing</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </footer>
      </section>

      <button
        type="button"
        className={`drawer-overlay ${drawerOpen ? "is-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-label="Close menu overlay"
      />

      <aside className={`map-drawer ${drawerOpen ? "is-open" : ""}`}>
        <button
          type="button"
          className="drawer-close"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
        >
          Close
        </button>
        <div className="drawer-avatar" aria-hidden>
          VG
        </div>
        <p className="drawer-title">Verdansc Operator</p>
        <Link href="/login" className="drawer-login">
          Login
        </Link>
        <p className="drawer-subtitle">
          Hover or select a service to highlight its map endpoint.
        </p>

        <div className="api-carousel">
          <div
            className="api-carousel-track"
            style={
              {
                "--slide-index": carouselIndex,
              } as React.CSSProperties
            }
          >
            {API_PINS.map((pin) => (
              <article
                key={pin.id}
                className={`api-card ${activePin === pin.id ? "is-active" : ""}`}
                onMouseEnter={() => setActivePin(pin.id)}
              >
                <p className="api-card-kicker">SERVICE</p>
                <h3>{pin.label}</h3>
                <p>{pin.blurb}</p>
                <Link
                  href={pin.href}
                  className="api-card-link"
                  onFocus={() => setActivePin(pin.id)}
                  onClick={() => setDrawerOpen(false)}
                >
                  View service
                </Link>
              </article>
            ))}
          </div>
        </div>

        <div className="api-slider-wrap">
          <input
            type="range"
            min={0}
            max={API_PINS.length - 1}
            step={1}
            value={carouselIndex}
            onChange={(event) => {
              const nextIndex = Number(event.target.value);
              setCarouselIndex(nextIndex);
              setActivePin(API_PINS[nextIndex].id);
            }}
            aria-label="Scroll API carousel"
          />
          <p>
            {carouselIndex + 1} / {API_PINS.length}
          </p>
        </div>

        <nav className="drawer-links">
          {API_PINS.map((pin, index) => (
            <Link
              key={pin.id}
              href={pin.href}
              className="drawer-link"
              onMouseEnter={() => setActivePin(pin.id)}
              onClick={() => {
                setCarouselIndex(index);
                setDrawerOpen(false);
              }}
            >
              {pin.label}
            </Link>
          ))}
        </nav>
      </aside>
    </main>
  );
}
