# ☕ Events Café — Guide d'installation

Ton système est composé de **2 outils connectés à la même base cloud** :

| Fichier | Pour qui ? | Rôle |
|---|---|---|
| **index.html** | Toi + ton frère | L'application de gestion (calendrier, événements, stock, demandes) |
| **formulaire.html** | Tes clients | Le formulaire de demande (fichier séparé) |

Les deux partagent **firebase-config.js** et **data.js**. Quand un client remplit le formulaire, sa demande arrive **automatiquement** dans l'onglet « Demandes » de l'app. Quand toi ou ton frère modifiez quelque chose, **l'autre le voit en temps réel**. 🔥

> 💡 **Pourquoi ça marche enfin à deux ?** Les données ne sont plus enregistrées sur ton PC : elles vivent dans **Firebase** (le cloud gratuit de Google). Tout le monde lit/écrit au même endroit.

---

## Étape 1 — Créer un projet Firebase (gratuit, 5 min)

1. Va sur **https://console.firebase.google.com**
2. Connecte-toi avec un compte Google
3. Clique **« Créer un projet »** → nom : `events-cafe` → continue
4. Google Analytics : **désactive** (pas besoin) → **Créer le projet**
5. Attends ~30 s, puis **Continuer**

---

## Étape 2 — Activer la base de données temps réel

1. Menu de gauche → **« Realtime Database »**
2. **« Créer une base de données »**
3. Emplacement : **europe-west1** (Belgique) → Suivant
4. Choisis **« Démarrer en mode test »** → **Activer**
5. Onglet **« Règles »**, colle ceci puis **Publier** :

```json
{
  "rules": {
    "events":   { ".read": true, ".write": true },
    "demandes": { ".read": true, ".write": true }
  }
}
```

> ⚠️ Mode ouvert = simple pour démarrer. Pour sécuriser plus tard, voir la section « Sécurité » en bas.


---

## Étape 3 — Récupérer tes clés

1. En haut à gauche : **icône engrenage ⚙️ → Paramètres du projet**
2. Descends jusqu'à **« Vos applications »**
3. Clique sur l'icône **`</>`** (Web)
4. Surnom : `Events Café Web` → **Enregistrer l'application**
5. Firebase affiche un bloc `const firebaseConfig = { ... }` → **copie les valeurs**

---

## Étape 4 — Coller tes clés dans le projet

Ouvre **firebase-config.js** et remplace les valeurs par les tiennes :

```js
const firebaseConfig = {
  apiKey:            "AIza............",
  authDomain:        "events-cafe.firebaseapp.com",
  databaseURL:       "https://events-cafe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "events-cafe",
  storageBucket:     "events-cafe.appspot.com",
  messagingSenderId: "123456789012",
  appId:             "1:1234...:web:abcd..."
};
```

> 📌 La ligne **databaseURL** est la plus importante. Vérifie qu'elle correspond bien à ta base.

Un seul fichier à modifier : il est utilisé **à la fois** par l'app et par le formulaire.

---

## Étape 5 — Mettre en ligne (gratuit) pour partager avec ton frère

Tu as deux options simples et gratuites :

### Option A — Netlify Drop (la plus rapide, sans compte technique)
1. Va sur **https://app.netlify.com/drop**
2. Glisse-dépose **tout le dossier `events-cafe`**
3. En quelques secondes tu obtiens une URL type `https://events-cafe-xyz.netlify.app`
4. Ton app de gestion = `…netlify.app/index.html`
5. Ton formulaire client = `…netlify.app/formulaire.html`

### Option B — GitHub Pages
1. Crée un dépôt GitHub, dépose les fichiers du dossier `events-cafe`
2. **Settings → Pages → Branch : main → Save**
3. Ton URL : `https://ton-pseudo.github.io/events-cafe/`

> Je peux pousser le projet sur GitHub pour toi (voir en bas).


---

## Étape 6 — Utilisation au quotidien

### Toi & ton frère (app de gestion)
- **Tableau de bord** : événements de la semaine, stock en alerte, demandes à traiter
- **Calendrier** : vue mensuelle, repère les chevauchements d'un coup d'œil
- **Événements** : recherche, filtre par statut, change le statut (À préparer → Livré → Récupéré) directement dans le tableau
- **Stock** : se recalcule tout seul (« Loué » = somme du matériel des événements **Livré**)
- **Demandes** : chaque demande client arrive ici → bouton 📅 pour la **transférer dans le planning** en un clic

### Tes clients (formulaire)
- Tu leur envoies le lien `…/formulaire.html` (bouton « 🔗 Copier le lien du formulaire » dans l'onglet Demandes)
- Ils remplissent → la demande tombe dans ton app

### Sur mobile
- Ouvre l'URL dans le navigateur → menu ⋮ → **« Ajouter à l'écran d'accueil »** : ça s'utilise comme une vraie app.

---

## Modifier ton stock / tes clients

Tout est centralisé dans **data.js** :
- `MATERIEL` : ajoute/retire du matériel, change `total` et `maintenance`
- `CLIENTS`, `SALONS`, `VILLES`, `TYPES_EVENT` : tes listes déroulantes

---

## Sécurité (optionnel, recommandé plus tard)

Le mode test laisse la base ouverte. Pour la fermer après ton lancement, tu peux :
- activer **Firebase Authentication** (email/mot de passe) et restreindre les règles à `auth != null`,
- ou garder une URL privée que tu ne partages qu'avec ton frère et tes clients.

Dis-moi si tu veux que je t'ajoute l'authentification (connexion par mot de passe).

---

## Récap des fichiers

```
events-cafe/
├── index.html          ← app de gestion (toi + ton frère)
├── formulaire.html     ← formulaire client (à partager)
├── app.js              ← logique de l'app
├── form.js             ← logique du formulaire
├── data.js             ← ton matériel / clients (modifiable)
├── firebase-config.js  ← tes clés Firebase (à remplir)
├── style.css           ← thème Events Café (marron / blanc / noir)
└── GUIDE_INSTALLATION.md
```

Bon démarrage ! ☕🚀
