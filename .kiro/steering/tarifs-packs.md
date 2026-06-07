# Tarifs & Packs — Events Café

Référence des packs et tarifs utilisés dans le formulaire client (`formulaire.html`).
Tous les prix sont **hors taxes (HT)**. Les prix de base des packs/machines sont
établis sur devis (à câbler ultérieurement dans le module devis du dashboard).

## Packs « clé en main »

| Pack | Contenu inclus | Notes |
|------|----------------|-------|
| **Pack Events — Base** (**240 € HT**) | 1 fontaine à eau + 1 bonbonne + 100 gobelets + 1 machine **Covim150** (kit 150 — 150 capsules + consommables) | Option : remplacer la Covim150 par une **Zenius200** → **+40 € HT** |
| **Pack Events — Complet** (**320 € HT**) | 1 fontaine à eau + 2 bonbonnes + 200 gobelets + 1 machine **Covim150** (kit 150 — 150 capsules + consommables) + 1 frigo table top | Option : remplacer la Covim150 par une **Zenius200** → **+40 € HT** |

## Machines à café (à l'unité, consommables inclus)

| Pack | Contenu inclus |
|------|----------------|
| **Zenius200** | Machine Nespresso Zenius + 200 capsules de café + touillettes & sucre |
| **Gemini400** | Machine Nespresso Gemini + café + consommables |
| **Lavazza150** | Machine Lavazza + kit 150 (150 capsules) + consommables |
| **Covim150** | Machine Covim + kit 150 (150 capsules) + consommables |

## Eau

| Pack | Contenu inclus |
|------|----------------|
| **Fontaine à eau (kit eau)** | 1 fontaine + 1 bonbonne + 100 gobelets |

## Options & suppléments (HT)

| Option | Prix HT |
|--------|---------|
| Mousseur à lait | +30 € |
| Bouilloire | +30 € |
| Assortiment de thés | +75 € |
| Fontaine à eau supplémentaire (kit eau : 1 bonbonne + 100 gobelets) | sur devis |
| Gobelets supplémentaires (lot 100) | +5,90 € |
| Bonbonne d'eau supplémentaire | **19,90 €** si une fontaine/pack est déjà pris · **23,90 €** si commandée seule |
| Kit consommables supplémentaire | sur devis |
| Chaise pliante | sur devis |
| Table pliante | sur devis |
| Ventilateur | sur devis |

## Types de location

- **Location ponctuelle** : un événement / salon → date de montage + date de démontage.
- **Location mensuelle** (bureau ou autre) : tournée récurrente → date de début, fréquence de tournée dans le mois, et date de fin (« jusqu'à quand »).

## Notes d'implémentation

- Les packs sont définis dans la constante `PACKS` et les options dans `ADDONS` (fichier `formulaire.html`).
- À la soumission, le formulaire envoie : `packs[]`, `addons[]`, `material{}` (id→qté) et `itemLabels{}` (id→libellé) pour que le dashboard affiche les libellés même sans correspondance dans le catalogue.
- L'option de remplacement Covim150 → Zenius200 est portée par le flag `swap` de chaque pack Events (`swapExtra = 40`).
