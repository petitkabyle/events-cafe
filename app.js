// ============================================================
//  EVENTS CAFÉ — Application de gestion (app.js)
//  Données temps réel via Firebase Realtime Database.
//  Repli "mode local" si Firebase n'est pas encore configuré.
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, update, remove, onValue }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const MATERIEL = window.MATERIEL || [];
const cfg = window.EVENTS_CAFE_CONFIG || {};
const isConfigured = cfg.apiKey && !cfg.apiKey.includes("COLLE_TON");

let db = null, evRef = null, demRef = null;
let EVENTS = [];      // [{id, ...}]
let DEMANDES = [];    // [{id, ...}]
let calDate = new Date();

// ---------- Firebase init ----------
if (isConfigured) {
  try {
    const app = initializeApp(cfg);
    db = getDatabase(app);
    evRef = ref(db, "events");
    demRef = ref(db, "demandes");
    document.getElementById("setupBanner").style.display = "none";
    setSync(true);
    onValue(evRef, (snap) => {
      const v = snap.val() || {};
      EVENTS = Object.entries(v).map(([id, o]) => ({ id, ...o }));
      renderAll();
    });
    onValue(demRef, (snap) => {
      const v = snap.val() || {};
      DEMANDES = Object.entries(v).map(([id, o]) => ({ id, ...o }));
      renderAll();
    });
  } catch (e) {
    console.error(e); setSync(false);
  }
} else {
  setSync(false);
  loadLocal();
}

function setSync(on) {
  const p = document.getElementById("syncPill");
  const t = document.getElementById("syncTxt");
  if (on) { p.classList.remove("off"); t.textContent = "Synchronisé en temps réel"; }
  else { p.classList.add("off"); t.textContent = "Mode local (config requise)"; }
}


// ---------- Mode local (fallback sans Firebase) ----------
function loadLocal() {
  EVENTS = JSON.parse(localStorage.getItem("ec_events") || "[]");
  DEMANDES = JSON.parse(localStorage.getItem("ec_demandes") || "[]");
  renderAll();
}
function saveLocal() {
  localStorage.setItem("ec_events", JSON.stringify(EVENTS));
  localStorage.setItem("ec_demandes", JSON.stringify(DEMANDES));
}

// ---------- Couche données (Firebase OU local) ----------
async function dbAddEvent(obj) {
  if (db) { await push(evRef, obj); }
  else { EVENTS.push({ id: "loc_" + Date.now(), ...obj }); saveLocal(); renderAll(); }
}
async function dbUpdateEvent(id, patch) {
  if (db) { await update(ref(db, "events/" + id), patch); }
  else { EVENTS = EVENTS.map(e => e.id === id ? { ...e, ...patch } : e); saveLocal(); renderAll(); }
}
async function dbDeleteEvent(id) {
  if (db) { await remove(ref(db, "events/" + id)); }
  else { EVENTS = EVENTS.filter(e => e.id !== id); saveLocal(); renderAll(); }
}
async function dbUpdateDemande(id, patch) {
  if (db) { await update(ref(db, "demandes/" + id), patch); }
  else { DEMANDES = DEMANDES.map(d => d.id === id ? { ...d, ...patch } : d); saveLocal(); renderAll(); }
}
async function dbDeleteDemande(id) {
  if (db) { await remove(ref(db, "demandes/" + id)); }
  else { DEMANDES = DEMANDES.filter(d => d.id !== id); saveLocal(); renderAll(); }
}

// ---------- Helpers ----------
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const fmtDate = (s) => s ? new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—";
const statusClass = (st) => st === "Livré" ? "b-livre" : st === "Récupéré" ? "b-recup" : "b-prep";
const evClass = (st) => st === "Livré" ? "ev-livre" : st === "Récupéré" ? "ev-recup" : "ev-prep";

