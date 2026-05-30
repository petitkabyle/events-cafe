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
  pubkey:   "COLLE_TA_PUBLIC_KEY",     // EmailJS Public Key
  service:  "COLLE_TON_SERVICE_ID",    // ex: service_xxxxxxx
  template: "COLLE_TON_TEMPLATE_ID",   // ex: template_xxxxxxx
  email1:   "",                        // 1re adresse de réception (toi)
  name1:    "",                        // prénom associé (ex: Marc)
  email2:   "",                        // 2e adresse de réception (ton frère)
  name2:    ""                         // prénom associé (ex: Kevin)
};
