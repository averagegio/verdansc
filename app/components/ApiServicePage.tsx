import Link from "next/link";
import ApiResponsePreview from "./ApiResponsePreview";

type ApiServicePageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  features: string[];
  workflow: string[];
  endpoint: string;
};

export default function ApiServicePage({
  eyebrow,
  title,
  summary,
  features,
  workflow,
  endpoint,
}: ApiServicePageProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7 shadow-2xl shadow-cyan-950/30">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-slate-300">{summary}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-lg border border-cyan-400/20 bg-slate-950/50 px-4 py-3 text-sm text-slate-200"
              >
                {feature}
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-2xl border border-cyan-400/30 bg-slate-900/65 p-7">
          <h2 className="text-lg font-semibold text-cyan-100">Workflow</h2>
          <ol className="mt-3 space-y-3">
            {workflow.map((step, index) => (
              <li key={step} className="text-sm leading-relaxed text-slate-300">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/60 text-xs text-cyan-100">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-lg border border-cyan-300/30 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
              Suggested endpoint
            </p>
            <code className="mt-2 block text-sm text-cyan-100">{endpoint}</code>
          </div>

          <ApiResponsePreview endpoint={endpoint} />

          <Link
            href="/"
            className="mt-6 inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
          >
            Back to map
          </Link>
        </aside>
      </section>
    </main>
  );
}