function materielSummary(o) {
  const parts = MATERIEL.filter(m => (o[m.key] || 0) > 0).map(m => `${o[m.key]}× ${m.label}`);
  return parts.length ? parts.join(", ") : "—";
}

function toast(msg, type = "") {
  const wrap = document.getElementById("toasts");
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML = (type === "ok" ? "✅ " : type === "err" ? "⚠️ " : "☕ ") + msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateX(120%)"; }, 3000);
  setTimeout(() => el.remove(), 3400);
}


// ---------- Calcul du stock ----------
function computeStock() {
  return MATERIEL.map(m => {
    const dispo = m.total - m.maintenance;
    const loue = EVENTS.filter(e => e.statut === "Livré").reduce((s, e) => s + (parseInt(e[m.key]) || 0), 0);
    const libre = dispo - loue;
    const pct = dispo > 0 ? Math.round((libre / dispo) * 100) : 100;
    let niveau = "ok"; if (pct < 20) niveau = "crit"; else if (pct < 50) niveau = "warn";
    return { ...m, dispo, loue, libre, pct, niveau };
  });
}

// ---------- RENDER : tout ----------
function renderAll() {
  renderDashboard();
  renderCalendar();
  renderEvents();
  renderStock();
  renderDemandes();
}

// ---------- Dashboard ----------
function renderDashboard() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const in7 = new Date(today.getTime() + 7 * 864e5);
  const week = EVENTS.filter(e => { const d = new Date(e.dateDebut); return d >= today && d <= in7; }).length;
  const livre = EVENTS.filter(e => e.statut === "Livré").length;
  const stock = computeStock();
  const alertes = stock.filter(s => s.niveau !== "ok").length;
  const demNew = DEMANDES.filter(d => (d.statut || "Nouvelle") === "Nouvelle").length;

  $("#kpiWeek").textContent = week;
  $("#kpiLivre").textContent = livre;
  $("#kpiStock").textContent = alertes;
  $("#kpiDem").textContent = demNew;
  const badge = $("#demBadge");
  badge.textContent = demNew ? demNew : "";
  badge.style.cssText = demNew ? "background:var(--gold);color:#fff;border-radius:999px;padding:1px 8px;font-size:.72em;margin-left:4px;" : "";

  const up = [...EVENTS].filter(e => new Date(e.dateFin || e.dateDebut) >= today)
    .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut)).slice(0, 6);
  $("#dashUpcoming").innerHTML = up.length ? up.map(e => `
    <tr><td>${fmtDate(e.dateDebut)} → ${fmtDate(e.dateFin)}</td><td><b>${e.nom || ""}</b><br><span class="muted" style="font-size:.85em">${e.salon || ""}</span></td>
    <td>${e.client || ""}</td><td>${e.stand || "—"}</td><td>${e.ville || ""}</td>
    <td><span class="badge ${statusClass(e.statut)}">${e.statut || "À préparer"}</span></td></tr>`).join("")
    : `<tr><td colspan="6" class="empty">Aucun événement à venir</td></tr>`;

  const crit = stock.filter(s => s.niveau !== "ok");
  $("#dashStock").innerHTML = crit.length ? crit.map(s => stockRow(s, true)).join("")
    : `<tr><td colspan="5" class="empty">✅ Tout le stock est au vert</td></tr>`;
}

function stockRow(s, mini) {
  const cls = s.niveau === "crit" ? "sb-crit" : s.niveau === "warn" ? "sb-warn" : "sb-ok";
  const bar = `<div class="stock-bar-bg"><div class="stock-bar ${cls}" style="width:${Math.max(0, s.pct)}%"></div></div>`;
  if (mini) return `<tr><td>${s.icon} ${s.label}</td><td>${s.dispo}</td><td>${s.loue}</td><td><b>${s.libre}</b></td><td>${bar}</td></tr>`;
  return `<tr><td>${s.icon} <b>${s.label}</b></td><td>${s.total}</td><td>${s.maintenance}</td><td>${s.dispo}</td>
    <td style="color:var(--amber)"><b>${s.loue}</b></td><td style="color:var(--green)"><b>${s.libre}</b></td>
    <td style="min-width:120px">${bar}<span style="font-size:.78em;color:var(--latte)">${s.pct}% libre</span></td></tr>`;
}
function renderStock() { $("#stockBody").innerHTML = computeStock().map(s => stockRow(s, false)).join(""); }


