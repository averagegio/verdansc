"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import DateDropdown from "../components/DateDropdown";
import ServiceTopBar from "../components/ServiceTopBar";
import type { MoveInChecklistItem } from "../lib/moveInPlanner";

type MoveInPlanPayload = {
  moveInDate?: string;
  address?: string;
  utilitiesReady: boolean;
  insuranceReady: boolean;
  depositPaid: boolean;
  notes?: string;
  evidenceImages: string[];
  checklist: MoveInChecklistItem[];
};

export default function MoveInPlannerPage() {
  const [moveInDate, setMoveInDate] = useState("");
  const [address, setAddress] = useState("");
  const [utilitiesReady, setUtilitiesReady] = useState(false);
  const [insuranceReady, setInsuranceReady] = useState(false);
  const [depositPaid, setDepositPaid] = useState(false);
  const [notes, setNotes] = useState("");
  const [supportingImages, setSupportingImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<MoveInChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const completeCount = useMemo(
    () => checklist.filter((item) => item.complete).length,
    [checklist],
  );
  const totalCount = checklist.length;
  const readinessScore = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.round((completeCount / totalCount) * 100);
  }, [completeCount, totalCount]);
  const nextActions = useMemo(
    () => checklist.filter((item) => !item.complete).slice(0, 2),
    [checklist],
  );
  const riskWarning = useMemo(() => {
    if (!moveInDate) return "";
    const today = new Date();
    const target = new Date(moveInDate);
    const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const targetUtc = Date.UTC(
      target.getFullYear(),
      target.getMonth(),
      target.getDate(),
    );
    const days = Math.floor((targetUtc - todayUtc) / (1000 * 60 * 60 * 24));
    if (days <= 7 && days >= 0 && (!utilitiesReady || !depositPaid)) {
      return "Move-in date is within 7 days and key requirements are incomplete.";
    }
    return "";
  }, [depositPaid, moveInDate, utilitiesReady]);
  const showAuthActions = error.toLowerCase().includes("log in");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/move-in-planner", {
          method: "GET",
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          ok: boolean;
          message?: string;
          plan?: MoveInPlanPayload | null;
        };

        if (!response.ok || !payload.ok) {
          setError(payload.message ?? "Could not load move-in planner.");
          return;
        }

        if (payload.plan) {
          setMoveInDate(payload.plan.moveInDate ?? "");
          setAddress(payload.plan.address ?? "");
          setUtilitiesReady(payload.plan.utilitiesReady);
          setInsuranceReady(payload.plan.insuranceReady);
          setDepositPaid(payload.plan.depositPaid);
          setNotes(payload.plan.notes ?? "");
          setUploadedImageUrls(payload.plan.evidenceImages ?? []);
          setChecklist(payload.plan.checklist ?? []);
        }
      } catch {
        setError("Could not load move-in planner.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      let evidenceImages = [...uploadedImageUrls];
      if (supportingImages.length > 0) {
        const uploadForm = new FormData();
        uploadForm.set("context", "move-in-planner");
        supportingImages.forEach((file) => uploadForm.append("files", file));

        const uploadResponse = await fetch("/api/uploads/evidence", {
          method: "POST",
          body: uploadForm,
        });
        const uploadPayload = (await uploadResponse.json()) as {
          ok: boolean;
          message?: string;
          uploads?: Array<{ url: string }>;
        };
        if (!uploadResponse.ok || !uploadPayload.ok) {
          setError(uploadPayload.message ?? "Could not upload evidence images.");
          return;
        }
        const newUrls = (uploadPayload.uploads ?? []).map((item) => item.url);
        evidenceImages = [...evidenceImages, ...newUrls];
      }

      const response = await fetch("/api/move-in-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moveInDate,
          address,
          utilitiesReady,
          insuranceReady,
          depositPaid,
          notes,
          evidenceImages,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        plan?: MoveInPlanPayload;
      };

      if (!response.ok || !payload.ok || !payload.plan) {
        setError(payload.message ?? "Could not save move-in planner.");
        return;
      }

      setChecklist(payload.plan.checklist ?? []);
      setUploadedImageUrls(payload.plan.evidenceImages ?? evidenceImages);
      setSupportingImages([]);
      setMessage("Move-in planner saved.");
    } catch {
      setError("Could not save move-in planner.");
    } finally {
      setSaving(false);
    }
  };

  const onImagesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setSupportingImages(files);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <ServiceTopBar middleLinkHref="/dashboard" middleLinkLabel="Dashboard" />
      <section className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7 shadow-2xl shadow-cyan-950/30">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Renter Move-In Planner
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            Stay ready for move-in day
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Save your move-in details and keep a clear checklist for deposits,
            utilities, and insurance before handoff.
          </p>
          <div className="mt-4 inline-flex rounded-md border border-cyan-300/40 bg-cyan-900/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyan-100">
            Readiness score: {readinessScore}%
          </div>
          {riskWarning ? (
            <p className="mt-3 rounded-lg border border-amber-300/35 bg-amber-900/15 px-3 py-2 text-xs text-amber-100">
              {riskWarning}
            </p>
          ) : null}

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <DateDropdown
              value={moveInDate}
              onChange={setMoveInDate}
              placeholder="Move-in date"
            />
            <input
              className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              type="text"
              placeholder="Move-in address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={utilitiesReady}
                onChange={(event) => setUtilitiesReady(event.target.checked)}
              />
              Utilities setup is confirmed
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={insuranceReady}
                onChange={(event) => setInsuranceReady(event.target.checked)}
              />
              Renter insurance is confirmed
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={depositPaid}
                onChange={(event) => setDepositPaid(event.target.checked)}
              />
              Deposit payment is complete
            </label>
            <textarea
              className="min-h-24 w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              placeholder="Notes (access instructions, utility account numbers, reminders)"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
            <div className="space-y-2 rounded-md border border-cyan-300/30 bg-slate-950/45 px-3 py-3">
              <label className="block text-sm font-medium text-cyan-100">
                Upload supporting images
              </label>
              <p className="text-xs text-slate-300">
                Add photos for move-in condition, insurance proof, or utility confirmation.
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImagesSelected}
                className="block w-full text-xs text-slate-200 file:mr-3 file:rounded-md file:border file:border-cyan-300/40 file:bg-slate-900 file:px-3 file:py-1 file:text-cyan-100 hover:file:bg-slate-800"
              />
              {supportingImages.length > 0 ? (
                <ul className="space-y-1 text-xs text-slate-300">
                  {supportingImages.map((file) => (
                    <li key={`${file.name}-${file.lastModified}`}>- {file.name}</li>
                  ))}
                </ul>
              ) : null}
              {uploadedImageUrls.length > 0 ? (
                <div className="space-y-1 text-xs text-slate-300">
                  <p className="text-cyan-100">Uploaded evidence:</p>
                  {uploadedImageUrls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block underline underline-offset-2 hover:text-cyan-100"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10 disabled:opacity-50"
                disabled={saving || loading}
              >
                {saving ? "Saving..." : "Save planner"}
              </button>
              <Link
                href="/listings"
                className="inline-flex rounded-md border border-slate-500/60 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/30"
              >
                Browse listings
              </Link>
            </div>
          </form>

          {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
          {error ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-rose-300">{error}</p>
              {showAuthActions ? (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/login?role=renter"
                    className="inline-flex rounded-md border border-rose-300/40 px-3 py-1 text-xs text-rose-100 hover:bg-rose-400/10"
                  >
                    Renter login
                  </Link>
                  <Link
                    href="/signup?role=renter&plan=renter-ready"
                    className="inline-flex rounded-md border border-rose-300/40 px-3 py-1 text-xs text-rose-100 hover:bg-rose-400/10"
                  >
                    Create renter account
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
        </article>

        <aside className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <h2 className="text-lg font-semibold text-cyan-100">Readiness checklist</h2>
          <p className="mt-2 text-sm text-slate-300">
            {loading
              ? "Loading your planner..."
              : `${completeCount}/${checklist.length || 5} tasks complete`}
          </p>
          {nextActions.length > 0 ? (
            <div className="mt-3 rounded-lg border border-cyan-300/30 bg-slate-950/55 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-cyan-200">
                Next best actions
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                {nextActions.map((item) => (
                  <li key={item.id}>- {item.label}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-4 space-y-2">
            {(checklist.length
              ? checklist
              : [
                  {
                    id: "placeholder",
                    label: "Save your planner to generate checklist tasks.",
                    complete: false,
                    note: "Checklist will appear here after first save.",
                  },
                ]
            ).map((item) => (
              <article
                key={item.id}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  item.complete
                    ? "border-emerald-300/40 bg-emerald-900/15 text-emerald-100"
                    : "border-cyan-300/30 bg-slate-950/55 text-slate-200"
                }`}
              >
                <p className="font-medium">{item.label}</p>
                <p className="mt-1 text-xs opacity-90">{item.note}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

