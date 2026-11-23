import { config } from "./config.js";

const PENDING_TEXT = "Pendiente de confirmar";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Lee un valor anidado de config: get("contact.supportEmail") */
const get = (path) =>
  path.split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), config);

const isSet = (v) =>
  v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0);

const money = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: config.currency || "MXN", maximumFractionDigits: 0 }).format(n);

/** Crea un elemento: h("p", { class: "x" }, "texto", hijo) */
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v == null) continue;
    if (k === "class") el.className = v;
    else if (k === "style") el.style.cssText = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  el.append(...children.flat().filter((c) => c != null && c !== false));
  return el;
}

const pendingEl = () => h("span", { class: "pending" }, PENDING_TEXT);
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const allyById = Object.fromEntries(config.allies.map((a) => [a.id, a]));

const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12l5 5L19 7"/></svg>';
const svg = (markup) => { const t = document.createElement("template"); t.innerHTML = markup; return t.content.firstChild; };

/* ---------- Tema claro / oscuro ---------- */
function initTheme() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const current = () => root.dataset.theme || (media.matches ? "dark" : "light");
  const paint = () => {
    const dark = current() === "dark";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  };
  btn.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch { /* almacenamiento no disponible */ }
    paint();
  });
  media.addEventListener?.("change", paint);
  paint();
}