// ---------- Événements (table) ----------
function renderEvents() {
  const q = ($("#evSearch")?.value || "").toLowerCase();
  const fs = $("#evFilterStatut")?.value || "";
  let list = [...EVENTS].sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));
  if (q) list = list.filter(e => [e.nom, e.client, e.salon, e.stand, e.ville].join(" ").toLowerCase().includes(q));
  if (fs) list = list.filter(e => (e.statut || "À préparer") === fs);

  $("#evBody").innerHTML = list.length ? list.map(e => `
    <tr>
      <td>${fmtDate(e.dateDebut)} → ${fmtDate(e.dateFin)}</td>
      <td><b>${e.nom || ""}</b><br><span class="muted" style="font-size:.85em">${e.salon || ""}</span></td>
      <td>${e.client || ""}</td><td>${e.stand || "—"}</td><td>${e.ville || ""}</td>
      <td style="max-width:220px; font-size:.85em">${materielSummary(e)}</td>
      <td>
        <select class="mini-select" data-status="${e.id}">
          ${["À préparer", "Livré", "Récupéré"].map(s => `<option ${(e.statut || "À préparer") === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </td>
      <td style="white-space:nowrap">
        <button class="icon-btn" data-view="${e.id}" title="Détail">👁️</button>
        <button class="icon-btn" data-edit="${e.id}" title="Modifier">✏️</button>
        <button class="icon-btn" data-del="${e.id}" title="Supprimer">🗑️</button>
      </td>
    </tr>`).join("") : `<tr><td colspan="8" class="empty">Aucun événement. Clique sur « Nouvel événement » 👆</td></tr>`;
}

// ---------- Calendrier ----------
function renderCalendar() {
  const dows = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  $("#calDows").innerHTML = dows.map(d => `<div class="cal-dow">${d}</div>`).join("");
  const y = calDate.getFullYear(), m = calDate.getMonth();
  $("#calLabel").textContent = calDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const first = new Date(y, m, 1);
  let startDow = (first.getDay() + 6) % 7; // lundi=0
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let cells = "";
  for (let i = 0; i < startDow; i++) cells += `<div class="cal-cell out"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const cur = new Date(y, m, d);
    const evs = EVENTS.filter(e => {
      const s = new Date(e.dateDebut); s.setHours(0, 0, 0, 0);
      const f = new Date(e.dateFin || e.dateDebut); f.setHours(0, 0, 0, 0);
      return cur >= s && cur <= f;
    });
    const isToday = cur.getTime() === today.getTime();
    cells += `<div class="cal-cell ${isToday ? "today" : ""}"><span class="cal-daynum">${d}</span>
      ${evs.slice(0, 3).map(e => `<div class="cal-ev ${evClass(e.statut)}" data-view="${e.id}">${e.client || e.nom || ""}</div>`).join("")}
      ${evs.length > 3 ? `<span style="font-size:.68em;color:var(--latte)">+${evs.length - 3}</span>` : ""}</div>`;
  }
  $("#calBody").innerHTML = cells;
}


