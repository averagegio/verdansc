"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { trackEvent } from "../lib/analytics";

const SLIDES = [
  { id: "open", label: "Opening" },
  { id: "problem", label: "The problem" },
  { id: "product", label: "The product" },
  { id: "tenant", label: "Tenant path" },
  { id: "landlord", label: "Landlord path" },
  { id: "match", label: "Matching" },
  { id: "market", label: "Launch market" },
  { id: "services", label: "Services" },
  { id: "memberships", label: "Memberships" },
  { id: "flywheel", label: "Flywheel" },
  { id: "close", label: "Get started" },
] as const;

type SlideId = (typeof SLIDES)[number]["id"];

const INTERACTIVE_SELECTOR = "a, button, input, textarea, select, [data-no-drag]";

const SERVICES = [
  {
    name: "Credit Check",
    price: "$19",
    href: "/credit-check",
    blurb: "Payment-gated renter and buyer screening reports.",
  },
  {
    name: "Listings",
    price: "Apply",
    href: "/listings",
    blurb: "Browse active listings and compare application fees.",
  },
  {
    name: "Applicant Intake",
    price: "List",
    href: "/rental-application",
    blurb: "Landlord screening workflows and listing links.",
  },
  {
    name: "3D Home Tours",
    price: "API",
    href: "/3d-home-tour",
    blurb: "Walkthrough-ready property experiences for listings.",
  },
  {
    name: "Draft Agreements",
    price: "API",
    href: "/draft-agreements",
    blurb: "Transaction-ready agreement packets in minutes.",
  },
  {
    name: "Escrow",
    price: "API",
    href: "/hold-in-escrow",
    blurb: "Milestone holds and controlled fund release.",
  },
  {
    name: "Broker Match",
    price: "API",
    href: "/broker-services",
    blurb: "Local broker pairing with guided handoff.",
  },
  {
    name: "Move tools",
    price: "Member",
    href: "/membership-tools",
    blurb: "Move-in planner and move-out tracker in one membership.",
  },
];

const FUNNEL = [
  { stage: "Discover", detail: "Map landing + listings in ABQ / Rio Rancho", rate: "100%" },
  { stage: "Activate", detail: "Persona path: renter or landlord", rate: "42%" },
  { stage: "Convert", detail: "Credit check or intake signup", rate: "18%" },
  { stage: "Subscribe", detail: "Rental Ready / Landlord Growth", rate: "7%" },
  { stage: "Expand", detail: "Tours, escrow, broker, move tools", rate: "3.5%" },
];

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));
}

function TenantMock() {
  return (
    <div className="pitch-mock" data-no-drag>
      <p className="pitch-mock-kicker">Live renter surface</p>
      <ol className="pitch-mock-steps">
        <li>
          <span>01</span>
          <div>
            <strong>Search listings</strong>
            <p>Cottonwood 2BR · Albuquerque · fee $35</p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <strong>Credit check</strong>
            <p>Payment-gated report · $19</p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <strong>Apply</strong>
            <p>Cabezon Townhome · Rio Rancho · fee $40</p>
          </div>
        </li>
      </ol>
      <div className="pitch-mock-actions">
        <Link href="/listings" className="pitch-cta-primary">
          Browse listings
        </Link>
        <Link href="/credit-check" className="pitch-cta-ghost">
          Start credit check · $19
        </Link>
      </div>
    </div>
  );
}

function LandlordMock() {
  return (
    <div className="pitch-mock" data-no-drag>
      <p className="pitch-mock-kicker">Listing intake</p>
      <div className="pitch-dropzone" aria-hidden>
        <span className="pitch-dropzone-icon" />
        <p>Drop listing photos</p>
        <p>Kitchen · bedrooms · exterior · unit condition</p>
      </div>
      <ul className="pitch-mock-fields">
        <li>Pineview Apartments</li>
        <li>Albuquerque, NM</li>
        <li>Application fee $35</li>
      </ul>
      <div className="pitch-mock-actions">
        <Link href="/rental-application" className="pitch-cta-primary">
          List a property
        </Link>
        <Link href="/signup?role=landlord&plan=landlord-growth" className="pitch-cta-ghost">
          Create landlord account
        </Link>
      </div>
    </div>
  );
}

