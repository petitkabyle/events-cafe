// ============================================================
//  EVENTS CAFÉ — Configuration Firebase (PARTAGÉE)
// ============================================================
//  👉 Remplace les valeurs ci-dessous par celles de TON projet
//     Firebase (voir GUIDE_INSTALLATION.md, étape 2).
//
//  Ce même fichier est utilisé par l'application de gestion
//  (index.html) ET par le formulaire client (formulaire.html),
//  ce qui garantit que TOUT arrive dans la même base cloud.
// ============================================================

const firebaseConfig = {
  apiKey:            "COLLE_TON_API_KEY_ICI",
  authDomain:        "ton-projet.firebaseapp.com",
  databaseURL:       "https://ton-projet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "ton-projet",
  storageBucket:     "ton-projet.appspot.com",
  messagingSenderId: "000000000000",
  appId:             "1:000000000000:web:xxxxxxxxxxxxxxxx"
};

// Ne touche pas en dessous ----------------------------------
window.EVENTS_CAFE_CONFIG = firebaseConfig;