// ---------- Demandes clients ----------
function renderDemandes() {
  let list = [...DEMANDES].sort((a, b) => new Date(b.recuLe || 0) - new Date(a.recuLe || 0));
  $("#demBody").innerHTML = list.length ? list.map(d => {
    const st = d.statut || "Nouvelle";
    const cls = st === "Confirmée" ? "b-confirm" : st === "Planifiée" ? "b-recup" : "b-new";
    return `<tr>
      <td>${d.recuLe ? new Date(d.recuLe).toLocaleDateString("fr-FR") : "—"}</td>
      <td><b>${d.client || ""}</b><br><span class="muted" style="font-size:.85em">${d.typeEvent || ""}</span></td>
      <td style="font-size:.85em">${d.contact || ""}<br>${d.tel || ""}</td>
      <td>${d.ville || ""}<br><span class="muted" style="font-size:.82em">${d.lieu || ""}</span></td>
      <td>${fmtDate(d.dateMontage)} → ${fmtDate(d.dateDemontage)}</td>
      <td style="max-width:200px; font-size:.82em">${materielSummary(d)}</td>
      <td><span class="badge ${cls}">${st}</span></td>
      <td style="white-space:nowrap">
        <button class="icon-btn" data-demview="${d.id}" title="Détail">👁️</button>
        <button class="icon-btn" data-demadd="${d.id}" title="Transférer vers le planning">📅</button>
        <button class="icon-btn" data-demdel="${d.id}" title="Supprimer">🗑️</button>
      </td></tr>`;
  }).join("") : `<tr><td colspan="8" class="empty">Aucune demande pour l'instant. Partage ton formulaire client ! 🔗</td></tr>`;
}

// ---------- Remplissage des selects + grille quantités ----------
function buildForm() {
  $("#selSalon").innerHTML = `<option value="">— Choisir —</option>` + (window.SALONS || []).map(s => `<option>${s}</option>`).join("");
  $("#selClient").innerHTML = `<option value="">— Choisir —</option>` + (window.CLIENTS || []).map(s => `<option>${s}</option>`).join("");
  $("#selVille").innerHTML = `<option value="">— Choisir —</option>` + (window.VILLES || []).map(s => `<option>${s}</option>`).join("");
  $("#qtyGrid").innerHTML = MATERIEL.map(m => `
    <div class="qty">
      <span class="lbl">${m.icon} ${m.label}</span>
      <span class="ctrls">
        <button type="button" data-step="-1" data-k="${m.key}">−</button>
        <input type="number" name="${m.key}" min="0" value="0" />
        <button type="button" data-step="1" data-k="${m.key}">+</button>
      </span>
    </div>`).join("");
}


// ---------- Navigation ----------
const titles = {
  dashboard: ["Tableau de bord", "Vue d'ensemble de ton activité"],
  calendrier: ["Calendrier", "Tous tes événements mois par mois"],
  evenements: ["Événements", "Gère et mets à jour chaque prestation"],
  stock: ["Stock", "Suivi automatique de ton parc matériel"],
  demandes: ["Demandes clients", "Les demandes reçues via ton formulaire"],
  nouveau: ["Nouvel événement", "Ajoute une prestation au planning"]
};
function goTo(sec) {
  $$(".section").forEach(s => s.classList.remove("active"));
  $("#" + sec).classList.add("active");
  $$(".menu button").forEach(b => b.classList.toggle("active", b.dataset.sec === sec));
  $("#secTitle").textContent = titles[sec][0];
  $("#secSub").textContent = titles[sec][1];
  $("#sidebar").classList.remove("open");
  window.scrollTo(0, 0);
}
$$(".menu button").forEach(b => b.addEventListener("click", () => goTo(b.dataset.sec)));
document.addEventListener("click", (e) => {
  const go = e.target.closest("[data-go]"); if (go) goTo(go.dataset.go);
});
$("#burger").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

// ---------- Filtres événements ----------
$("#evSearch").addEventListener("input", renderEvents);
$("#evFilterStatut").addEventListener("change", renderEvents);

// ---------- Calendrier nav ----------
$("#calPrev").addEventListener("click", () => { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); });
$("#calNext").addEventListener("click", () => { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); });

