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
d'Azur) / quoi / quand**.

- **Produits de réappro** : café (nombre de capsules de **50 à illimité**), **bonbonnes
  d'eau**, **fontaine à eau**, et **machine à café** (Nespresso Zenius, Nespresso Gemini,
  Covim, Lavazza, machine à grains, machine à bar) — plus un champ « autre besoin ».
- **Créneaux horaires connectés** : pas de 30 min de **9h à minuit**. Un créneau **déjà
  réservé s'affiche « Réservé »** et ne peut pas être repris (deux clients ne peuvent pas
  prendre la même heure). Le planning est **par jour** : chaque jour repart à neuf, et un
  créneau **se libère** dès que la livraison est marquée **Livrée** (ou annulée) dans le
  tableau de bord.
- La demande arrive **en direct** dans le tableau de bord → onglet **« Réappro / Créneaux »**
  (📍 dans le menu), avec une **carte de la Côte d'Azur**, le planning du jour et la liste.
- Tu **assignes un livreur**, changes le statut, ou **crées la livraison en 1 clic**
  (elle bascule dans l'onglet « Livraisons » avec son bon PDF).
- L'équipe est **notifiée par email** à chaque demande, et le client reçoit une **confirmation**.
- Le message rappelle que vous restez **joignables par téléphone** pour les urgences.

> ⚠️ **Important — à faire une seule fois** : pour que les clients puissent envoyer une
> réservation **et voir les créneaux disponibles**, republie les règles de sécurité.
> Console Firebase → Realtime Database → **Règles** → colle le contenu de
> `firebase-rules.json` (en remplaçant `UID_1`/`UID_2` par vos deux UID comme pour
> l'installation) → **Publier**. Les blocs `reservations` et `slots` ont été ajoutés à ce
> fichier. Pense aussi à activer **Authentification anonyme** (Console Firebase →
> Authentication → Sign-in method → Anonyme), sans quoi l'affichage des créneaux pris ne
> fonctionnera pas. Sans ces étapes, l'équipe est quand même prévenue par email, mais la
> demande ne s'affiche pas sur la carte.
>
> 📞 Pense aussi à remplacer le numéro `+33 6 00 00 00 00` dans `reservation.html`
> (3 endroits) par ton vrai numéro.

> 📧 **Accusé de réception client (email propre)** : le client reçoit son propre
> accusé via un **modèle EmailJS dédié**. Crée un 2ᵉ modèle sur EmailJS (To = `{{to_email}}`,
> Subject = `{{subject}}`, Contenu = uniquement `{{message}}`) puis colle son ID dans
> `templateClient` (fichier `firebase-config.js`, recette complète en commentaire). Ainsi
> **le client reçoit uniquement son accusé** et **toi uniquement la demande**.

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
