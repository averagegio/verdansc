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
  };

  let toastTimer = 0;

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
      weekday: "long",
      hourCycle: "h23",
    }).formatToParts(date);
    const g = Object.fromEntries(
      parts.filter((p) => p.type !== "literal").map((p) => [p.type, p.value])
    );
    return {
      date: `${g.year}-${g.month}-${g.day}`,
      time: `${g.hour}:${g.minute}`,
      minutes: Number(g.hour) * 60 + Number(g.minute),
      weekday: g.weekday,
      pretty: `${g.weekday}, ${prettyMonth(g.month)} ${Number(g.day)}`,
    };
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

  function inMorningWindow(parts) {
    return parts.minutes >= minutesOf("07:00") && parts.minutes < minutesOf("10:00");
  }

  function dueNowId(parts, marks) {
    if (!inMorningWindow(parts)) return null;
    const todays = SLOTS.filter((s) => s.date === parts.date);
    const open = todays.filter((s) => statusOf(s, marks) === "queued" && isActionable(s));
    if (!open.length) return null;
    const current = [...open].reverse().find((s) => minutesOf(s.time) <= parts.minutes);
    return (current || open[0]).id;
  }

  function widgetDay(parts) {
    if (SLOTS.some((s) => s.date === parts.date)) return parts.date;
    if (parts.date < window.OUTREACH_WEEK.start) return window.OUTREACH_WEEK.start;
    return window.OUTREACH_WEEK.end;
  }

  function nextDue(parts, marks) {
    const dueId = dueNowId(parts, marks);
    if (dueId) return SLOTS.find((s) => s.id === dueId);
    return SLOTS.find((s) => {
      if (!isActionable(s) || statusOf(s, marks) !== "queued") return false;
      return s.date > parts.date || (s.date === parts.date && minutesOf(s.time) >= parts.minutes);
    }) || SLOTS.find((s) => isActionable(s) && statusOf(s, marks) === "queued");
  }

  function remaining(list, marks) {
    return list.filter((s) => isActionable(s) && statusOf(s, marks) === "queued").length;
  }

  function toast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("is-on"), 3200);
  }

  function setStatus(id, status) {
    const slot = SLOTS.find((s) => s.id === id);
    if (!slot || !isActionable(slot)) return;
    const marks = loadMarks();
    marks[id] = { status, at: new Date().toISOString() };
    saveMarks(marks);
    if (status === "done") {
      toast(`${id} complete · ${CHANNEL_LABEL[slot.channel]} · ${prettyTime(slot.time)} MT`);
    } else {
      toast(`${id} skipped`);
    }
    render();
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
    done.textContent = status === "done" ? "Completed" : "Mark complete";
    done.disabled = status !== "queued";
    done.addEventListener("click", () => setStatus(slot.id, "done"));
    const skip = document.createElement("button");
    skip.type = "button";
    skip.textContent = status === "skipped" ? "Skipped" : "Skip";
    skip.disabled = status !== "queued";
    skip.addEventListener("click", () => setStatus(slot.id, "skipped"));
    actions.append(done, skip);
    article.appendChild(actions);
    return article;
  }

  function renderHome(parts, marks, dueId) {
    const day = widgetDay(parts);
    const todays = SLOTS.filter((s) => s.date === day);
    const next = nextDue(parts, marks);
    const showingOtherDay = day !== parts.date;

    el.clockDate.textContent = parts.pretty;
    el.clockSub.textContent = showingOtherDay
      ? `${parts.time} America/Denver · showing ${prettyDate(day)} slots`
      : `${parts.time} America/Denver · 7:00–10:00 window`;

    el.remainToday.textContent = String(remaining(todays, marks));
    el.remainWeek.textContent = String(remaining(SLOTS, marks));

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

    el.todayList.replaceChildren(...todays.map((s) => slotCard(s, marks, dueId)));
  }

  function renderWeek(parts, marks, dueId) {
    const dates = [...new Set(SLOTS.map((s) => s.date))];
    el.weekList.replaceChildren(
      ...dates.map((date) => {
        const daySlots = SLOTS.filter((s) => s.date === date);
        const open = remaining(daySlots, marks);
        const section = document.createElement("section");
        const isToday = date === parts.date || date === widgetDay(parts);
        section.className = `day${isToday ? " is-open" : ""}`;
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

  function render() {
    const parts = denverParts();
    const marks = loadMarks();
    const dueId = dueNowId(parts, marks);
    renderHome(parts, marks, dueId);
    renderWeek(parts, marks, dueId);
    route();
  }

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

  if (window.matchMedia("(display-mode: standalone)").matches) {
    el.install.classList.add("hidden");
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }

  render();
  setInterval(render, 30000);
})();