// ---------- Lien du formulaire ----------
$("#copyFormLink").addEventListener("click", () => {
  const url = location.href.replace(/index\.html.*$/, "") + "formulaire.html";
  navigator.clipboard.writeText(url).then(() => toast("Lien du formulaire copié : " + url, "ok"))
    .catch(() => toast("Lien : " + url));
});


// ---------- Steppers (+/-) ----------
document.addEventListener("click", (e) => {
  const step = e.target.closest("[data-step]");
  if (!step) return;
  const inp = document.querySelector(`#qtyGrid input[name="${step.dataset.k}"]`);
  if (inp) { inp.value = Math.max(0, (parseInt(inp.value) || 0) + parseInt(step.dataset.step)); }
});

// ---------- Soumission formulaire événement ----------
$("#eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const obj = {
    nom: fd.get("nom"), salon: fd.get("salon"), client: fd.get("client"),
    ville: fd.get("ville"), stand: fd.get("stand") || "", contact: fd.get("contact") || "",
    dateDebut: fd.get("dateDebut"), dateFin: fd.get("dateFin"),
    notes: fd.get("notes") || "", statut: fd.get("statut") || "À préparer"
  };
  MATERIEL.forEach(m => obj[m.key] = parseInt(fd.get(m.key)) || 0);
  const id = fd.get("id");
  if (id) { await dbUpdateEvent(id, obj); toast("Événement mis à jour", "ok"); }
  else { obj.statut = "À préparer"; await dbAddEvent(obj); toast("Événement créé", "ok"); }
  e.target.reset(); e.target.querySelector('[name="id"]').value = "";
  $("#formTitle").textContent = "➕ Nouvel événement";
  goTo("evenements");
});
$("#formReset").addEventListener("click", () => {
  $("#eventForm").reset(); $("#eventForm [name=id]").value = "";
  $("#formTitle").textContent = "➕ Nouvel événement";
});

// ---------- Actions déléguées (table events) ----------
document.addEventListener("change", async (e) => {
  const sel = e.target.closest("[data-status]");
  if (sel) { await dbUpdateEvent(sel.dataset.status, { statut: sel.value }); toast("Statut : " + sel.value, "ok"); }
});
document.addEventListener("click", async (e) => {
  const del = e.target.closest("[data-del]");
  if (del && confirm("Supprimer cet événement ?")) { await dbDeleteEvent(del.dataset.del); toast("Supprimé"); return; }
  const edit = e.target.closest("[data-edit]");
  if (edit) { editEvent(edit.dataset.edit); return; }
  const view = e.target.closest("[data-view]");
  if (view) { viewEvent(view.dataset.view); return; }
});


// ---------- Éditer / Voir un événement ----------
function editEvent(id) {
  const e = EVENTS.find(x => x.id === id); if (!e) return;
  closeModal();
  const f = $("#eventForm");
  f.nom.value = e.nom || ""; f.salon.value = e.salon || ""; f.client.value = e.client || "";
  f.ville.value = e.ville || ""; f.stand.value = e.stand || ""; f.contact.value = e.contact || "";
  f.dateDebut.value = e.dateDebut || ""; f.dateFin.value = e.dateFin || ""; f.notes.value = e.notes || "";
  f.querySelector("[name=id]").value = id;
  MATERIEL.forEach(m => { const i = f.querySelector(`[name="${m.key}"]`); if (i) i.value = e[m.key] || 0; });
  $("#formTitle").textContent = "✏️ Modifier l'événement";
  goTo("nouveau");
}