function MatchMock() {
  return (
    <div className="pitch-mock" data-no-drag>
      <p className="pitch-mock-kicker">Queue + status</p>
      <ul className="pitch-notify">
        <li>
          <span className="pitch-notify-dot" />
          <div>
            <strong>New application</strong>
            <p>Cottonwood 2BR · paid fee · in landlord queue</p>
          </div>
        </li>
        <li>
          <span className="pitch-notify-dot is-teal" />
          <div>
            <strong>Credit check complete</strong>
            <p>Renter screening report attached</p>
          </div>
        </li>
        <li>
          <span className="pitch-notify-dot is-amber" />
          <div>
            <strong>Status update</strong>
            <p>Applicant can track the intake from their link</p>
          </div>
        </li>
      </ul>
      <div className="pitch-mock-actions">
        <Link href="/login?role=landlord" className="pitch-cta-primary">
          Open landlord dashboard
        </Link>
        <Link href="/login?role=renter" className="pitch-cta-ghost">
          Renter login
        </Link>
      </div>
    </div>
  );
}

function ExpandPanel({
  id,
  open,
  onToggle,
  summary,
  children,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  summary: string;
  children: ReactNode;
}) {
  return (
    <div className="pitch-expand" data-no-drag>
      <button
        type="button"
        className="pitch-expand-btn"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        {open ? "Hide details" : summary}
      </button>
      <div id={id} hidden={!open} className="pitch-expand-body">
        {children}
      </div>
    </div>
  );
}

