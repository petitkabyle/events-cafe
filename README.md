# Events Café — Gestion d'événements

Application web pour gérer tes prestations événementielles (calendrier, stock en
temps réel) **et** un formulaire client séparé. Tout est synchronisé entre toi,
ton frère et le formulaire grâce à **Firebase** (gratuit, temps réel).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Le tableau de bord (toi + ton frère) : calendrier, événements, stock |
| `formulaire.html` | Le formulaire de demande à partager aux clients |
| `firebase-config.js` | Tes clés Firebase (à remplir **une seule fois**) |
| `GUIDE_INSTALLATION.md` | **Commence ici** : le pas-à-pas complet |

## Comment ça marche

1. Un client remplit `formulaire.html` → sa demande arrive **automatiquement** dans
   ton tableau de bord (statut « confirmé »).
2. Toi et ton frère ouvrez la **même URL** (`index.html`) : toute modification
   (statut, matériel, nouvel événement) est visible **en temps réel** des deux côtés.
3. Le **stock** se recalcule tout seul : le matériel des événements non « rendus »
   est compté comme loué, donc indisponible.

## Mise en route rapide

1. Crée un projet **Firebase** gratuit + active **Realtime Database** (5 min).
2. Colle tes clés dans `firebase-config.js`.
3. Mets le dossier en ligne (GitHub Pages — déjà prêt ici, ou Netlify Drop).
4. Partage l'URL `…/` (tableau de bord) avec ton frère et `…/formulaire.html`
   avec tes clients.

Tout est détaillé dans **GUIDE_INSTALLATION.md**.

> Sans Firebase configuré, l'app fonctionne en « mode local / démo » pour que tu
> puisses voir le rendu — mais les données ne sont alors pas partagées.

## Pourquoi Firebase et pas Google Sheets ?

L'API Google Sheets nécessite une configuration payante/complexe pour l'écriture.
Firebase Realtime Database est **gratuit** (jusqu'à ~100 connexions simultanées et
1 Go), **instantané**, et parfait pour un usage à deux + formulaire client.


## 📱 Sur téléphone

L'app est responsive et **installable** (icône sur l'écran d'accueil, plein écran).
Voir le guide dédié : **GUIDE_TELEPHONE.md**.
- iPhone (Safari) : Partager → « Sur l'écran d'accueil »
- Android (Chrome) : menu ⋮ → « Installer l'application »

Toi et ton frère pouvez l'installer chacun : les données restent synchronisées en
temps réel via Firebase.
