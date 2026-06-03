# Events Café — Guide d'installation (Firebase + mise en ligne)

Objectif : que toi et ton frère utilisiez la **même** appli en temps réel, et que
le **formulaire client** envoie ses demandes directement dans votre tableau.

Il y a **2 outils** :
- `index.html` — le tableau de bord (vous deux)
- `formulaire.html` — le formulaire (vos clients)

Les deux partagent `firebase-config.js`. **Tu ne configures Firebase qu'une fois.**

---

## Étape 1 — Créer un projet Firebase (gratuit, 5 min)

1. Va sur **https://console.firebase.google.com**
2. Connecte-toi avec un compte Google
3. **« Créer un projet »** → nom : `eventpro` → Continuer
4. Google Analytics : **désactive** → **Créer le projet**
5. Attends ~30 s puis **Continuer**

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
    ".read": true,
    ".write": true
  }
}
```

> ✅ **IMPORTANT — pourquoi une règle à la racine ?**
> L'application partage *plusieurs* types de données entre toi, ton frère et le
> formulaire client : `events`, `stock`, `hours`, `catalogue`, `clients`,
> `basePricing`, `drivers`, `deliveries`, `config`...
> Une règle à la **racine** (`.read`/`.write` au plus haut niveau) autorise **tous**
> ces nœuds d'un coup. Si tu listes les nœuds un par un, tout nœud oublié sera
> **bloqué silencieusement** : le voyant reste vert mais les données (ex: un nouveau
> client/tarif) ne se synchronisent pas sur l'autre appareil.
>
> ⚠️ Le mode test laisse la base ouverte (simple pour démarrer). Voir la section
> « Sécurité » en bas pour la fermer plus tard.

### 🔧 Tu as déjà installé l'app avant cette mise à jour ?

Si tes anciennes règles ne listaient que `events` et `stock`, les nouveautés
(clients, tarifs, livraisons…) **ne se synchronisent pas**. Corrige en 1 minute :

1. Console Firebase → **Realtime Database** → onglet **« Règles »**
2. Remplace tout par le bloc ci-dessus (`.read`/`.write` à la racine)
3. **Publier**
4. Recharge l'app sur le téléphone **et** l'ordinateur → tout se synchronise.

---

## Étape 3 — Récupérer tes clés

1. Icône **engrenage ⚙️ → Paramètres du projet**
2. Section **« Vos applications »** → clique sur l'icône **`</>`** (Web)
3. Surnom : `Events Café` → **Enregistrer l'application**
4. Firebase affiche un bloc `const firebaseConfig = { ... }` → **copie ces valeurs**

---

## Étape 4 — Coller tes clés

Ouvre **firebase-config.js** et remplace les valeurs par les tiennes :

```js
window.FIREBASE_CONFIG = {
  apiKey:            "AIza...",
  authDomain:        "eventpro.firebaseapp.com",
  databaseURL:       "https://eventpro-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "eventpro",
  storageBucket:     "eventpro.appspot.com",
  messagingSenderId: "1234567890",
  appId:             "1:1234:web:abcd"
};
```

> 📌 La ligne **databaseURL** est la plus importante (sans elle, pas de synchro).
> Édite ce fichier directement sur GitHub : ouvre-le → crayon ✏️ → colle → « Commit ».

---

## Étape 5 — Mettre en ligne (gratuit)

### Option A — GitHub Pages (déjà sur ton dépôt)
1. Sur `https://github.com/petitkabyle/events-cafe` → **Settings → Pages**
2. **Branch : main**, dossier **/ (root)** → **Save**
3. Après ~1 min, ton URL apparaît :
   - Tableau de bord : `https://petitkabyle.github.io/events-cafe/`
   - Formulaire client : `https://petitkabyle.github.io/events-cafe/formulaire.html`

### Option B — Netlify Drop
1. Va sur **https://app.netlify.com/drop**
2. Glisse-dépose le dossier → tu obtiens une URL instantanée.

---

## Étape 6 — Utilisation

- **Toi & ton frère** : ouvrez l'URL du tableau de bord. Créez/modifiez des
  événements, changez les statuts, gérez le stock. Tout se synchronise en direct.
- **Le bouton « 🔗 Lien formulaire »** (en haut) copie l'adresse du formulaire à
  envoyer aux clients.
- **Tes clients** : remplissent le formulaire → la demande apparaît chez vous.
- **Sur mobile** : ouvre l'URL → menu du navigateur → « Ajouter à l'écran d'accueil ».

### 📴 Mode hors-ligne (terrain, salons, livraisons)

L'application **fonctionne sans connexion** :
- Tu peux consulter le tableau de bord et **créer / modifier / supprimer** des
  événements, livraisons, heures, tarifs… même hors-ligne.
- Toutes tes modifications sont **enregistrées sur l'appareil** et placées dans
  une file d'attente.
- **Dès que la connexion revient**, tout est **envoyé automatiquement** et partagé
  avec ton frère (et inversement). Rien n'est perdu, même si tu fermes l'app.
- Un indicateur **« X en attente »** (en haut) et l'onglet **Configuration → Mode
  hors-ligne** montrent le nombre de changements pas encore synchronisés.

> ⚠️ Pour que l'app s'ouvre hors-ligne, il faut l'avoir **ouverte au moins une fois
> avec connexion** (le navigateur met alors l'app en cache). Idéal : « Ajouter à
> l'écran d'accueil » sur le téléphone.

---

## Sécurité (optionnel, à faire après le lancement)

Le mode test expire/laisse la base ouverte. Pour la protéger :
- active **Firebase Authentication** (email/mot de passe) et passe les règles à
  `".read": "auth != null"`, `".write": "auth != null"`,
- ou garde l'URL privée (ne la partage qu'avec ton frère et tes clients).

Dis-moi si tu veux que j'ajoute une page de connexion (mot de passe) — c'est faisable.

---

## Récap des fichiers

```
events-cafe/
├── index.html          ← tableau de bord (vous deux)
├── formulaire.html     ← formulaire client (à partager)
├── firebase-config.js  ← tes clés Firebase (à remplir)
├── README.md
└── GUIDE_INSTALLATION.md
```
