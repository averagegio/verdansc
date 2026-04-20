import Link from "next/link";

type ServiceTopBarProps = {
  supportEmail?: string;
  middleLinkHref?: string;
  middleLinkLabel?: string;
};

export default function ServiceTopBar({
  supportEmail = "support@verdansc.com",
  middleLinkHref,
  middleLinkLabel,
}: ServiceTopBarProps) {
  return (
    <div className="mx-auto mb-4 flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-400/30 bg-slate-900/75 px-3 py-2 text-sm text-slate-100 sm:px-4">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-md border border-cyan-300/40 px-3 py-1 text-cyan-100 hover:bg-cyan-400/10"
        >
          Back to map
        </Link>
        {middleLinkHref && middleLinkLabel ? (
          <Link
            href={middleLinkHref}
            className="inline-flex min-h-11 items-center rounded-md border border-cyan-300/40 px-3 py-1 text-cyan-100 hover:bg-cyan-400/10"
          >
            {middleLinkLabel}
          </Link>
        ) : null}
      </div>
      <a
        href={`mailto:${supportEmail}`}
        className="inline-flex min-h-11 items-center text-cyan-200 underline decoration-cyan-400/70 underline-offset-2 hover:text-cyan-100"
      >
        Contact support
      </a>
    </div>
  );
}
