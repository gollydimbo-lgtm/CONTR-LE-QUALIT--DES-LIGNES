# Mises à jour automatiques — MIBEM QHSE

## ⚠️ Étape obligatoire : rendre le dépôt GitHub public

Pour que l'application (Windows et Android) puisse vérifier toute seule s'il existe
une nouvelle version, elle interroge l'API publique de GitHub. **Cela ne fonctionne
que si le dépôt est public.** Si le dépôt reste privé, les mises à jour automatiques
ne fonctionneront pas (l'application continuera de fonctionner normalement, elle
n'affichera simplement jamais de bandeau "nouvelle version disponible").

Comme ce projet ne contient aucune donnée confidentielle (juste le code de
l'application — aucun mot de passe, aucune donnée de contrôle qualité réelle),
il est recommandé de le rendre public :

1. Sur la page du dépôt → **Settings**
2. Tout en bas → **Danger Zone** → **Change visibility** → **Make public**

## Comment fonctionne la mise à jour, concrètement

- **Windows** : l'application vérifie automatiquement au démarrage (puis toutes les
  4 heures) s'il existe une nouvelle version publiée sur GitHub. Si oui, elle la
  télécharge en arrière-plan et propose de redémarrer pour l'installer — sans que
  tu aies quoi que ce soit à faire.
- **Android** : dans l'onglet **⚙️ Paramètres**, une section **🔄 Mises à jour**
  vérifie automatiquement au lancement de l'app s'il existe une nouvelle version.
  Si oui, un bouton **⬇️ Télécharger la mise à jour** apparaît — un tap télécharge
  et lance l'installation (Android demande une confirmation, c'est une protection
  du système, pas quelque chose qu'on peut supprimer en dehors du Play Store).

## Comment publier une nouvelle version à l'avenir

À chaque fois que tu obtiendras une nouvelle version de l'application de ma part :

1. Remplace le fichier **`www/index.html`** à la racine du dépôt par la nouvelle
   version (bouton crayon ✏️ → coller le nouveau contenu, ou "Add file" → "Upload
   files" en écrasant l'ancien).
2. Édite le fichier **`VERSION`** à la racine et augmente le numéro
   (ex : `1.1.0` → `1.2.0`).
3. Valide (« Commit changes »).

C'est tout ! Les deux workflows (`build-apk.yml` et `build-windows.yml`) se
relancent automatiquement, compilent les deux nouvelles versions (APK + EXE),
et les publient dans une nouvelle "Release" GitHub visible dans l'onglet
**Releases** de ton dépôt (sur la page principale, dans la colonne de droite,
ou à l'URL `https://github.com/TON-COMPTE/TON-DEPOT/releases`).

Toutes les applications déjà installées chez tes contrôleurs détecteront alors
automatiquement cette nouvelle version.

## Vérifier qu'une release a bien été publiée

Va sur `https://github.com/TON-COMPTE/TON-DEPOT/releases` — tu dois voir apparaître
une entrée du type "MIBEM QHSE v1.1.0" avec, en pièces jointes, le `.apk` et les
fichiers `.exe` Windows.
