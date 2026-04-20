import Link from "next/link";
import ServiceTopBar from "./ServiceTopBar";

type ApiServicePageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  features: string[];
};

export default function ApiServicePage({
  eyebrow,
  title,
  summary,
  features,
}: ApiServicePageProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <ServiceTopBar />
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
          <h2 className="text-lg font-semibold text-cyan-100">
            Request this service
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Send your details and we will follow up with next available options.
          </p>
          <form className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="text"
                placeholder="First name"
              />
              <input
                className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
                type="text"
                placeholder="Last name"
              />
            </div>
            <input
              className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              type="email"
              placeholder="Email"
            />
            <input
              className="w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              type="text"
              placeholder="Property"
            />
            <textarea
              className="min-h-24 w-full rounded-md border border-cyan-300/40 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-300"
              placeholder="Tell us what you need"
            />
            <button
              type="button"
              className="inline-flex rounded-md border border-cyan-300/50 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-400/10"
            >
              Submit request
            </button>
          </form>
          <Link
            href="/login"
            className="mt-3 inline-flex text-sm text-cyan-200 underline decoration-cyan-400/70 underline-offset-2"
          >
            Returning user? Login
          </Link>

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
