# Synchronisation automatique vers Google Sheets — MIBEM QHSE

Ce guide te permet de connecter l'application à un Google Sheets **gratuitement**,
en 5 minutes, sans aucune compétence technique. À chaque fois que tu cliques sur
« 🔄 Synchroniser vers le tableau de bord » dans la Synthèse de fin de quart,
une nouvelle ligne sera automatiquement ajoutée pour chaque non-conformité détectée
durant le quart.

## Étape 1 — Créer le Google Sheets

1. Va sur https://sheets.google.com (connecte-toi avec un compte Google gratuit
   si besoin).
2. Crée un nouveau classeur, nomme-le par exemple **"MIBEM — Non-conformités"**.
3. Sur la première ligne (ligne 1), écris ces en-têtes de colonnes, dans cet
   ordre exact :
   ```
   Date | Quart | Heure | Ligne | Produit | Lot | Paramètre | Description | Niveau | Défaut | Quantité | Classe | Action immédiate | NC traitée | Cause | Contrôleur | Reçu le
   ```

## Étape 2 — Ajouter le script de réception

1. Dans ton Google Sheets, menu **Extensions → Apps Script**.
2. Supprime le code d'exemple (`function myFunction() {...}`) et colle exactement
   ceci à la place :

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = JSON.parse(e.postData.contents);
  var rows = data.non_conformites || [];

  if (rows.length === 0) {
    // Aucune NC ce quart : on ajoute quand même une ligne de synthèse simple
    sheet.appendRow([
      data.quart.date, data.quart.quart, "", "", "", "", "",
      "Aucune non-conformité ce quart", "", "", "", "", "", "", "",
      data.quart.visa || "", new Date()
    ]);
  } else {
    rows.forEach(function(nc) {
      sheet.appendRow([
        nc.date, nc.quart, nc.heure, nc.ligne, nc.produit, nc.lot, nc.parametre,
        nc.description, nc.niveau, nc.defaut, nc.quantite, nc.classeDefaut,
        nc.actionImmediate, nc.ncTraitee, nc.cause, nc.controleur, new Date()
      ]);
    });
  }

  return ContentService.createTextOutput("OK");
}
```

3. Clique sur l'icône 💾 (Enregistrer), donne un nom au projet si demandé
   (ex : "MIBEM Sync").

## Étape 3 — Déployer comme application web

1. En haut à droite, clique sur le bouton bleu **"Déployer"** → **"Nouveau déploiement"**.
2. À côté de "Sélectionner le type", clique sur l'icône ⚙️ → choisis **"Application Web"**.
3. Configure :
   - **Exécuter en tant que** : Moi (ton adresse Gmail)
   - **Qui a accès** : **Tout le monde** (important — sinon l'application ne
     pourra pas envoyer les données)
4. Clique **"Déployer"**.
5. Google va te demander d'autoriser le script (c'est ton propre script, sur
   ton propre compte — c'est normal et sans danger) : suis les étapes
   "Autoriser l'accès" → choisis ton compte → "Avancé" → "Accéder à [nom du
   projet] (non sécurisé)" → "Autoriser".
6. Une fenêtre affiche une **URL** qui ressemble à :
   ```
   https://script.google.com/macros/s/AKfycb...................../exec
   ```
   **Copie cette URL en entier.**

## Étape 4 — Configurer l'application MIBEM QHSE

1. Dans l'application (Windows ou Android), va dans **⚙️ Paramètres**.
2. Section **"📊 Synchronisation tableau de bord"**, colle l'URL copiée à
   l'étape précédente.
3. Clique **"💾 Enregistrer"**, puis **"🔧 Tester la connexion"**.
4. Retourne sur ton Google Sheets : une nouvelle ligne de test doit être apparue.
   Si oui, c'est en place ! Tu peux supprimer cette ligne de test.

## Utilisation au quotidien

À chaque fin de quart, dans l'onglet **Synthèse**, après avoir généré la synthèse,
clique sur **"🔄 Synchroniser vers le tableau de bord"** — toutes les
non-conformités du quart sont ajoutées automatiquement dans ton Google Sheets,
prêtes à être reliées à ton tableau de bord Excel existant (via importation,
ou en connectant directement Excel à ce Google Sheets).

## Si tu changes d'avis plus tard (Excel / SharePoint)

Si MIBEM passe un jour à Microsoft 365 avec licence Power Automate, le même
principe fonctionne avec un "flux instantané" Power Automate à la place du
script Google — dis-le moi le moment venu, je adapterai l'application en
quelques minutes (elle est faite pour qu'on puisse changer la destination
facilement, sans tout reconstruire).
