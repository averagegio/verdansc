#!/usr/bin/env python3
"""Fill investor templates into local draft .eml / mailto files.

Reads the gitignored extract (or the committed fake sample).
Writes drafts next to --out. Does not send mail. Does not open SMTP.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from email.message import EmailMessage
from pathlib import Path

VARIANTS = ("angel", "seed", "proptech", "generalist")
TOKEN_KEYS = ("FIRST_NAME", "FIRM", "THESIS")
BODY_SPLIT = re.compile(r"^---\s*$", re.M)


def load_contacts(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    rows = data.get("contacts") or data
    if not isinstance(rows, list):
        raise SystemExit(f"No contacts array in {path}")
    return rows


def template_body(variant: str, repo: Path) -> tuple[str, str, str]:
    path = repo / "marketing/investors/templates" / f"{variant}.md"
    raw = path.read_text(encoding="utf-8")
    subject_a = ""
    subject_b = ""
    for line in raw.splitlines():
        if line.startswith("**Subject A:**"):
            subject_a = line.split(":**", 1)[1].strip()
        elif line.startswith("**Subject B:**"):
            subject_b = line.split(":**", 1)[1].strip()
    parts = BODY_SPLIT.split(raw, maxsplit=1)
    body = parts[1].strip() if len(parts) > 1 else raw
    return subject_a, subject_b, body


def fill(text: str, row: dict) -> str:
    out = text
    mapping = {
        "FIRST_NAME": row.get("first_name") or "there",
        "FIRM": row.get("firm") or "[FIRM]",
        "THESIS": row.get("thesis") or "[THESIS]",
    }
    for key, value in mapping.items():
        out = out.replace(f"[{key}]", str(value))
    return out


def word_count(body: str) -> int:
    return len(re.findall(r"\b[\w''-]+\b", body))


def mailto_url(to: str, subject: str, body: str) -> str:
    from urllib.parse import quote

    return (
        f"mailto:{quote(to, safe='@.+_-')}?subject={quote(subject)}"
        f"&body={quote(body)}"
    )


def write_eml(
    dest: Path,
    *,
    to: str,
    subject: str,
    body: str,
) -> None:
    msg = EmailMessage()
    msg["From"] = "founder@verdansc.com"
    msg["To"] = to
    msg["Subject"] = subject
    msg["X-Verdansc-Draft"] = "do-not-send-from-vm"
    msg.set_content(body)
    dest.write_bytes(msg.as_bytes())


def main() -> int:
    if any(a in {"--send", "--smtp", "--mail"} for a in sys.argv[1:]):
        print("Refusing to send. This script only writes local drafts.", file=sys.stderr)
        return 2
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--contacts",
        default="marketing/investors/sample-contacts.json",
        help="JSON with a contacts array. Default is the fake sample.",
    )
    parser.add_argument("--out", default="marketing/investors/drafts")
    parser.add_argument("--limit", type=int, default=6)
    parser.add_argument(
        "--type",
        dest="investor_type",
        choices=VARIANTS,
        help="Only this variant. Default: rotate through all four.",
    )
    parser.add_argument(
        "--subject",
        choices=("A", "B"),
        default="A",
        help="Which 1-line subject to use.",
    )
    args = parser.parse_args()

    repo = Path(".").resolve()
    contacts_path = Path(args.contacts)
    if not contacts_path.is_file():
        print(
            f"Contacts file missing: {contacts_path}\n"
            "Run extract-contacts.py locally, or pass --contacts "
            "marketing/investors/sample-contacts.json",
            file=sys.stderr,
        )
        return 1

    rows = load_contacts(contacts_path)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    mailto_lines: list[str] = []
    used = 0
    variant_cycle = list(VARIANTS)
    vi = 0

    for row in rows:
        if used >= args.limit:
            break
        variant = args.investor_type or row.get("type") or variant_cycle[vi % 4]
        if variant not in VARIANTS:
            variant = "generalist"
        if args.investor_type and row.get("type") != args.investor_type:
            continue
        sub_a, sub_b, body_tpl = template_body(variant, repo)
        subject_tpl = sub_a if args.subject == "A" else sub_b
        subject = fill(subject_tpl, row)
        body = fill(body_tpl, row)
        to = str(row.get("email") or "").strip()
        if not to or "@" not in to:
            continue
        used += 1
        vi += 1
        stem = f"{used:02d}-{variant}-{re.sub(r'[^a-z0-9]+', '-', (row.get('first_name') or 'x').lower())[:20]}"
        eml_path = out_dir / f"{stem}.eml"
        write_eml(eml_path, to=to, subject=subject, body=body)
        words = word_count(body)
        mailto_lines.append(
            f"# {variant} · {words} words · {eml_path.name}\n{mailto_url(to, subject, body)}\n"
        )
        print(f"{eml_path.name}: {variant} {words} words → {to} · {subject}")

    (out_dir / "mailto.txt").write_text("\n".join(mailto_lines) + "\n", encoding="utf-8")
    print(
        f"Wrote {used} drafts under {out_dir}. Attach "
        "marketing/ads/exports/verdansc-split-ad-4x5.jpg in Zoho. Nothing was sent."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
