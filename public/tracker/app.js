(() => {
  const TZ = window.OUTREACH_WEEK.tz;
  const SLOTS = window.OUTREACH_SLOTS;
  const STORE_KEY = "verdansc-outreach-tracker-v1";
  const CHANNEL_LABEL = {
    facebook_group: "FB group",
    facebook_dm: "FB DM",
    facebook_first_comment: "FB comment",
    facebook_reply_window: "FB reply",
    craigslist: "Craigslist",
    email: "Email",
  };

  const el = {
    views: {
      home: document.getElementById("view-home"),
      week: document.getElementById("view-week"),
    },
    nav: {
      home: document.getElementById("nav-home"),
      week: document.getElementById("nav-week"),
    },
    clockDate: document.getElementById("clock-date"),
    clockSub: document.getElementById("clock-sub"),
    remainToday: document.getElementById("remain-today"),
    remainWeek: document.getElementById("remain-week"),
    nextCard: document.getElementById("next-card"),
    todayList: document.getElementById("today-list"),
    weekList: document.getElementById("week-list"),
    toast: document.getElementById("toast"),
    install: document.getElementById("install-hint"),
    countdownCard: document.getElementById("countdown-card"),
    countdownKicker: document.getElementById("countdown-kicker"),
    countdownTime: document.getElementById("countdown-time"),
    countdownSub: document.getElementById("countdown-sub"),
  };

  let toastTimer = 0;
  let lastListKey = "";
  let lastCountKey = "";

  function loadMarks() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveMarks(marks) {
    localStorage.setItem(STORE_KEY, JSON.stringify(marks));
  }

  function denverParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "long",
      hourCycle: "h23",
    }).formatToParts(date);
    const g = Object.fromEntries(
      parts.filter((p) => p.type !== "literal").map((p) => [p.type, p.value])
    );
    const hour = Number(g.hour) % 24;
    const minute = Number(g.minute);
    return {
      date: `${g.year}-${g.month}-${g.day}`,
      time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      minutes: hour * 60 + minute,
      weekday: g.weekday,
      pretty: `${g.weekday}, ${prettyMonth(g.month)} ${Number(g.day)}`,
    };
  }

  function tzOffsetMs(date) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const g = Object.fromEntries(
      parts.filter((p) => p.type !== "literal").map((p) => [p.type, p.value])
    );
    const asUtc = Date.UTC(
      Number(g.year),
      Number(g.month) - 1,
      Number(g.day),
      Number(g.hour) % 24,
      Number(g.minute),
      Number(g.second)
    );
    return asUtc - date.getTime();
  }

  function wallTimeMs(isoDate, hhmm) {
    const [year, month, day] = isoDate.split("-").map(Number);
    const [hour, minute] = hhmm.split(":").map(Number);
    const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
    const instant = utcGuess - tzOffsetMs(new Date(utcGuess));
    return utcGuess - tzOffsetMs(new Date(instant));
  }

  function prettyMonth(mm) {
    return [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ][Number(mm) - 1];
  }

  function prettyDate(iso) {
    const [y, m, d] = iso.split("-");
    const dt = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 18));
    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      weekday: "short",
    }).format(dt);
    return `${weekday} ${prettyMonth(m)} ${Number(d)}`;
  }

  function prettyTime(hhmm) {
    const [h, min] = hhmm.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hr = ((h + 11) % 12) + 1;
    return `${hr}:${String(min).padStart(2, "0")} ${suffix}`;
  }

  function minutesOf(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  function formatHMS(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function statusOf(slot, marks) {
    if (slot.blocked || slot.channel === "email") return "blocked";
    return marks[slot.id]?.status || "queued";
  }

  function isActionable(slot) {
    return !slot.blocked && slot.channel !== "email";
  }

  function channelClass(channel) {
    if (channel === "email") return "email";
    if (channel === "craigslist") return "cl";
    return "fb";
  }

  function queuedActionable(list, marks) {
    return list.filter((s) => isActionable(s) && statusOf(s, marks) === "queued");
  }

  function widgetDay(parts) {
    if (SLOTS.some((s) => s.date === parts.date)) return parts.date;
    if (parts.date < window.OUTREACH_WEEK.start) return window.OUTREACH_WEEK.start;
    return window.OUTREACH_WEEK.end;
  }

  function dueNowId(parts, marks) {
    if (parts.date < window.OUTREACH_WEEK.start) return null;
    const day = widgetDay(parts);
    if (day !== parts.date) return null;
    const open = queuedActionable(SLOTS.filter((s) => s.date === day), marks);
    if (!open.length) return null;
    const current = [...open].reverse().find((s) => minutesOf(s.time) <= parts.minutes);
    return current ? current.id : null;
  }

  function nextDue(parts, marks) {
    const dueId = dueNowId(parts, marks);
    if (dueId) return SLOTS.find((s) => s.id === dueId);
    return (
      SLOTS.find((s) => {
        if (!isActionable(s) || statusOf(s, marks) !== "queued") return false;
        return s.date > parts.date || (s.date === parts.date && minutesOf(s.time) >= parts.minutes);
      }) || queuedActionable(SLOTS, marks)[0]
    );
  }

  function countdownSlot(_parts, marks) {
    // First remaining sendable slot across the week: today 7:00 AM MT
    // while still before that window, otherwise the next unfinished slot.
    return queuedActionable(SLOTS, marks)[0] || null;
  }

  function remaining(list, marks) {
    return queuedActionable(list, marks).length;
  }

  function toast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("is-on"), 3200);
  }

  function flashCount(node, value) {
    const next = String(value);
    if (node.textContent === next) return;
    node.textContent = next;
    node.classList.remove("is-flash");
    void node.offsetWidth;
    node.classList.add("is-flash");
  }

  function setStatus(id, status) {
    const slot = SLOTS.find((s) => s.id === id);
    if (!slot || !isActionable(slot)) return;
    const marks = loadMarks();
    if (marks[id]?.status && marks[id].status !== "queued") return;
    marks[id] = { status, at: new Date().toISOString() };
    saveMarks(marks);
    if (status === "done") {
      toast(`${id} complete · ${CHANNEL_LABEL[slot.channel]} · ${prettyTime(slot.time)} MT`);
    } else {
      toast(`${id} skipped`);
    }
    render({ forceLists: true });
  }

  function slotCard(slot, marks, dueId) {
    const status = statusOf(slot, marks);
    const due = slot.id === dueId;
    const article = document.createElement("article");
    article.className = `slot is-${status}${due ? " is-due" : ""}`;
    article.dataset.id = slot.id;

    const badges = [
      `<span class="badge ${channelClass(slot.channel)}">${CHANNEL_LABEL[slot.channel]}</span>`,
      `<span class="badge ${status}">${status}</span>`,
    ];
    if (due) badges.push(`<span class="badge due">due now</span>`);

    article.innerHTML = `
      <div class="slot-top">
        <span class="slot-id">${slot.id} · ${prettyTime(slot.time)} MT</span>
        <div class="badges">${badges.join("")}</div>
      </div>
      <h3 style="margin:0.45rem 0 0;font-size:1rem">${slot.title}</h3>
      <p>${slot.detail}</p>
    `;

    if (status === "blocked") {
      const note = document.createElement("div");
      note.className = "blocked-note";
      note.textContent =
        "Blocked. No scrape and no CAN-SPAM address/unsub — cannot mark sent.";
      article.appendChild(note);
      return article;
    }

    const actions = document.createElement("div");
    actions.className = "actions";
    const done = document.createElement("button");
    done.className = "done-btn";
    done.type = "button";
    done.dataset.act = "done";
    done.dataset.id = slot.id;
    done.textContent = status === "done" ? "Completed" : "Mark complete";
    done.disabled = status !== "queued";
    const skip = document.createElement("button");
    skip.type = "button";
    skip.dataset.act = "skipped";
    skip.dataset.id = slot.id;
    skip.textContent = status === "skipped" ? "Skipped" : "Skip";
    skip.disabled = status !== "queued";
    actions.append(done, skip);
    article.appendChild(actions);
    return article;
  }

  function paintCountdown(now, parts, marks) {
    const slot = countdownSlot(parts, marks);
    const weekLeft = remaining(SLOTS, marks);

    if (!slot) {
      el.countdownCard.className = "countdown-card is-done";
      el.countdownKicker.textContent = weekLeft ? "Window complete" : "Week clear";
      el.countdownTime.textContent = weekLeft ? "Done for today" : "All clear";
      el.countdownSub.textContent = weekLeft
        ? "No remaining Facebook or Craigslist slots today."
        : "No remaining Facebook or Craigslist slots.";
      return;
    }

    const start = wallTimeMs(slot.date, slot.time);
    const delta = start - now.getTime();
    const label = `${prettyDate(slot.date)} · ${prettyTime(slot.time)} MT · ${CHANNEL_LABEL[slot.channel]}`;

    if (delta <= 0) {
      el.countdownCard.className = "countdown-card is-live";
      el.countdownKicker.textContent = "Due now";
      el.countdownTime.textContent = prettyTime(slot.time);
      el.countdownSub.textContent = `${CHANNEL_LABEL[slot.channel]} · ${slot.title}`;
      return;
    }

    el.countdownCard.className = "countdown-card";
    el.countdownKicker.textContent = "Starts in";
    el.countdownTime.textContent = formatHMS(delta);
    el.countdownSub.textContent = label;
  }

  function paintChrome(now, parts, marks, dueId) {
    const day = widgetDay(parts);
    const todays = SLOTS.filter((s) => s.date === day);
    const next = nextDue(parts, marks);
    const showingOtherDay = day !== parts.date;
    const todayLeft = remaining(todays, marks);
    const weekLeft = remaining(SLOTS, marks);

    el.clockDate.textContent = parts.pretty;
    el.clockSub.textContent = showingOtherDay
      ? `${parts.time} America/Denver · showing ${prettyDate(day)} slots`
      : `${parts.time} America/Denver · 7:00–10:00 window`;

    const countKey = `${todayLeft}|${weekLeft}`;
    if (countKey !== lastCountKey) {
      flashCount(el.remainToday, todayLeft);
      flashCount(el.remainWeek, weekLeft);
      lastCountKey = countKey;
    } else {
      el.remainToday.textContent = String(todayLeft);
      el.remainWeek.textContent = String(weekLeft);
    }

    if (next) {
      const nextIsDue = next.id === dueId;
      el.nextCard.className = `next-card${nextIsDue ? " is-due" : ""}`;
      el.nextCard.innerHTML = `
        <p class="kicker">${nextIsDue ? "Due now" : "Next due"}</p>
        <h2>${prettyDate(next.date)} · ${prettyTime(next.time)} MT</h2>
        <p>${CHANNEL_LABEL[next.channel]} · ${next.title}</p>
      `;
    } else {
      el.nextCard.className = "next-card";
      el.nextCard.innerHTML = `<p class="kicker">Next due</p><h2>Week clear</h2><p>No remaining Facebook or Craigslist slots.</p>`;
    }

    paintCountdown(now, parts, marks);
  }

  function paintHomeList(parts, marks, dueId) {
    const day = widgetDay(parts);
    const todays = SLOTS.filter((s) => s.date === day);
    const visible = todays.filter((s) => {
      const status = statusOf(s, marks);
      return status === "queued" || status === "blocked";
    });
    el.todayList.replaceChildren(...visible.map((s) => slotCard(s, marks, dueId)));
  }

  function paintWeek(parts, marks, dueId) {
    const openDates = new Set(
      [...el.weekList.querySelectorAll(".day.is-open")].map((node) => node.dataset.date)
    );
    const dates = [...new Set(SLOTS.map((s) => s.date))];
    const widget = widgetDay(parts);
    el.weekList.replaceChildren(
      ...dates.map((date) => {
        const daySlots = SLOTS.filter((s) => s.date === date);
        const open = remaining(daySlots, marks);
        const section = document.createElement("section");
        const isToday = date === parts.date || date === widget;
        const stayOpen = openDates.size ? openDates.has(date) : isToday;
        section.className = `day${stayOpen ? " is-open" : ""}`;
        section.dataset.date = date;
        const head = document.createElement("button");
        head.type = "button";
        head.className = "day-head";
        head.innerHTML = `<h2>${prettyDate(date)}</h2><small>${open} left · 5 slots</small>`;
        head.addEventListener("click", () => section.classList.toggle("is-open"));
        const body = document.createElement("div");
        body.className = "day-body";
        body.append(...daySlots.map((s) => slotCard(s, marks, dueId)));
        section.append(head, body);
        return section;
      })
    );
  }

  function route() {
    const week = location.hash === "#/week";
    el.views.home.classList.toggle("hidden", week);
    el.views.week.classList.toggle("hidden", !week);
    el.nav.home.classList.toggle("is-on", !week);
    el.nav.week.classList.toggle("is-on", week);
  }

  function render(opts = {}) {
    const now = new Date();
    const parts = denverParts(now);
    const marks = loadMarks();
    const dueId = dueNowId(parts, marks);
    const day = widgetDay(parts);
    const listKey = `${day}|${dueId || ""}|${JSON.stringify(marks)}`;
    paintChrome(now, parts, marks, dueId);
    if (opts.forceLists || listKey !== lastListKey) {
      lastListKey = listKey;
      paintHomeList(parts, marks, dueId);
      paintWeek(parts, marks, dueId);
    }
    route();
  }

  function onActionClick(event) {
    const btn = event.target.closest("button[data-act]");
    if (!btn || btn.disabled) return;
    event.preventDefault();
    setStatus(btn.dataset.id, btn.dataset.act);
  }

  el.todayList.addEventListener("click", onActionClick);
  el.weekList.addEventListener("click", onActionClick);

  el.nav.home.addEventListener("click", () => {
    location.hash = "#/";
    window.scrollTo(0, 0);
  });
  el.nav.week.addEventListener("click", () => {
    location.hash = "#/week";
    window.scrollTo(0, 0);
  });
  window.addEventListener("hashchange", () => {
    route();
    window.scrollTo(0, 0);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") render({ forceLists: true });
  });

  if (window.matchMedia("(display-mode: standalone)").matches) {
    el.install.classList.add("hidden");
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/tracker/sw.js");
  }

  render({ forceLists: true });
  setInterval(render, 1000);
})();