function viewEvent(id) {
  const e = EVENTS.find(x => x.id === id); if (!e) return;
  $("#modalTitle").textContent = e.nom || "Détail";
  $("#modalBody").innerHTML = `
    <div style="display:grid; gap:10px;">
      <div><span class="badge ${statusClass(e.statut)}">${e.statut || "À préparer"}</span></div>
      <p><b>📅 Période :</b> ${fmtDate(e.dateDebut)} → ${fmtDate(e.dateFin)}</p>
      <p><b>🎪 Salon :</b> ${e.salon || "—"}</p>
      <p><b>👤 Client :</b> ${e.client || "—"}</p>
      <p><b>📍 Lieu :</b> ${e.ville || ""} ${e.stand ? "· " + e.stand : ""}</p>
      <p><b>📞 Contact :</b> ${e.contact || "—"}</p>
      <p><b>📦 Matériel :</b><br>${materielSummary(e)}</p>
      ${e.notes ? `<p><b>📝 Notes :</b><br>${e.notes}</p>` : ""}
    </div>
    <div style="margin-top:18px; display:flex; gap:10px;">
      <button class="btn btn-primary btn-sm" data-edit="${id}">✏️ Modifier</button>
    </div>`;
  openModal();
}

// ---------- Actions demandes ----------
document.addEventListener("click", async (e) => {
  const del = e.target.closest("[data-demdel]");
  if (del && confirm("Supprimer cette demande ?")) { await dbDeleteDemande(del.dataset.demdel); toast("Demande supprimée"); return; }
  const view = e.target.closest("[data-demview]");
  if (view) { viewDemande(view.dataset.demview); return; }
  const add = e.target.closest("[data-demadd]");
  if (add) { demandeToEvent(add.dataset.demadd); return; }
});


function viewDemande(id) {
  const d = DEMANDES.find(x => x.id === id); if (!d) return;
  $("#modalTitle").textContent = "Demande — " + (d.client || "");
  $("#modalBody").innerHTML = `
    <div style="display:grid; gap:10px;">
      <p><b>👤 Client :</b> ${d.client || "—"}</p>
      <p><b>📞 Contact :</b> ${d.contact || "—"} · ${d.tel || ""} · ${d.email || ""}</p>
      <p><b>🎭 Type :</b> ${d.typeEvent || "—"}</p>
      <p><b>📍 Lieu :</b> ${d.ville || ""} ${d.lieu ? "· " + d.lieu : ""}</p>
      <p><b>📅 Montage → Démontage :</b> ${fmtDate(d.dateMontage)} → ${fmtDate(d.dateDemontage)}</p>
      <p><b>📦 Matériel demandé :</b><br>${materielSummary(d)}</p>
      ${d.notes ? `<p><b>📝 Notes :</b><br>${d.notes}</p>` : ""}
    </div>
    <div style="margin-top:18px; display:flex; gap:10px; flex-wrap:wrap;">
      <button class="btn btn-primary btn-sm" data-demadd="${id}">📅 Transférer vers le planning</button>
    </div>`;
  openModal();
}

// Transforme une demande client en événement du planning
async function demandeToEvent(id) {
  const d = DEMANDES.find(x => x.id === id); if (!d) return;
  const obj = {
    nom: (d.client || "Demande") + (d.typeEvent ? " — " + d.typeEvent : ""),
    salon: d.salon || "Client direct", client: d.client || "", ville: d.ville || "",
    stand: d.lieu || "", contact: (d.contact || "") + " " + (d.tel || ""),
    dateDebut: d.dateMontage || "", dateFin: d.dateDemontage || "",
    notes: d.notes || "", statut: "À préparer"
  };
  MATERIEL.forEach(m => obj[m.key] = parseInt(d[m.key]) || 0);
  await dbAddEvent(obj);
  await dbUpdateDemande(id, { statut: "Planifiée" });
  closeModal();
  toast("Demande transférée vers le planning 📅", "ok");
  goTo("evenements");
}

// ---------- Modal ----------
function openModal() { $("#overlay").classList.add("open"); }
function closeModal() { $("#overlay").classList.remove("open"); }
$("#modalClose").addEventListener("click", closeModal);
$("#overlay").addEventListener("click", (e) => { if (e.target.id === "overlay") closeModal(); });

// ---------- Init ----------
buildForm();
renderAll();
