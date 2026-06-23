# Events Café — Gestion d'événements

Application web pour gérer tes prestations événementielles (calendrier, stock en
temps réel) **et** un formulaire client séparé. Tout est synchronisé entre toi,
ton frère et le formulaire grâce à **Firebase** (gratuit, temps réel).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Le tableau de bord (toi + ton frère) : calendrier, événements, stock, **livraisons** et **réappro/créneaux (carte Côte d'Azur)** |
| `formulaire.html` | Le formulaire de demande (devis) à partager aux clients |
| `reservation.html` | **NOUVEAU** — outil léger pour que les clients réservent un **créneau de livraison / réapprovisionnement** pendant les salons |
| `firebase-config.js` | Tes clés Firebase (à remplir **une seule fois**) |
| `firebase-rules.json` | Les règles de sécurité de la base (à publier dans Firebase) |
| `GUIDE_INSTALLATION.md` | **Commence ici** : le pas-à-pas complet |

## 🆕 Réservation de créneaux (réappro pendant les salons)

`reservation.html` est un 3ᵉ outil **indépendant et ultra-simple** à envoyer aux clients
sur place (QR code, SMS, email). En 30 secondes le client indique **qui / où (lieu Côte
d'Azur) / quoi (eau, café, gobelets…) / quand (créneau horaire)**, avec une option
« urgent ».

- La demande arrive **en direct** dans le tableau de bord → onglet **« Réappro / Créneaux »**
  (📍 dans le menu), avec une **carte de la Côte d'Azur**, le planning du jour et la liste.
- Tu **assignes un livreur**, changes le statut, ou **crées la livraison en 1 clic**
  (elle bascule dans l'onglet « Livraisons » avec son bon PDF).
- L'équipe est **notifiée par email** à chaque demande, et le client reçoit une **confirmation**.
- Le message rappelle que vous restez **joignables par téléphone** pour les urgences.

> ⚠️ **Important — à faire une seule fois** : pour que les clients puissent envoyer une
> réservation, republie les règles de sécurité. Console Firebase → Realtime Database →
> **Règles** → colle le contenu de `firebase-rules.json` (en remplaçant `UID_1`/`UID_2`
> par vos deux UID comme pour l'installation) → **Publier**. Le bloc `reservations` a été
> ajouté à ce fichier. Sans cette étape, l'équipe est quand même prévenue par email, mais
> la demande ne s'affichera pas sur la carte du tableau de bord.
>
> 📞 Pense aussi à remplacer le numéro `+33 6 00 00 00 00` dans `reservation.html`
> (3 endroits) par ton vrai numéro.

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