/* ---------- Encabezado y menú móvil ---------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.getElementById("menu-principal");
  if (!toggle || !menu) return;
  const close = () => { toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("is-open"); };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { close(); toggle.focus(); }
  });
}

/* ---------- Submenú desplegable (Legal) ---------- */
function initDropdowns() {
  document.querySelectorAll(".nav-drop").forEach((drop) => {
    const btn = drop.querySelector(".nav-drop__btn");
    const set = (open) => { btn.setAttribute("aria-expanded", String(open)); drop.classList.toggle("is-open", open); };
    btn.addEventListener("click", (e) => { e.stopPropagation(); set(btn.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("click", (e) => { if (!drop.contains(e.target)) set(false); });
    drop.addEventListener("keydown", (e) => { if (e.key === "Escape") { set(false); btn.focus(); } });
    drop.addEventListener("focusout", (e) => { if (!drop.contains(e.relatedTarget)) set(false); });
  });
}

/* ---------- Valores simples: <span data-cfg="contact.phone"> ---------- */
function fillValues() {
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const value = get(el.dataset.cfg);
    if (isSet(value)) {
      el.textContent = el.dataset.format === "money" ? money(value) : String(value);
    } else if (!el.querySelector(".pending")) {
      el.replaceChildren(pendingEl());
    }
  });
}

/* ---------- Botones de contacto: se habilitan solo con datos oficiales ---------- */
function linkFor(kind) {
  const c = config.contact;
  switch (kind) {
    case "email": return isSet(c.supportEmail) ? `mailto:${c.supportEmail}` : null;
    case "privacy-email": {
      const m = config.legal.privacyEmail || c.supportEmail;
      return isSet(m) ? `mailto:${m}?subject=${encodeURIComponent("Solicitud de derechos ARCO")}` : null;
    }
    case "allies-email":
      return isSet(c.supportEmail) ? `mailto:${c.supportEmail}?subject=${encodeURIComponent("Información para nuevos aliados MultiNet")}` : null;
    case "phone": return isSet(c.phone) ? `tel:${c.phone.replace(/[^\d+]/g, "")}` : null;
    case "whatsapp": return isSet(c.whatsapp) ? `https://wa.me/${c.whatsapp.replace(/\D/g, "")}` : null;
    case "whatsapp-contratar":
      return isSet(c.whatsapp)
        ? `https://wa.me/${c.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, quiero contratar el servicio de Internet de HerzSA.Net.")}`
        : null;
    default: return null;
  }
}

function initContactButtons() {
  document.querySelectorAll("[data-contact]").forEach((el) => {
    const href = linkFor(el.dataset.contact);
    if (href) {
      el.setAttribute("href", href);
      el.removeAttribute("aria-disabled");
      el.classList.remove("is-disabled");
      if (href.startsWith("https://")) { el.target = "_blank"; el.rel = "noopener noreferrer"; }
      el.querySelector(".btn__note")?.remove();
      if (el.classList.contains("wa-float")) el.hidden = false;
    } else {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
      el.classList.add("is-disabled");
    }
  });
}

/* ---------- Planes ---------- */
const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"/></svg>';
const icon = (paths, sw = 2) => svg(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`);
const ICON_STORE = '<path d="M4 10v10h16V10"/><path d="M3 10l2-6h14l2 6"/><path d="M3 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3"/><path d="M10 20v-5h4v5"/>';
const ICON_PIN = '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>';
const ICON_RADIO = '<rect x="6" y="8" width="12" height="14" rx="2"/><path d="M9 8V2M9 13h6M9 17h6"/>';

const ICON_HOUSE = '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>';

function renderPlans() {
  document.querySelectorAll("[data-plans]").forEach((box) => {
    if (box.dataset.variant === "pro") {
      box.replaceChildren(...config.plans.map((p) =>
        h("article", { class: `pplan pplan--${p.tone || "blue"} reveal` },
          p.badge ? h("span", { class: "pplan__badge" }, p.badge) : null,
          h("div", { class: "pplan__band" }, icon(ICON_HOUSE), h("h3", {}, p.name)),
          h("p", { class: "pplan__speed" }, h("strong", {}, p.speed), h("span", {}, "simétricos")),
          h("p", { class: "pplan__price" }, h("strong", {}, money(p.price)), h("span", {}, " / mes")),
          h("p", { class: "pplan__desc" }, p.description),
          h("ul", { class: "pplan__features" }, p.features.map((f) => h("li", {}, svg(CHECK), h("span", {}, f)))),
          h("a", { class: "btn pplan__cta", href: box.dataset.ctaHref || "#cobertura" }, h("span", {}, "Consultar disponibilidad"), svg(CHEV)),
        )));
      return;
    }
    box.replaceChildren(...config.plans.map((p) =>
      h("article", { class: `plan plan--${p.tone || "blue"} reveal` },
        p.badge ? h("span", { class: "plan__ribbon" }, p.badge) : null,
        h("h3", { class: "plan__name" }, p.name),
        h("p", { class: "plan__speed" }, `${p.speed} simétricos`),
        h("p", { class: "plan__price" }, h("span", { class: "plan__amount" }, money(p.price)), h("span", { class: "plan__period" }, " / mes")),
        h("p", { class: "plan__desc" }, p.description),
        h("ul", { class: "plan__features" }, p.features.map((f) => h("li", {}, svg(CHECK), h("span", {}, f)))),
        h("a", { class: "btn btn--sm plan__cta", href: box.dataset.ctaHref || "#cobertura" }, h("span", {}, "Consultar disponibilidad"), svg(CHEV)),
      )));
  });
}

/* ---------- Fichas ---------- */
function renderVouchers() {
  document.querySelectorAll("[data-vouchers]").forEach((box) => {
    box.replaceChildren(...config.vouchers.map((v) =>
      h("article", { class: "voucher reveal" },
        h("p", { class: "voucher__time" }, v.name),
        h("p", { class: "voucher__price" }, money(v.price)),
        h("p", { class: `voucher__type voucher__type--${v.type}` }, v.type === "pausado" ? "Tiempo pausado" : "Tiempo corrido"),
        h("p", { class: "voucher__desc" }, v.type === "pausado"
          ? "Tienes hasta 24 horas para consumir tu tiempo."
          : "El tiempo inicia al ingresar tu ficha."),
      )));
  });
}

/* ---------- Puntos de venta ---------- */
function renderSalesPoints() {
  document.querySelectorAll("[data-sales-points]").forEach((box) => {
    box.replaceChildren(...config.salesPoints.map((s) =>
      h("li", { class: "spot" },
        h("span", { class: "spot__store" }, icon(ICON_STORE), h("strong", {}, s.store)),
        h("span", { class: "spot__loc" }, icon(ICON_PIN), h("span", {}, s.locality)))));
  });
}

/* ---------- Radiofrecuencia ---------- */
function renderRadio() {
  document.querySelectorAll("[data-radio]").forEach((box) => {
    box.replaceChildren(...config.radioPackages.map((r) =>
      h("article", { class: `pkg pkg--${r.tone || "blue"} reveal` },
        h("p", { class: "pkg__name" }, r.name, r.badge ? h("span", { class: "badge" }, r.badge) : null),
        h("p", { class: "pkg__title" },
          h("span", { class: "pkg__icons" }, Array.from({ length: Math.min(r.radios || 1, 3) }, () => icon(ICON_RADIO))),
          h("strong", {}, r.title)),
        h("p", { class: "pkg__detail" }, r.detail),
        h("p", { class: "pkg__extra" }, svg(CHECK), h("span", {}, r.extra)))));
  });
}

/* ---------- Aliados ---------- */
function allyTag(id) {
  const a = allyById[id];
  if (!a) return null;
  return h("span", { class: "net-tag", style: `--net:${a.color}` }, a.short || a.name);
}

function renderAllies() {
  document.querySelectorAll("[data-allies]").forEach((box) => {
    const counts = {};
    config.coverage.forEach(([, nets]) => nets.forEach((n) => { counts[n] = (counts[n] || 0) + 1; }));
    if (box.dataset.variant === "tiles") {
      box.replaceChildren(...config.allies.map((a) => {
        const n = counts[a.id] || 0;
        return h("li", { class: "ally-tile", style: `--net:${a.color}` },
          h("span", { class: "ally__mark", "aria-hidden": "true" }, (a.short || a.name).replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()),
          h("strong", {}, a.name),
          h("span", { class: "ally__ssid" }, `MULTINET_${a.short || a.name}`),
          h("span", { class: "ally-tile__count" }, icon(ICON_PIN), `${n} localidad${n === 1 ? "" : "es"}`));
      }));
      return;
    }
    box.replaceChildren(...config.allies.map((a) =>
      h("li", { class: "ally reveal", style: `--net:${a.color}` },
        h("span", { class: "ally__mark", "aria-hidden": "true" }, (a.short || a.name).replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()),
        h("span", { class: "ally__body" },
          h("strong", {}, a.name),
          h("span", { class: "ally__ssid" }, `MULTINET_${a.short || a.name}`),
          h("span", { class: "ally__count" }, `${counts[a.id] || 0} localidad${counts[a.id] === 1 ? "" : "es"}`)))));
  });
}

/* ---------- Explorador de cobertura ---------- */
function renderCoverage() {
  document.querySelectorAll("[data-coverage]").forEach((box, idx) => {
    const fixed = box.dataset.network || null;
    const layout = box.dataset.layout || "grid";
    const items = config.coverage
      .map(([name, nets, extra]) => ({ name, nets, key: norm(`${name} ${extra || ""} ${nets.map((n) => allyById[n]?.name).join(" ")}`) }))
      .filter((it) => !fixed || it.nets.includes(fixed));
    let net = "todas";
    let query = "";

    const extCount = box.dataset.count ? document.querySelector(box.dataset.count) : null;
    const count = extCount || h("p", { class: "explorer__count", "aria-live": "polite" });
    if (extCount) extCount.setAttribute("aria-live", "polite");
    const listClass = { rows: "loc-rows", pins: "loc-pins" }[layout] || "loc-grid";
    const list = h("ul", { class: listClass, tabindex: "0", "aria-label": "Localidades encontradas" });
    const empty = h("p", { class: "explorer__empty", hidden: true }, "No encontramos esa localidad. Consúltanos: la cobertura crece constantemente.");

    const row = (it) => {
      const tags = h("span", { class: "loc__tags" }, it.nets.map(allyTag));
      if (layout === "rows") return h("li", { class: "loc-row" }, svg(CHECK), h("span", { class: "loc__name" }, it.name), tags);
      if (layout === "pins") return h("li", { class: "loc-pin" }, icon(ICON_PIN), h("span", { class: "loc__name" }, it.name), tags);
      return h("li", { class: "loc" }, h("span", { class: "loc__name" }, it.name), tags);
    };
    const limit = parseInt(box.dataset.limit || "0", 10);
    const moreBtn = box.dataset.more ? document.querySelector(box.dataset.more) : null;
    let expanded = false;
    const draw = () => {
      const q = norm(query.trim());
      const shown = items.filter((it) => (net === "todas" || it.nets.includes(net)) && (!q || it.key.includes(q)));
      const cut = limit && !expanded && shown.length > limit;
      list.replaceChildren(...(cut ? shown.slice(0, limit) : shown).map(row));
      if (moreBtn) {
        moreBtn.hidden = !limit || shown.length <= limit;
        moreBtn.setAttribute("aria-expanded", String(expanded));
        moreBtn.querySelector("span").textContent = expanded ? "Ver menos localidades" : `Ver las ${shown.length} localidades completas`;
      }
      count.textContent = `${shown.length} de ${items.length} localidades`;
      empty.hidden = shown.length > 0;
    };
    const onInput = (e) => { query = e.target.value; draw(); };
    moreBtn?.addEventListener("click", () => { expanded = !expanded; draw(); });

    // Filtros por red: botones y, opcionalmente, un <select> sincronizado
    const nets = [["todas", "Todas"], ...config.allies.map((a) => [a.id, a.short || a.name])];
    let group = null;
    const extSelect = box.dataset.select ? document.querySelector(box.dataset.select) : null;
    const setNet = (val) => {
      net = val;
      group?.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.net === val)));
      if (extSelect) extSelect.value = val;
      draw();
    };
    if (!fixed) {
      group = h("div", { class: "explorer__filters", role: "group", "aria-label": "Filtrar por red" },
        nets.map(([val, label]) => h("button", {
          type: "button", class: "filter", "data-net": val, "aria-pressed": String(val === net),
          style: val === "todas" ? null : `--net:${allyById[val].color}`,
          onclick: () => setNet(val),
        }, label)));
      if (extSelect) {
        extSelect.replaceChildren(...nets.map(([val, label]) => h("option", { value: val }, label)));
        extSelect.addEventListener("change", (e) => setNet(e.target.value));
      }
    }

    const extSearch = box.dataset.search ? document.querySelector(box.dataset.search) : null;
    if (extSearch) {
      extSearch.addEventListener("input", onInput);
      extSearch.closest("form")?.addEventListener("submit", (e) => { e.preventDefault(); draw(); list.focus(); });
      const extFilters = box.dataset.filters ? document.querySelector(box.dataset.filters) : null;
      if (group && extFilters) extFilters.replaceChildren(group);
      box.replaceChildren(list, empty);
      draw();
      return;
    }

    const id = `buscar-localidad-${idx}`;
    const search = h("input", { id, type: "search", class: "explorer__input", placeholder: "Ej. Dos Amates", autocomplete: "off", oninput: onInput });
    const controls = [h("div", { class: "explorer__search" }, h("label", { for: id }, "Busca tu localidad"), search)];
    if (group) controls.push(group);
    box.replaceChildren(h("div", { class: "explorer__controls" }, controls), count, list, empty);
    draw();
  });
}

/* ---------- Pestañas accesibles ---------- */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((wrap) => {
    const tabs = [...wrap.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (dir) { e.preventDefault(); select(tabs[(i + dir + tabs.length) % tabs.length], true); }
        if (e.key === "Home") { e.preventDefault(); select(tabs[0], true); }
        if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
    // Abrir la pestaña indicada en la URL (#fichas), también al navegar dentro de la página
    const fromHash = () => {
      const t = tabs.find((x) => `#${x.dataset.hash}` === location.hash);
      if (t) select(t);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      const t = a && tabs.find((x) => a.getAttribute("href") === `#${x.dataset.hash}`);
      if (t) select(t);
    });
  });
}

