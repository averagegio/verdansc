"use client";

import Link from "next/link";
import { useState } from "react";

type ApiPin = {
  id: string;
  label: string;
  href: string;
  top: string;
  left: string;
};

const API_PINS: ApiPin[] = [
  {
    id: "credit-check",
    label: "Credit Check API",
    href: "/credit-check",
    top: "76%",
    left: "63%",
  },
  {
    id: "home-tour",
    label: "3D Home Tour API",
    href: "/3d-home-tour",
    top: "49%",
    left: "44%",
  },
  {
    id: "draft-agreements",
    label: "Draft Agreements API",
    href: "/draft-agreements",
    top: "58%",
    left: "31%",
  },
  {
    id: "escrow",
    label: "Hold In Escrow API",
    href: "/hold-in-escrow",
    top: "68%",
    left: "18%",
  },
  {
    id: "broker-services",
    label: "Broker Services API",
    href: "/broker-services",
    top: "36%",
    left: "70%",
  },
];

export default function Home() {
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

        <p className="map-tagline">
          Unified real estate service APIs for credit checks, tours, agreements,
          escrow, and broker matching.
        </p>

        <footer className="map-footer">VERDANSC 2026 INC</footer>
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
        <button type="button" className="drawer-login">
          Login
        </button>
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
                <p className="api-card-kicker">API NODE</p>
                <h3>{pin.label}</h3>
                <p>Open the service page and endpoint tools.</p>
                <Link
                  href={pin.href}
                  className="api-card-link"
                  onFocus={() => setActivePin(pin.id)}
                  onClick={() => setDrawerOpen(false)}
                >
                  Open service
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
