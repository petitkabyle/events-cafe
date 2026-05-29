// ============================================================
//  EVENTS CAFÉ — Formulaire client (form.js)
//  Envoie chaque demande dans Firebase -> noeud "demandes",
//  qui apparaît automatiquement dans l'app de gestion.
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const MATERIEL = window.MATERIEL || [];
const cfg = window.EVENTS_CAFE_CONFIG || {};
const isConfigured = cfg.apiKey && !cfg.apiKey.includes("COLLE_TON");
const $ = (s) => document.querySelector(s);

let db = null, demRef = null;
if (isConfigured) {
  try {
    const app = initializeApp(cfg);
    db = getDatabase(app);
    demRef = ref(db, "demandes");
  } catch (e) { console.error(e); }
} else {
  $("#setupNote").style.display = "flex";
}

// ---------- Construire les listes & quantités ----------
$("#selType").innerHTML = `<option value="">— Choisir —</option>` + (window.TYPES_EVENT || []).map(t => `<option>${t}</option>`).join("");
$("#selSalon").innerHTML = `<option value="">— Choisir —</option>` + (window.SALONS || []).map(s => `<option>${s}</option>`).join("");
$("#selVille").innerHTML = `<option value="">— Choisir —</option>` + (window.VILLES || []).map(v => `<option>${v}</option>`).join("");
$("#qtyGrid").innerHTML = MATERIEL.map(m => `
  <div class="qty">
    <span class="lbl">${m.icon} ${m.label}</span>
    <span class="ctrls">
      <button type="button" data-step="-1" data-k="${m.key}">−</button>
      <input type="number" name="${m.key}" min="0" value="0" />
      <button type="button" data-step="1" data-k="${m.key}">+</button>
    </span>
  </div>`).join("");

// ---------- Steppers ----------
document.addEventListener("click", (e) => {
  const step = e.target.closest("[data-step]");
  if (!step) return;
  const inp = document.querySelector(`input[name="${step.dataset.k}"]`);
  if (inp) inp.value = Math.max(0, (parseInt(inp.value) || 0) + parseInt(step.dataset.step));
});


// ---------- Toast ----------
function toast(msg, type = "") {
  const wrap = document.getElementById("toasts");
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML = (type === "ok" ? "✅ " : type === "err" ? "⚠️ " : "☕ ") + msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateX(120%)"; }, 3000);
  setTimeout(() => el.remove(), 3400);
}

// ---------- Soumission ----------
$("#demandeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);

  // Au moins un matériel demandé ?
  const totalMat = MATERIEL.reduce((s, m) => s + (parseInt(fd.get(m.key)) || 0), 0);
  if (totalMat === 0) { toast("Sélectionnez au moins un matériel 🙏", "err"); return; }

  const obj = {
    client: fd.get("client"), contact: fd.get("contact"), tel: fd.get("tel"), email: fd.get("email"),
    typeEvent: fd.get("typeEvent"), salon: fd.get("salon") || "", ville: fd.get("ville"),
    lieu: fd.get("lieu") || "", dateMontage: fd.get("dateMontage"), dateDemontage: fd.get("dateDemontage"),
    notes: fd.get("notes") || "", statut: "Nouvelle", recuLe: new Date().toISOString()
  };
  MATERIEL.forEach(m => obj[m.key] = parseInt(fd.get(m.key)) || 0);

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = "Envoi en cours...";

  try {
    if (db) {
      await push(demRef, obj);
    } else {
      // Repli local (démo) : on stocke dans le localStorage de l'app
      const arr = JSON.parse(localStorage.getItem("ec_demandes") || "[]");
      arr.push({ id: "loc_" + Date.now(), ...obj });
      localStorage.setItem("ec_demandes", JSON.stringify(arr));
    }
    $("#card").style.display = "none";
    $("#success").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
    toast("Erreur lors de l'envoi. Réessayez.", "err");
    btn.disabled = false; btn.textContent = "📨 Envoyer ma demande";
  }
});