/* ---------- Cifras ---------- */
function fillStats() {
  const values = {
    localities: config.coverage.length,
    allies: config.allies.length,
    herzsaLocalities: config.coverage.filter(([, n]) => n.includes("herzsa")).length,
    maxSpeed: Math.max(...config.plans.map((p) => parseInt(p.speed, 10))),
    minPrice: Math.min(...config.plans.map((p) => p.price)),
    installation: config.installationCost,
    salesPoints: config.salesPoints.length,
  };
  document.querySelectorAll("[data-stat]").forEach((el) => {
    const target = values[el.dataset.stat];
    if (target == null) return;
    const fmt = (n) => (el.dataset.format === "money" ? money(n) : String(n));
    if (reduceMotion || !("IntersectionObserver" in window)) { el.textContent = fmt(target); return; }
    el.textContent = fmt(0);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - start) / 900);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
  });
}

/* ---------- Estado de la app Roku ---------- */
const STATUS_TEXT = {
  "en-desarrollo": "En desarrollo · aún no disponible en la tienda de canales de Roku",
  "en-revision": "En proceso de publicación · aún no disponible en la tienda de canales de Roku",
  "publicada": "Disponible en la tienda de canales de Roku",
};

function fillAppStatus() {
  document.querySelectorAll("[data-app-status]").forEach((el) => {
    const app = config.apps[el.dataset.appStatus];
    if (!app) return;
    el.textContent = STATUS_TEXT[app.status] || PENDING_TEXT;
    el.dataset.state = app.status;
  });
  document.querySelectorAll("[data-app-store]").forEach((el) => {
    const app = config.apps[el.dataset.appStore];
    const ok = app?.status === "publicada" && isSet(app.storeUrl);
    if (ok) el.href = app.storeUrl;
    el.hidden = !ok;
  });
}