export default function PitchDeck() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startLeft: 0,
    moved: false,
  });
  const skipClickRef = useRef(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState<Partial<Record<SlideId, boolean>>>({});
  const liveId = useId();
  const activeSlide = SLIDES[active];

  const syncActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    const index = Math.round(el.scrollLeft / width);
    setActive(Math.min(Math.max(index, 0), SLIDES.length - 1));
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  const goTo = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const next = Math.min(Math.max(index, 0), SLIDES.length - 1);
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setActive(next);
  }, []);

  const goBy = useCallback(
    (delta: number) => {
      goTo(active + delta);
    },
    [active, goTo],
  );

  const toggleExpand = useCallback((id: SlideId) => {
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  useEffect(() => {
    trackEvent("pitch_view", { page: "/pitch" });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      el.scrollBy({ left: event.deltaY, behavior: "auto" });
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (event.button !== 0) return;
      if (isInteractiveTarget(event.target)) return;
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startLeft: el.scrollLeft,
        moved: false,
      };
      el.setPointerCapture(event.pointerId);
      setDragging(true);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (dragRef.current.pointerId !== event.pointerId) return;
      const dx = event.clientX - dragRef.current.startX;
      if (Math.abs(dx) > 8) dragRef.current.moved = true;
      el.scrollLeft = dragRef.current.startLeft - dx;
    };

    const endDrag = (event: PointerEvent) => {
      if (dragRef.current.pointerId !== event.pointerId) return;
      const moved = dragRef.current.moved;
      dragRef.current.pointerId = -1;
      skipClickRef.current = moved;
      setDragging(false);
      const width = el.clientWidth || 1;
      const index = Math.round(el.scrollLeft / width);
      goTo(index);
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!skipClickRef.current) return;
      skipClickRef.current = false;
      event.preventDefault();
      event.stopPropagation();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", syncActive, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);
    syncActive();

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", syncActive);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [goTo, syncActive]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        goBy(1);
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goBy(-1);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        goTo(SLIDES.length - 1);
        return;
      }
      if (event.key === " " && !(target instanceof HTMLButtonElement)) {
        event.preventDefault();
        goBy(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBy, goTo]);

  return (
    <main className="pitch-deck">
      <header className="pitch-chrome">
        <Link href="/" className="pitch-brand">
          VERDANSC
        </Link>
        <nav className="pitch-dots" aria-label="Pitch slides">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`pitch-dot ${active === index ? "is-active" : ""}`}
              onClick={() => goTo(index)}
              aria-label={`Go to ${slide.label}`}
              aria-current={active === index ? "true" : undefined}
            />
          ))}
        </nav>
        <p className="pitch-hint">
          {String(active + 1).padStart(2, "0")}/{String(SLIDES.length).padStart(2, "0")} · swipe
        </p>
      </header>

      <div className="pitch-progress" aria-hidden>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <p id={liveId} className="pitch-live" aria-live="polite">
        Slide {active + 1} of {SLIDES.length}: {activeSlide.label}
      </p>

      <button
        type="button"
        className="pitch-arrow pitch-arrow--prev"
        onClick={() => goBy(-1)}
        disabled={active === 0}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="pitch-arrow pitch-arrow--next"
        onClick={() => goBy(1)}
        disabled={active === SLIDES.length - 1}
        aria-label="Next slide"
      >
        ›
      </button>

      <div
        ref={scrollerRef}
        className={`pitch-scroller ${dragging ? "is-dragging" : ""}`}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="VERDANSC pitch deck"
        aria-describedby={liveId}
      >
        <section className="pitch-slide" aria-roledescription="slide" aria-label="Opening">
          <article className="pitch-card pitch-card--hero">
            <div className="pitch-atmosphere" aria-hidden />
            <p className="pitch-kicker">Marketplace pitch · Albuquerque &amp; Rio Rancho</p>
            <h1 className="pitch-logo">VERDANSC</h1>
            <p className="pitch-slogan">Real estate, mapped to action.</p>
            <p className="pitch-lede">
              The map-first rental marketplace where tenants search, screen, and
              apply — and landlords list, intake photos, and fill units from one
              intelligent surface.
            </p>
            <div className="pitch-open-meta">
              <span>Tenants + landlords</span>
              <span>Credit check $19</span>
              <span>ABQ / Rio Rancho</span>
            </div>
            <div className="pitch-cta-row">
              <button type="button" className="pitch-cta-primary" onClick={() => goTo(1)}>
                Start the deck
              </button>
              <Link href="/signup" className="pitch-cta-secondary">
                Create an account
              </Link>
            </div>
          </article>
        </section>

        <section className="pitch-slide" aria-roledescription="slide" aria-label="The problem">
          <article className="pitch-card">
            <p className="pitch-kicker">The problem</p>
            <h2 className="pitch-title">Leasing is a pile of tabs, PDFs, and guesswork.</h2>
            <p className="pitch-sub">
              Renters bounce between listings, credit portals, and applications.
              Landlords juggle photos, intake forms, and screening in disconnected
              tools.
            </p>
            <ul className="pitch-problem-grid">
              <li>
                <h3>Tenants</h3>
                <p>
                  No single path from discovery to a payment-gated credit check and
                  a listing application with a clear fee.
                </p>
              </li>
              <li>
                <h3>Landlords</h3>
                <p>
                  Listing media, applicant intake, and the screening queue live in
                  different inboxes. Qualified demand leaks.
                </p>
              </li>
              <li>
                <h3>The market</h3>
                <p>
                  Albuquerque and Rio Rancho still run high-churn rentals on
                  generic national boards that do not own the transaction.
                </p>
              </li>
            </ul>
            <ExpandPanel
              id="problem-details"
              open={Boolean(expanded.problem)}
              onToggle={() => toggleExpand("problem")}
              summary="Why this stalls deals"
            >
              <p>
                Credit, tours, agreements, escrow, and broker handoff are already
                separate Verdansc services. The gap is a marketplace that sequences
                them for both sides of the lease.
              </p>
            </ExpandPanel>
          </article>
        </section>

        <section className="pitch-slide" aria-roledescription="slide" aria-label="The product">
          <article className="pitch-card">
            <p className="pitch-kicker">The product</p>
            <h2 className="pitch-title">One map. Two personas. Every lease action.</h2>
            <p className="pitch-sub">
              VERDANSC is a map-first service portal: renters and landlords pick a
              path, then run credit checks, listings, intake, tours, agreements,
              and escrow from the same surface.
            </p>
            <div className="pitch-split">
              <article className="pitch-persona-card">
                <p>For renters and buyers</p>
                <h3>Search, screen, apply</h3>
                <p>
                  Run your credit check, submit a rental request, and move forward
                  with confidence.
                </p>
                <Link href="/signup?role=renter&plan=renter-ready">Sign up as a renter</Link>
              </article>
              <article className="pitch-persona-card">
                <p>For landlords and managers</p>
                <h3>List, intake, screen</h3>
                <p>
                  Set up applicant intake, screen renters, and manage transaction
                  services in one place.
                </p>
                <Link href="/signup?role=landlord&plan=landlord-growth">
                  Sign up as a landlord
                </Link>
              </article>
            </div>
          </article>
        </section>

        <section className="pitch-slide" aria-roledescription="slide" aria-label="Tenant path">
          <article className="pitch-card pitch-card--split">
            <div>
              <p className="pitch-kicker">Tenant flow</p>
              <h2 className="pitch-title">Search. Credit check. Apply.</h2>
              <p className="pitch-sub">
                Browse active listings, compare application fees, run a $19
                payment-gated credit check, then submit through the landlord&apos;s
                intake link.
              </p>
              <ul className="pitch-stat-row">
                <li>
                  <strong>$19</strong>
                  <span>credit check ticket</span>
                </li>
                <li>
                  <strong>$15/mo</strong>
                  <span>Rental Ready Club</span>
                </li>
                <li>
                  <strong>Apply</strong>
                  <span>fee shown before submit</span>
                </li>
              </ul>
            </div>
            <TenantMock />
          </article>
        </section>

        <section className="pitch-slide" aria-roledescription="slide" aria-label="Landlord path">
          <article className="pitch-card pitch-card--split">
            <div>
              <p className="pitch-kicker">Landlord flow</p>
              <h2 className="pitch-title">Photos in. Intake live. Units filling.</h2>
              <p className="pitch-sub">
                Configure leasing intake for each property, attach listing photos,
                set the application fee, and share a structured apply link that
                matches your screening process.
              </p>
              <ul className="pitch-stat-row">
                <li>
                  <strong>$99/mo</strong>
                  <span>Landlord Growth</span>
                </li>
                <li>
                  <strong>Intake</strong>
                  <span>one link per listing</span>
                </li>
                <li>
                  <strong>Queue</strong>
                  <span>paid applications</span>
                </li>
              </ul>
            </div>
            <LandlordMock />
          </article>
        </section>

        <section className="pitch-slide" aria-roledescription="slide" aria-label="Matching">
          <article className="pitch-card pitch-card--split">
            <div>
              <p className="pitch-kicker">Matching &amp; notifications</p>
              <h2 className="pitch-title">Demand hits the queue the moment it pays.</h2>
              <p className="pitch-sub">
                Paid applications land in the landlord dashboard. Renters track
                status from their application link. Credit reports, fees, and
                notes stay attached to the same file.
              </p>
              <ExpandPanel
                id="match-details"
                open={Boolean(expanded.match)}
                onToggle={() => toggleExpand("match")}
                summary="What each side sees"
              >
                <p>
                  Landlords see an applicant pipeline with paid submissions.
                  Renters see payment confirmation and queue status. Move-in
                  planner and move-out tracker expand the same membership after
                  the match.
                </p>
              </ExpandPanel>
            </div>
            <MatchMock />
          </article>
        </section>

        <section className="pitch-slide" aria-roledescription="slide" aria-label="Launch market">
          <article className="pitch-card">
            <p className="pitch-kicker">Launch market</p>
            <h2 className="pitch-title">Win Albuquerque. Densify Rio Rancho.</h2>
            <p className="pitch-sub">
              Start where churn is high and national boards are thin on local
              transaction tools — then replicate the map playbook city by city.
            </p>
            <div className="pitch-market-grid">
              <article className="pitch-market-card">
                <p>Primary</p>
                <h3>Albuquerque</h3>
                <p>
                  Map-first discovery for renters and buyers, with credit check
                  and apply on the same pin layer.
                </p>
              </article>
              <article className="pitch-market-card">
                <p>Adjacent</p>
                <h3>Rio Rancho</h3>
                <p>
                  Townhome and small-multifamily inventory with landlord intake
                  links and member-rate screening.
                </p>
              </article>
            </div>
            <div className="pitch-mau-row pitch-mau-row--compact">
              <article className="pitch-mau-card">
                <p className="pitch-mau-year">Y1</p>
                <p className="pitch-mau-value">12k</p>
                <p className="pitch-mau-label">Launch markets</p>
              </article>
              <article className="pitch-mau-card">
                <p className="pitch-mau-year">Y2</p>
                <p className="pitch-mau-value">48k</p>
                <p className="pitch-mau-label">Regional density</p>
              </article>
              <article className="pitch-mau-card">
                <p className="pitch-mau-year">Y3</p>
                <p className="pitch-mau-value">140k</p>
                <p className="pitch-mau-label">National map</p>
              </article>
            </div>
          </article>
        </section>

        <section className="pitch-slide" aria-roledescription="slide" aria-label="Services">
          <article className="pitch-card">
            <p className="pitch-kicker">Service breakdown</p>
            <h2 className="pitch-title">Every pin is a product surface.</h2>
            <p className="pitch-sub">
              Paid once, subscribed monthly, or billed through partner APIs —
              tap a card to open the live service.
            </p>
            <ul className="pitch-service-grid">
              {SERVICES.map((service) => (
                <li key={service.name}>
                  <Link href={service.href} className="pitch-service">
                    <div className="pitch-service-top">
                      <h3>{service.name}</h3>
                      <span>{service.price}</span>
                    </div>
                    <p>{service.blurb}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="pitch-slide" aria-roledescription="slide" aria-label="Memberships">
          <article className="pitch-card">
            <p className="pitch-kicker">Memberships</p>
            <h2 className="pitch-title">Convert one action into a recurring plan.</h2>
            <p className="pitch-sub">
              Start with renter-ready tools or landlord management features. Switch
              later as volume changes.
            </p>
            <div className="pitch-plan-grid">
              <article className="pitch-plan">
                <p>Renters / buyers</p>
                <h3>Rental Ready Club</h3>
                <p className="pitch-plan-price">$15/mo</p>
                <p>Reusable renter profile, readiness perks, and reminders.</p>
                <Link href="/signup?role=renter&plan=renter-ready">Create renter account</Link>
              </article>
              <article className="pitch-plan is-featured">
                <p>Landlords / managers</p>
                <h3>Landlord Growth</h3>
                <p className="pitch-plan-price">$99/mo</p>
                <p>Applicant pipeline, intake links, member-rate credit volume.</p>
                <Link href="/signup?role=landlord&plan=landlord-growth">
                  Create landlord account
                </Link>
              </article>
            </div>
            <p className="pitch-footnote">
              Plus tiers: Rental Ready Plus $29/mo · Landlord Pro $249/mo.{" "}
              <Link href="/pricing">View all pricing</Link>
            </p>
          </article>
        </section>

        <section className="pitch-slide" aria-roledescription="slide" aria-label="Flywheel">
          <article className="pitch-card">
            <p className="pitch-kicker">Two-sided flywheel</p>
            <h2 className="pitch-title">Renters bring applications. Landlords bring inventory.</h2>
            <p className="pitch-sub">
              Each side unlocks paid APIs for the other — credit, tours, escrow,
              broker match — then membership expand.
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
            <p className="pitch-footnote">
              Planning benchmarks for GTM modeling in launch metros.
            </p>
          </article>
        </section>

        <section className="pitch-slide" aria-roledescription="slide" aria-label="Get started">
          <article className="pitch-card pitch-card--hero">
            <div className="pitch-atmosphere pitch-atmosphere--close" aria-hidden />
            <p className="pitch-kicker">Next step</p>
            <h2 className="pitch-logo pitch-logo--sm">VERDANSC</h2>
            <p className="pitch-slogan">Real estate, mapped to action.</p>
            <p className="pitch-lede">
              Pick a side and run the live product — search a listing, start a
              credit check, or publish intake for a property in Albuquerque or
              Rio Rancho.
            </p>
            <div className="pitch-cta-row">
              <Link href="/signup" className="pitch-cta-primary">
                Sign up
              </Link>
              <Link href="/listings" className="pitch-cta-primary">
                Apply to a listing
              </Link>
              <Link href="/rental-application" className="pitch-cta-primary">
                List a property
              </Link>
            </div>
            <div className="pitch-cta-row">
              <Link href="/credit-check" className="pitch-cta-secondary">
                Credit check · $19
              </Link>
              <Link href="/" className="pitch-cta-secondary">
                Explore the live map
              </Link>
              <a href="mailto:support@verdansc.com" className="pitch-cta-secondary">
                Request the data room
              </a>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
