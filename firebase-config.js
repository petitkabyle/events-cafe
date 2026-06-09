// ============================================================
//  EVENTS CAFÉ — Configuration Firebase (PARTAGÉE)
// ============================================================
//  👉 Remplace les valeurs ci-dessous par celles de TON projet
//     Firebase (voir GUIDE_INSTALLATION.md).
//
//  Ce même fichier est utilisé par le tableau de bord (index.html)
//  ET par le formulaire client (formulaire.html). Ainsi, toute
//  demande envoyée par un client arrive automatiquement dans
//  ton tableau, et toi + ton frère voyez tout en temps réel.
// ============================================================

window.FIREBASE_CONFIG = {
apiKey: "AIzaSyD2PH3pKwKAhGYdk5tFMOf1KcDPQeihTAw",
  authDomain: "eventpro-7c85a.firebaseapp.com",
  databaseURL: "https://eventpro-7c85a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eventpro-7c85a",
  storageBucket: "eventpro-7c85a.firebasestorage.app",
  messagingSenderId: "650169758409",
  appId: "1:650169758409:web:60d5606939dbbf11b6d318"
};

// ============================================================
//  📧 NOTIFICATIONS PAR EMAIL (EmailJS)
// ============================================================
//  Renseigne ici les MÊMES valeurs que dans l'onglet "Réglages"
//  du tableau de bord. C'est la méthode la plus fiable : ainsi
//  le FORMULAIRE client peut envoyer l'email même quand le
//  tableau de bord est fermé (et sans dépendre des règles de
//  sécurité Firebase).
//
//  👉 Remplace les 5 valeurs "COLLE_..." ci-dessous, puis
//     enregistre le fichier. (Si tu laisses "COLLE_", c'est
//     ignoré et l'app retombe sur la config Firebase/Réglages.)
// ============================================================
window.EMAILJS_CONFIG = {
  pubkey:   "FkbFqxL3Y14WCz_MB",        // EmailJS Public Key
  service:  "service_5ljac5p",          // Service ID
  template: "template_9c71r47",         // Template ID
  email1:   "soane.mansouri@gmail.com", // 1re adresse de réception (toi)
  name1:    "Soane Mansouri",           // prénom associé
  email2:   "",                          // 2e adresse (ton frère) — à configurer plus tard
  name2:    ""                           // prénom associé
};


// ============================================================
//  🔐 SÉCURITÉ — Authentification (recommandé)
// ============================================================
//  Par défaut, l'app fonctionne SANS connexion (REQUIRE_AUTH = false).
//  Pour sécuriser ta base de données (et faire disparaître l'alerte
//  Firebase "règles non sécurisées"), passe cette valeur à TRUE
//  APRÈS avoir suivi ces 3 étapes (voir aussi GUIDE_SECURITE.md) :
//
//   1) Console Firebase → Authentication → "Commencer"
//        • Active "E-mail/Mot de passe"
//        • Active aussi "Anonyme" (pour le formulaire client)
//        • Onglet "Users" → Ajoute un compte pour toi et ton frère
//          (note bien chaque UID affiché)
//   2) Console Firebase → Realtime Database → Règles
//        • Colle le contenu de firebase-rules.json
//        • Remplace UID_1 / UID_2 par VOS deux UID, puis "Publier"
//   3) Reviens ici et mets :  window.REQUIRE_AUTH = true;
//        • Recharge le tableau de bord → un écran de connexion apparaît.
//
//  ⚠️ Tant que tu n'as pas créé les comptes + publié les règles,
//     laisse REQUIRE_AUTH = false (sinon tu ne pourras pas te connecter).
// ============================================================
window.REQUIRE_AUTH = false;
