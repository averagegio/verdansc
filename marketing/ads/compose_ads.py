#!/usr/bin/env python3
"""Compose Verdansc static ads and video storyboard frames from original photos + live UI captures."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path("/workspace/marketing/ads")
SRC = ROOT / "source"
UI = ROOT / "ui-captures"
FRAMES = ROOT / "frames"
EXPORTS = ROOT / "exports"

NAVY = (2, 6, 13, 255)
NAVY_SOFT = (7, 21, 38, 230)
SLATE = (15, 23, 42, 220)
CYAN = (34, 211, 238, 255)
CYAN_DIM = (103, 232, 249, 255)
TEAL = (20, 184, 166, 255)
INK = (240, 249, 255, 255)
MUTED = (147, 197, 253, 255)
EMERALD = (167, 243, 208, 255)
EMERALD_BG = (6, 78, 59, 230)
WHITE = (255, 255, 255, 255)

INTER = "/usr/share/fonts/truetype/macos/Inter-Regular.ttf"
INTER_MD = "/usr/share/fonts/truetype/macos/Inter-Medium.ttf"
INTER_SB = "/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf"
INTER_BD = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def cover(im: Image.Image, w: int, h: int) -> Image.Image:
    return ImageOps.fit(im.convert("RGB"), (w, h), method=Image.Resampling.LANCZOS)


def round_rect_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def rounded(im: Image.Image, radius: int) -> Image.Image:
    im = im.convert("RGBA")
    mask = round_rect_mask(im.size, radius)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


def phone_frame(ui: Image.Image, w: int = 390, h: int = 780) -> Image.Image:
    """Dark navy phone chrome around a UI screenshot."""
    bezel = 16
    radius = 48
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=(8, 14, 24, 255))
    d.rounded_rectangle((3, 3, w - 4, h - 4), radius=radius - 3, fill=(2, 6, 13, 255), outline=CYAN[:3], width=2)
    inner_w, inner_h = w - bezel * 2, h - bezel * 2 - 8
    screen = cover(ui, inner_w, inner_h).convert("RGBA")
    screen = rounded(screen, 32)
    canvas.paste(screen, (bezel, bezel + 4), screen)
    # notch
    d.rounded_rectangle((w // 2 - 48, 10, w // 2 + 48, 22), radius=8, fill=(15, 23, 42, 255))
    return canvas


def laptop_frame(ui: Image.Image, w: int = 760, h: int = 480) -> Image.Image:
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    d.rounded_rectangle((0, 0, w - 1, h - 28), radius=18, fill=(8, 14, 24, 255), outline=CYAN[:3], width=2)
    screen = cover(ui, w - 18, h - 48).convert("RGBA")
    screen = rounded(screen, 10)
    canvas.paste(screen, (9, 9), screen)
    d.rounded_rectangle((40, h - 26, w - 40, h - 4), radius=6, fill=(15, 23, 42, 255), outline=(34, 211, 238, 120), width=1)
    return canvas


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def draw_centered(draw: ImageDraw.ImageDraw, text: str, cx: int, y: int, fnt: ImageFont.FreeTypeFont, fill) -> int:
    w, h = text_size(draw, text, fnt)
    draw.text((cx - w // 2, y), text, font=fnt, fill=fill)
    return h


def wordmark(draw: ImageDraw.ImageDraw, text: str, cx: int, y: int, size: int, fill=INK, stroke=CYAN) -> int:
    fnt = font(INTER_BD, size)
    w, h = text_size(draw, text, fnt)
    x = cx - w // 2
    draw.text((x, y), text, font=fnt, fill=fill, stroke_width=max(1, size // 28), stroke_fill=stroke[:3])
    return h


def label_pill(base: Image.Image, text: str, xy: tuple[int, int], color=CYAN) -> None:
    d = ImageDraw.Draw(base)
    fnt = font(INTER_SB, 22)
    tw, th = text_size(d, text, fnt)
    pad_x, pad_y = 16, 8
    x, y = xy
    d.rounded_rectangle(
        (x, y, x + tw + pad_x * 2, y + th + pad_y * 2),
        radius=14,
        fill=NAVY_SOFT,
        outline=color[:3],
        width=2,
    )
    d.text((x + pad_x, y + pad_y - 2), text, font=fnt, fill=color)


def caption_bar(base: Image.Image, text: str, y: int, width: int, x: int = 0) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    fnt = font(INTER_MD, 28)
    tw, th = text_size(d, text, fnt)
    pad = 14
    box = (x + 24, y, x + width - 24, y + th + pad * 2)
    d.rounded_rectangle(box, radius=16, fill=(2, 6, 13, 200), outline=(34, 211, 238, 140), width=1)
    d.text((x + (width - tw) // 2, y + pad - 2), text, font=fnt, fill=INK)
    base.alpha_composite(overlay)


def notification_card(
    title: str,
    body: str,
    accent=EMERALD,
    bg=EMERALD_BG,
    w: int = 520,
) -> Image.Image:
    f_title = font(INTER_BD, 28)
    f_body = font(INTER_MD, 20)
    f_brand = font(INTER_SB, 14)
    dummy = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    _, th = text_size(dummy, title, f_title)
    lines = wrap(body, f_body, w - 48, dummy)
    line_h = text_size(dummy, "Ag", f_body)[1] + 6
    h = 36 + th + 12 + line_h * len(lines) + 28
    card = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(card)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=22, fill=bg, outline=accent[:3], width=2)
    d.ellipse((18, 20, 38, 40), fill=accent[:3])
    d.text((48, 18), "VERDANSC", font=f_brand, fill=accent)
    d.text((18, 44), title, font=f_title, fill=INK)
    yy = 44 + th + 10
    for line in lines:
        d.text((18, yy), line, font=f_body, fill=INK)
        yy += line_h
    return card


def wrap(text: str, fnt: ImageFont.FreeTypeFont, max_w: int, draw: ImageDraw.ImageDraw) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if text_size(draw, trial, fnt)[0] <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines or [text]


def split_canvas(w: int = 1920, h: int = 1080) -> Image.Image:
    bg = Image.new("RGBA", (w, h), NAVY)
    # subtle radial cyan glow
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for i, alpha in enumerate((40, 24, 12)):
        r = 280 + i * 90
        gd.ellipse((w // 4 - r, h // 2 - r, w // 4 + r, h // 2 + r), fill=(34, 211, 238, alpha))
        gd.ellipse((3 * w // 4 - r, h // 2 - r, 3 * w // 4 + r, h // 2 + r), fill=(20, 184, 166, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    bg.alpha_composite(glow)
    d = ImageDraw.Draw(bg)
    d.line((w // 2, 86, w // 2, h - 28), fill=CYAN[:3], width=3)
    return bg


def header(base: Image.Image, kicker: str) -> None:
    d = ImageDraw.Draw(base)
    wordmark(d, "VERDANSC", base.width // 2, 18, 42)
    draw_centered(d, kicker, base.width // 2, 64, font(INTER_MD, 16), MUTED)


def compose_split_beat(
    left_photo: Image.Image,
    right_photo: Image.Image,
    left_ui: Image.Image | None,
    right_ui: Image.Image | None,
    left_caption: str,
    right_caption: str,
    kicker: str,
    left_device: str = "phone",
    right_device: str = "phone",
    left_note: Image.Image | None = None,
    right_note: Image.Image | None = None,
    size: tuple[int, int] = (1920, 1080),
) -> Image.Image:
    w, h = size
    canvas = split_canvas(w, h)
    header(canvas, kicker)
    col_w = w // 2
    photo_top = 92
    photo_h = h - photo_top - 18
    left = cover(left_photo, col_w - 40, photo_h)
    right = cover(right_photo, col_w - 40, photo_h)
    left = rounded(left, 22)
    right = rounded(right, 22)
    # darken lower third for captions
    shade = Image.new("RGBA", left.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    for i in range(180):
        alpha = int(170 * (i / 180))
        y = shade.height - 180 + i
        sd.line((0, y, shade.width, y), fill=(2, 6, 13, alpha))
    left.alpha_composite(shade)
    right.alpha_composite(shade)

    canvas.paste(left, (20, photo_top), left)
    canvas.paste(right, (col_w + 20, photo_top), right)

    label_pill(canvas, "TENANT", (36, 104))
    label_pill(canvas, "LANDLORD", (col_w + 36, 104), color=TEAL)

    if left_ui is not None:
        device = phone_frame(left_ui, 300, 600) if left_device == "phone" else laptop_frame(left_ui, 520, 330)
        device = device.resize((int(device.width * 0.92), int(device.height * 0.92)), Image.Resampling.LANCZOS)
        dx = 20 + (col_w - 40 - device.width) // 2
        dy = photo_top + 78
        shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        sh = Image.new("RGBA", device.size, (0, 0, 0, 140))
        shadow.paste(sh, (dx + 10, dy + 14), device.split()[-1] if device.mode == "RGBA" else None)
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        canvas.alpha_composite(shadow)
        canvas.paste(device, (dx, dy), device)

    if right_ui is not None:
        device = phone_frame(right_ui, 300, 600) if right_device == "phone" else laptop_frame(right_ui, 520, 330)
        device = device.resize((int(device.width * 0.92), int(device.height * 0.92)), Image.Resampling.LANCZOS)
        dx = col_w + 20 + (col_w - 40 - device.width) // 2
        dy = photo_top + 78
        canvas.paste(device, (dx, dy), device)

    if left_note is not None:
        nx = 48
        ny = h - left_note.height - 92
        canvas.paste(left_note, (nx, ny), left_note)
    if right_note is not None:
        nx = col_w + 48
        ny = h - right_note.height - 92
        canvas.paste(right_note, (nx, ny), right_note)

    caption_bar(canvas, left_caption, h - 78, col_w, 0)
    caption_bar(canvas, right_caption, h - 78, col_w, col_w)
    return canvas


def compose_vertical_beat(
    top_photo: Image.Image,
    bottom_photo: Image.Image,
    top_ui: Image.Image | None,
    bottom_ui: Image.Image | None,
    top_caption: str,
    bottom_caption: str,
    kicker: str,
    top_note: Image.Image | None = None,
    bottom_note: Image.Image | None = None,
) -> Image.Image:
    w, h = 1080, 1920
    canvas = Image.new("RGBA", (w, h), NAVY)
    d = ImageDraw.Draw(canvas)
    wordmark(d, "VERDANSC", w // 2, 24, 48)
    draw_centered(d, kicker, w // 2, 82, font(INTER_MD, 18), MUTED)
    mid = 980
    d.line((40, mid, w - 40, mid), fill=CYAN[:3], width=3)

    top = rounded(cover(top_photo, w - 48, 820), 22)
    bot = rounded(cover(bottom_photo, w - 48, 820), 22)
    canvas.paste(top, (24, 118), top)
    canvas.paste(bot, (24, mid + 16), bot)
    label_pill(canvas, "TENANT", (40, 136))
    label_pill(canvas, "LANDLORD", (40, mid + 34), color=TEAL)

    if top_ui is not None:
        phone = phone_frame(top_ui, 280, 560)
        canvas.paste(phone, (w - phone.width - 48, 180), phone)
    if bottom_ui is not None:
        phone = phone_frame(bottom_ui, 280, 560)
        canvas.paste(phone, (w - phone.width - 48, mid + 70), phone)
    if top_note is not None:
        canvas.paste(top_note, (40, 720), top_note)
    if bottom_note is not None:
        canvas.paste(bottom_note, (40, h - bottom_note.height - 110), bottom_note)

    caption_bar(canvas, top_caption, mid - 70, w, 0)
    caption_bar(canvas, bottom_caption, h - 70, w, 0)
    return canvas


def endcard_16x9(city: Image.Image) -> Image.Image:
    w, h = 1920, 1080
    bg = cover(city, w, h).convert("RGBA")
    veil = Image.new("RGBA", (w, h), (2, 6, 13, 150))
    bg.alpha_composite(veil)
    d = ImageDraw.Draw(bg)
    wordmark(d, "VERDANSC", w // 2, 280, 92)
    draw_centered(d, "Find a home. Fill a home.", w // 2, 400, font(INTER_SB, 42), INK)
    draw_centered(
        d,
        "Search rentals. Run a credit check. Apply. Intake a listing.",
        w // 2,
        470,
        font(INTER_MD, 26),
        MUTED,
    )
    # CTA pill
    cta = "Start at verdansc.com/listings"
    fnt = font(INTER_BD, 28)
    tw, th = text_size(d, cta, fnt)
    bx1, by1 = w // 2 - tw // 2 - 28, 560
    bx2, by2 = w // 2 + tw // 2 + 28, 560 + th + 28
    d.rounded_rectangle((bx1, by1, bx2, by2), radius=18, fill=(34, 211, 238, 40), outline=CYAN[:3], width=2)
    d.text((w // 2 - tw // 2, 572), cta, font=fnt, fill=INK)
    draw_centered(d, "Landlords: verdansc.com/rental-application", w // 2, 660, font(INTER_MD, 22), CYAN_DIM)
    draw_centered(d, "Credit check: verdansc.com/credit-check", w // 2, 700, font(INTER_MD, 22), CYAN_DIM)
    return bg


def endcard_9x16(city: Image.Image) -> Image.Image:
    w, h = 1080, 1920
    bg = cover(city, w, h).convert("RGBA")
    veil = Image.new("RGBA", (w, h), (2, 6, 13, 160))
    bg.alpha_composite(veil)
    d = ImageDraw.Draw(bg)
    wordmark(d, "VERDANSC", w // 2, 620, 86)
    draw_centered(d, "Find a home. Fill a home.", w // 2, 740, font(INTER_SB, 36), INK)
    draw_centered(d, "Search. Screen. Apply. Intake.", w // 2, 800, font(INTER_MD, 24), MUTED)
    cta = "verdansc.com/listings"
    fnt = font(INTER_BD, 28)
    tw, th = text_size(d, cta, fnt)
    d.rounded_rectangle(
        (w // 2 - tw // 2 - 28, 880, w // 2 + tw // 2 + 28, 880 + th + 28),
        radius=18,
        fill=(34, 211, 238, 40),
        outline=CYAN[:3],
        width=2,
    )
    d.text((w // 2 - tw // 2, 892), cta, font=fnt, fill=INK)
    draw_centered(d, "Landlords: /rental-application", w // 2, 980, font(INTER_MD, 22), CYAN_DIM)
    draw_centered(d, "Credit check: /credit-check", w // 2, 1020, font(INTER_MD, 22), CYAN_DIM)
    return bg


def static_feed_ad(base_photo: Image.Image, listings_ui: Image.Image) -> Image.Image:
    """4:5 Instagram/Facebook feed still."""
    w, h = 1080, 1350
    canvas = Image.new("RGBA", (w, h), NAVY)
    photo = rounded(cover(base_photo, w - 48, 820), 28)
    canvas.paste(photo, (24, 150), photo)

    # UI phone overlay on the tenant side-ish
    phone = phone_frame(listings_ui, 250, 500)
    canvas.paste(phone, (w - phone.width - 48, 210), phone)

    d = ImageDraw.Draw(canvas)
    wordmark(d, "VERDANSC", w // 2, 28, 54)
    draw_centered(d, "Find a home. Fill a home.", w // 2, 96, font(INTER_SB, 28), MUTED)

    label_pill(canvas, "TENANT", (48, 176))
    label_pill(canvas, "LANDLORD", (48, 176 + 48), color=TEAL)

    # bottom copy
    d.rounded_rectangle((24, 990, w - 24, h - 24), radius=24, fill=(7, 21, 38, 235), outline=CYAN[:3], width=2)
    draw_centered(d, "Search. Credit check. Apply.", w // 2, 1018, font(INTER_BD, 32), INK)
    draw_centered(d, "Photograph. Upload. Get a tenant.", w // 2, 1062, font(INTER_BD, 28), CYAN_DIM)
    draw_centered(d, "Maya searches Harborline Flats. Jordan lists it.", w // 2, 1110, font(INTER_MD, 20), MUTED)
    cta = "verdansc.com/listings"
    fnt = font(INTER_BD, 26)
    tw, th = text_size(d, cta, fnt)
    d.rounded_rectangle(
        (w // 2 - tw // 2 - 24, 1160, w // 2 + tw // 2 + 24, 1160 + th + 22),
        radius=16,
        fill=(34, 211, 238, 45),
        outline=CYAN[:3],
        width=2,
    )
    d.text((w // 2 - tw // 2, 1170), cta, font=fnt, fill=INK)
    draw_centered(d, "Landlords start at verdansc.com/rental-application", w // 2, 1238, font(INTER_MD, 18), MUTED)
    return canvas


def static_square_ad(base_photo: Image.Image) -> Image.Image:
    w = h = 1080
    canvas = Image.new("RGBA", (w, h), NAVY)
    photo = rounded(cover(base_photo, w - 40, 720), 24)
    canvas.paste(photo, (20, 140), photo)
    d = ImageDraw.Draw(canvas)
    wordmark(d, "VERDANSC", w // 2, 24, 50)
    draw_centered(d, "Tenant + landlord, same map.", w // 2, 92, font(INTER_MD, 22), MUTED)
    d.rounded_rectangle((20, 880, w - 20, h - 20), radius=22, fill=(7, 21, 38, 240), outline=CYAN[:3], width=2)
    draw_centered(d, "You got a tenant. Application accepted.", w // 2, 910, font(INTER_BD, 26), INK)
    draw_centered(d, "Start at verdansc.com/listings", w // 2, 960, font(INTER_SB, 24), CYAN_DIM)
    draw_centered(d, "Credit check $19  ·  Intake on /rental-application", w // 2, 1004, font(INTER_MD, 18), MUTED)
    return canvas


def static_wide_ad(left: Image.Image, right: Image.Image, listings_ui: Image.Image) -> Image.Image:
    w, h = 1920, 1080
    canvas = split_canvas(w, h)
    header(canvas, "Intelligent real estate services")
    left_p = rounded(cover(left, 900, 860), 22)
    right_p = rounded(cover(right, 900, 860), 22)
    canvas.paste(left_p, (30, 100), left_p)
    canvas.paste(right_p, (990, 100), right_p)
    label_pill(canvas, "TENANT", (50, 120))
    label_pill(canvas, "LANDLORD", (1010, 120), color=TEAL)
    phone = phone_frame(listings_ui, 280, 560)
    canvas.paste(phone, (330, 240), phone)
    d = ImageDraw.Draw(canvas)
    d.rounded_rectangle((40, 900, 1880, 1050), radius=20, fill=(2, 6, 13, 210), outline=CYAN[:3], width=2)
    draw_centered(d, "Find a home. Fill a home.  ·  verdansc.com/listings", w // 2, 930, font(INTER_BD, 36), INK)
    draw_centered(
        d,
        "Search rentals  →  credit check  →  apply   |   Photograph a property  →  upload to intake",
        w // 2,
        986,
        font(INTER_MD, 24),
        MUTED,
    )
    return canvas


def save_rgb(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(path, quality=92, optimize=True)


def main() -> None:
    FRAMES.mkdir(parents=True, exist_ok=True)
    (FRAMES / "16x9").mkdir(exist_ok=True)
    (FRAMES / "9x16").mkdir(exist_ok=True)
    EXPORTS.mkdir(parents=True, exist_ok=True)

    tenant_search = Image.open(SRC / "tenant_search.jpg")
    tenant_credit = Image.open(SRC / "tenant_credit.jpg")
    tenant_apply = Image.open(SRC / "tenant_apply.jpg")
    landlord_photo = Image.open(SRC / "landlord_photo.jpg")
    landlord_upload = Image.open(SRC / "landlord_upload.jpg")
    landlord_camera = Image.open(SRC / "landlord_camera.jpg")
    notify_ll = Image.open(SRC / "notify_landlord.jpg")
    notify_tn = Image.open(SRC / "notify_tenant.jpg")
    static_base = Image.open(SRC / "static_ad_base.jpg")
    city = Image.open(SRC / "endcard_city.jpg")

    ui_listings = Image.open(UI / "03-listings.png")
    ui_listings_m = Image.open(UI / "10-listings-mobile.png")
    ui_credit = Image.open(UI / "04-credit-check.png")
    ui_credit_m = Image.open(UI / "11-credit-check-mobile.png")
    ui_apply = Image.open(UI / "08-rental-application.png")
    ui_apply_m = Image.open(UI / "12-apply-mobile.png")
    ui_intake = Image.open(UI / "07-landlord-intake.png")
    ui_intake_m = Image.open(UI / "13-intake-mobile.png")
    ui_success = Image.open(UI / "06-credit-check-success.png")

    note_ll = notification_card(
        "You got a tenant",
        "Maya Chen applied to Harborline Flats 2B. Paid application is in your review queue.",
        accent=CYAN,
        bg=(8, 47, 73, 235),
    )
    note_tn = notification_card(
        "Application accepted",
        "Harborline Flats 2B is yours to move toward. Credit check complete on Verdansc.",
    )

    beats = [
        dict(
            name="01-search-photo",
            left_photo=tenant_search,
            right_photo=landlord_photo,
            left_ui=ui_listings_m,
            right_ui=landlord_camera,
            left_device="phone",
            right_device="phone",
            left_caption="Search rentals on the listings feed",
            right_caption="Photograph the property for intake",
            kicker="Same day. Two sides of the map.",
            left_note=None,
            right_note=None,
        ),
        dict(
            name="02-credit-upload",
            left_photo=tenant_credit,
            right_photo=landlord_upload,
            left_ui=ui_credit_m,
            right_ui=ui_intake,
            left_device="phone",
            right_device="laptop",
            left_caption="Run a $19 soft credit check",
            right_caption="Upload the listing into applicant intake",
            kicker="Screen and list in the same product",
            left_note=None,
            right_note=None,
        ),
        dict(
            name="03-apply-intake",
            left_photo=tenant_apply,
            right_photo=landlord_upload,
            left_ui=ui_apply_m,
            right_ui=ui_intake_m,
            left_device="phone",
            right_device="phone",
            left_caption="Submit the rental application",
            right_caption="Harborline Flats 2B goes live for renters",
            kicker="Application and intake, linked",
            left_note=None,
            right_note=None,
        ),
        dict(
            name="04-notifications",
            left_photo=notify_tn,
            right_photo=notify_ll,
            left_ui=None,
            right_ui=None,
            left_device="phone",
            right_device="phone",
            left_caption="Application accepted  ·  credit check complete",
            right_caption="You got a tenant",
            kicker="The match lands in both inboxes",
            left_note=note_tn,
            right_note=note_ll,
        ),
    ]

    for beat in beats:
        frame = compose_split_beat(
            beat["left_photo"],
            beat["right_photo"],
            beat["left_ui"],
            beat["right_ui"],
            beat["left_caption"],
            beat["right_caption"],
            beat["kicker"],
            left_device=beat["left_device"],
            right_device=beat["right_device"],
            left_note=beat["left_note"],
            right_note=beat["right_note"],
        )
        save_rgb(frame, FRAMES / "16x9" / f"{beat['name']}.jpg")
        vframe = compose_vertical_beat(
            beat["left_photo"],
            beat["right_photo"],
            beat["left_ui"] if beat["left_device"] == "phone" else ui_listings_m,
            beat["right_ui"] if beat["right_device"] == "phone" else ui_intake_m,
            beat["left_caption"],
            beat["right_caption"],
            beat["kicker"],
            top_note=beat["left_note"],
            bottom_note=beat["right_note"],
        )
        save_rgb(vframe, FRAMES / "9x16" / f"{beat['name']}.jpg")

    save_rgb(endcard_16x9(city), FRAMES / "16x9" / "05-endcard.jpg")
    save_rgb(endcard_9x16(city), FRAMES / "9x16" / "05-endcard.jpg")

    feed = static_feed_ad(static_base, ui_listings_m)
    square = static_square_ad(static_base)
    wide = static_wide_ad(tenant_search, landlord_photo, ui_listings_m)
    save_rgb(feed, EXPORTS / "verdansc-split-ad-4x5.jpg")
    feed.convert("RGBA").save(EXPORTS / "verdansc-split-ad-4x5.png", optimize=True)
    feed.convert("RGB").save(EXPORTS / "verdansc-split-ad-4x5.webp", quality=90, method=6)
    save_rgb(square, EXPORTS / "verdansc-split-ad-1x1.jpg")
    square.convert("RGBA").save(EXPORTS / "verdansc-split-ad-1x1.png", optimize=True)
    square.convert("RGB").save(EXPORTS / "verdansc-split-ad-1x1.webp", quality=90, method=6)
    save_rgb(wide, EXPORTS / "verdansc-split-ad-16x9.jpg")
    wide.convert("RGBA").save(EXPORTS / "verdansc-split-ad-16x9.png", optimize=True)
    wide.convert("RGB").save(EXPORTS / "verdansc-split-ad-16x9.webp", quality=90, method=6)

    print("composed frames and stills")


if __name__ == "__main__":
    main()