/* ---------- Aviso de borrador legal ---------- */
function legalBanner() {
  const approved = config.legal.approved === true && isSet(config.legal.lastUpdated);
  document.querySelectorAll("[data-legal-draft]").forEach((el) => { el.hidden = approved; });
}

/* ---------- Redes sociales: solo las configuradas ---------- */
function fillSocial() {
  const box = document.querySelector("[data-social]");
  if (!box) return;
  const entries = Object.entries(config.social).filter(([, url]) => isSet(url));
  if (!entries.length) { box.hidden = true; return; }
  const labels = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube" };
  box.append(h("ul", { class: "social" }, entries.map(([k, url]) =>
    h("li", {}, h("a", { href: url, rel: "noopener noreferrer", target: "_blank" }, labels[k] || k)))));
  box.hidden = false;
}

/* ---------- Aparición suave al hacer scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -40px 0px" });
  els.forEach((e) => io.observe(e));
}

function init() {
  initTheme();
  initHeader();
  initDropdowns();
  renderPlans();
  renderVouchers();
  renderSalesPoints();
  renderRadio();
  renderAllies();
  renderCoverage();
  initTabs();
  fillValues();
  fillStats();
  fillAppStatus();
  initContactButtons();
  legalBanner();
  fillSocial();
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.dataset.copy);
      const label = btn.getAttribute("aria-label");
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        btn.setAttribute("aria-label", "Copiado");
        btn.classList.add("is-copied");
      } catch {
        const range = document.createRange(); range.selectNodeContents(target);
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      }
      setTimeout(() => { btn.setAttribute("aria-label", label); btn.classList.remove("is-copied"); }, 1600);
    });
  });
  document.querySelectorAll("[data-site-url]").forEach((el) => { el.textContent = config.siteUrl + el.dataset.siteUrl; });
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
  document.documentElement.classList.add("js");
  initReveal();
}

init();
