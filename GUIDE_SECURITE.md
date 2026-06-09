# 🔐 Sécuriser la base de données Firebase

Firebase t'a envoyé une alerte : *« règles non sécurisées »*. Cela veut dire que
**n'importe qui** connaissant l'adresse de ta base peut lire, modifier ou supprimer
tes données. Voici comment corriger ça **proprement**, sans rien casser.

Le principe :
- **Toi et ton frère** vous connectez avec un email + mot de passe → accès complet.
- **Le formulaire client** se connecte automatiquement en *anonyme* → il peut
  uniquement **déposer une nouvelle demande**, mais ne peut **rien lire** ni modifier.
- **Tout le reste** est bloqué.

---

## Étape 1 — Activer l'authentification

1. Va sur [console.firebase.google.com](https://console.firebase.google.com) → ton projet **eventpro**.
2. Menu **Authentication** → **Commencer**.
3. Onglet **Sign-in method** :
   - Active **E-mail/Mot de passe**.
   - Active aussi **Anonyme** (indispensable pour le formulaire client).
4. Onglet **Users** → **Ajouter un utilisateur** :
   - Crée **un compte pour toi** (ton email + un mot de passe).
   - Crée **un compte pour ton frère**.
   - Pour chaque compte, **copie l'identifiant `User UID`** affiché dans la liste
     (une longue suite de lettres/chiffres). Tu en as besoin à l'étape 2.

## Étape 2 — Publier les règles sécurisées

1. Menu **Realtime Database** → onglet **Règles**.
2. Remplace **tout** le contenu par celui du fichier **`firebase-rules.json`** (fourni dans le projet).
3. Dans ces règles, remplace `UID_1` et `UID_2` par **vos deux UID** (étape 1).
4. Clique sur **Publier**.

> Exemple : `"auth.uid === 'aB3xYz...'"` avec ton vrai UID à la place de `aB3xYz...`.

## Étape 3 — Activer la connexion dans l'app

1. Ouvre le fichier **`firebase-config.js`**.
2. Tout en bas, mets :
   ```js
   window.REQUIRE_AUTH = true;
   ```
3. Enregistre et recharge le tableau de bord : un **écran de connexion** apparaît.
   Connecte-toi avec l'email + mot de passe créés à l'étape 1.

C'est fait ✅ — l'alerte Firebase disparaît et tes données sont protégées.

---

## ⚠️ Important / dépannage

- **Ne mets `REQUIRE_AUTH = true` qu'APRÈS** avoir créé les comptes ET publié les
  règles. Sinon tu ne pourras pas te connecter.
- Si tu te retrouves bloqué : remets `window.REQUIRE_AUTH = false;` dans
  `firebase-config.js`, recharge, et reprends les étapes.
- **Mot de passe oublié** : sur l'écran de connexion, saisis ton email puis clique
  sur *« Réinitialiser par email »*.
- Le **formulaire client n'a pas besoin de compte** : il se connecte tout seul en
  anonyme. Vérifie juste que **Anonyme** est bien activé (étape 1).
- Pour **ajouter une 3ᵉ personne** plus tard : crée son compte (étape 1), récupère
  son UID, et ajoute-le dans les règles (`|| auth.uid === 'UID_3'` aux endroits où
  apparaissent déjà les UID).
