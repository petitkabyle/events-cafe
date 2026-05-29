// ============================================================
//  EVENTS CAFÉ — Catalogue matériel & stock (PARTAGÉ)
// ============================================================
//  Modifie ici tes quantités quand ton parc évolue.
//  key        : identifiant technique (ne pas changer)
//  label      : nom affiché
//  icon       : emoji
//  total      : quantité totale possédée
//  maintenance: quantité immobilisée (réparation)
// ============================================================

window.MATERIEL = [
  { key: "petitFrigo",   label: "Petit frigo",        icon: "🧊", total: 30,   maintenance: 0 },
  { key: "grandFrigo",   label: "Grand frigo",        icon: "🧊", total: 5,    maintenance: 0 },
  { key: "fontaine",     label: "Fontaine à eau",     icon: "💧", total: 50,   maintenance: 5 },
  { key: "bonbonne",     label: "Bonbonne d'eau",     icon: "🪣", total: 80,   maintenance: 0 },
  { key: "nespresso",    label: "Machine Nespresso",  icon: "☕", total: 5,    maintenance: 0 },
  { key: "covim",        label: "Machine Covim",      icon: "☕", total: 4,    maintenance: 0 },
  { key: "gemini",       label: "Machine Gemini",     icon: "☕", total: 3,    maintenance: 1 },
  { key: "lavazza",      label: "Machine Lavazza",    icon: "☕", total: 2,    maintenance: 0 },
  { key: "cafeNespresso",label: "Café Nespresso (boîte)", icon: "📦", total: 10, maintenance: 0 },
  { key: "cafeCovim",    label: "Café Covim (boîte)", icon: "📦", total: 15,   maintenance: 0 },
  { key: "gobelets",     label: "Gobelets (paquet)",  icon: "🥤", total: 1200, maintenance: 0 },
  { key: "popcorn",      label: "Machine à popcorn",  icon: "🍿", total: 1,    maintenance: 0 },
  { key: "ventilateur",  label: "Ventilateur",        icon: "🌀", total: 8,    maintenance: 0 },
  { key: "table",        label: "Table",              icon: "🪑", total: 30,   maintenance: 0 },
  { key: "chaise",       label: "Chaise",             icon: "🪑", total: 60,   maintenance: 0 }
];

window.CLIENTS = [
  "Notaire Cannes", "Fiducial", "Mairie d'Antibes", "Mairie de Roquebrune",
  "BNE", "Falafel", "Autre / Nouveau client"
];

window.SALONS = [
  "Festival du Film", "Yacht Show Cannes", "Yacht Show Monaco", "LIONS",
  "Plages Electro", "Festival Jazz Antibes", "MIPIM", "LUXPACK", "TaxFREE",
  "Client direct", "Autre"
];

window.VILLES = ["Cannes", "Monaco", "Antibes", "Roquebrune", "Nice", "Juan-les-Pins", "Autre"];

window.TYPES_EVENT = ["Salon professionnel", "Festival", "Événement privé", "Séminaire", "Inauguration", "Installation permanente", "Autre"];
