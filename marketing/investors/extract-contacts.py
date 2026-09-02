#!/usr/bin/env python3
"""Extract VC/angel contacts from the user-attached PDF into a gitignored JSON file.

Does not send email. Does not scrape Zillow, Facebook, or Redfin.
The output file must stay local (see .gitignore).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    print("Install pypdf: pip install pypdf", file=sys.stderr)
    sys.exit(1)

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
SKIP_EMAIL = re.compile(r"^(example|test|noreply|no-reply)@", re.I)

PROPTECH_HINTS = re.compile(
    r"\b(proptech|real\s*estate|housing|multifamily|apartment|rental|"
    r"propert(?:y|ies)|realty|residential|home\s*tech|construction|"
    r"building\s*ventures|metaprop|fifth\s*wall|camber\s*creek|"
    r"brick\s*(&|and)\s*mortar|livabl|opendoor|compass\s*ventures|"
    r"jll\s*spark|lennar|corigin|navitas)\b",
    re.I,
)
ANGEL_HINTS = re.compile(r"\bangel(\s+group|\s*\(individual\))?s?\b", re.I)
SEED_HINTS = re.compile(
    r"\b(pre-?seed|seed(\s+fund|\s+stage)?|500\s*startups|y\s*combinator|"
    r"first\s*round|initialized|sv\s*angel)\b",
    re.I,
)
LOCATION_STOP = re.compile(
    r"\b(SF|NYC|LA|CA|NY|TX|WA|MA|CO|IL|PA|FL|UK|USA|United\s+States|"
    r"California|New\s+York|San\s+Francisco|Palo\s+Alto|Menlo\s+Park|"
    r"Mountain\s+View|Boston|Seattle|Austin|Denver|Chicago|London|"
    r"Israel|Tel\s+Aviv)\b",
    re.I,
)
NAME_TOKEN = re.compile(r"^[A-Z][A-Za-z'.\-]+$")

THESIS = {
    "angel": "early marketplace and consumer infrastructure",
    "seed": "seed-stage marketplaces and local network effects",
    "proptech": "proptech and residential marketplaces",
    "generalist": "two-sided marketplaces and local software",
}


def classify(firm: str, context: str) -> str:
    blob = f"{firm} {context}"
    if PROPTECH_HINTS.search(blob):
        return "proptech"
    if ANGEL_HINTS.search(blob) and not SEED_HINTS.search(firm):
        return "angel"
    if SEED_HINTS.search(blob):
        return "seed"
    return "generalist"


def guess_first_name(before: str) -> str:
    tokens = re.findall(r"[A-Za-z][A-Za-z'.\-]*", before)
    if not tokens:
        return "there"
    # Prefer the first of the last two capitalized tokens (Given Family).
    caps = [t for t in tokens[-4:] if NAME_TOKEN.match(t)]
    if not caps:
        return tokens[-1].title()
    return caps[0]


def guess_firm(after: str) -> str:
    chunk = after.strip()
    chunk = EMAIL_RE.sub("", chunk)
    chunk = re.sub(r"https?://\S+", " ", chunk)
    chunk = re.sub(r"\s+", " ", chunk).strip(" ,;|-")
    stop = LOCATION_STOP.search(chunk)
    if stop and stop.start() > 2:
        chunk = chunk[: stop.start()]
    chunk = re.sub(r"\s+", " ", chunk).strip(" ,;|-")
    if not chunk or chunk.lower() in {"na", "n/a", "none"}:
        return "[FIRM]"
    # Keep a short firm label.
    parts = chunk.split(",")[0].strip()
    if len(parts) > 60:
        parts = parts[:57].rsplit(" ", 1)[0] + "…"
    return parts or "[FIRM]"


def extract(pdf_path: Path) -> list[dict]:
    reader = PdfReader(str(pdf_path))
    pages = [(p.extract_text() or "") for p in reader.pages]
    text = "\n".join(pages)
    # Collapse hard wraps a little so name/email/firm stay near each other.
    flat = re.sub(r"[ \t]+", " ", text)
    contacts: list[dict] = []
    seen: set[str] = set()
    for match in EMAIL_RE.finditer(flat):
        email = match.group(0).rstrip(".,;)")
        key = email.lower()
        if key in seen or SKIP_EMAIL.search(key):
            continue
        if "." not in email.split("@")[-1]:
            continue
        seen.add(key)
        start = max(0, match.start() - 90)
        end = min(len(flat), match.end() + 90)
        before = flat[start : match.start()]
        after = flat[match.end() : end]
        context = flat[start:end]
        firm = guess_firm(after)
        investor_type = classify(firm, context)
        contacts.append(
            {
                "first_name": guess_first_name(before),
                "firm": firm,
                "email": email,
                "type": investor_type,
                "thesis": THESIS[investor_type],
            }
        )
    return contacts


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--pdf",
        default="/home/ubuntu/.cursor/projects/workspace/uploads/master_list_of_vc_iykyk_23b8.pdf",
        help="Local PDF path (not committed)",
    )
    parser.add_argument(
        "--out",
        default="marketing/investors/contacts.extracted.json",
        help="Gitignored JSON output",
    )
    args = parser.parse_args()
    pdf = Path(args.pdf)
    if not pdf.is_file():
        print(f"PDF not found: {pdf}", file=sys.stderr)
        return 1
    contacts = extract(pdf)
    counts: dict[str, int] = {}
    for row in contacts:
        counts[row["type"]] = counts.get(row["type"], 0) + 1
    payload = {
        "source": "user-attached local PDF (do not commit this file or the PDF)",
        "extracted_at": date.today().isoformat(),
        "count": len(contacts),
        "type_counts": counts,
        "contacts": contacts,
    }
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(contacts)} contacts to {out} (gitignored). Type counts: {counts}")
    print("Did not send email. Did not scrape Zillow, Facebook, or Redfin.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
