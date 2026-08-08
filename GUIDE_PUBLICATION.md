# MIBEM QHSE Contrôle — Application Android

Ce dossier contient le projet source complet (Capacitor + Android) de l'application
de contrôle qualité MIBEM COMPANY. Il est prêt à être compilé en fichier `.apk`
(installable directement sur un téléphone) ou en `.aab` (format exigé par le Play Store).

**Pourquoi ce n'est pas déjà un .apk tout fait ?**
Compiler une application Android nécessite le "SDK Android" et l'outil "Gradle",
des composants distribués uniquement par les serveurs de Google/Gradle. L'environnement
dans lequel Claude a préparé ce projet n'a pas accès à ces serveurs — c'est une limite
technique du sandbox, pas du projet lui-même. Le code fourni ici est complet et correct ;
il ne manque que l'étape finale de compilation, que vous pouvez faire gratuitement
de deux façons (voir ci-dessous), sans rien installer sur votre PC si vous choisissez
l'option GitHub Actions.

---

## Option A — Compilation automatique et gratuite via GitHub Actions (recommandé)

Aucune installation nécessaire sur votre ordinateur. Il vous faut juste un compte
GitHub gratuit (https://github.com/signup).

1. Créez un nouveau dépôt (repository) sur GitHub, par exemple nommé `mibem-qhse-app`.
   Laissez-le **public** ou **privé**, peu importe (Actions fonctionne dans les deux cas
   avec un compte gratuit).
2. Sur votre ordinateur, ouvrez un terminal dans ce dossier (`capacitor-app`) et tapez :
   ```
   git init
   git add .
   git commit -m "Premier envoi du projet MIBEM QHSE"
   git branch -M main
   git remote add origin https://github.com/VOTRE-NOM-UTILISATEUR/mibem-qhse-app.git
   git push -u origin main
   ```
   (Remplacez l'URL par celle de votre propre dépôt, visible sur la page GitHub
   après sa création.)
3. Sur la page de votre dépôt GitHub, cliquez sur l'onglet **"Actions"**.
   Un workflow nommé **"Build Android APK (MIBEM QHSE)"** se lance automatiquement
   (comptez 3 à 6 minutes).
4. Une fois terminé (coche verte ✅), cliquez sur le run terminé, puis tout en bas
   de la page dans la section **"Artifacts"**, téléchargez **`MIBEM-QHSE-debug-apk`**.
   C'est un fichier `.zip` qui contient votre `.apk` — dézippez-le.
5. Transférez ce `.apk` sur un téléphone Android (par WhatsApp, e-mail, câble USB...),
   ouvrez-le, autorisez "Installer des applications inconnues" si demandé, et installez.

Chaque fois que vous modifierez le projet et referez un `git push`, une nouvelle
version sera compilée automatiquement.

---

## Option B — Compilation locale avec Android Studio (si vous préférez tout faire chez vous)

1. Téléchargez et installez **Android Studio** (gratuit) : https://developer.android.com/studio
2. Ouvrez Android Studio → **"Open"** → sélectionnez le dossier `capacitor-app/android`.
3. Laissez Android Studio télécharger les composants nécessaires au premier lancement
   (barre de progression en bas, 5-15 minutes selon votre connexion).
4. Menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
5. Le fichier `.apk` généré se trouve dans `android/app/build/outputs/apk/debug/`.

---

## Pour publier sur le Google Play Store

Une fois que vous avez un `.apk` ou `.aab` fonctionnel et testé sur un vrai téléphone :

1. **Créer un compte développeur Google Play** : https://play.google.com/console/signup
   (frais unique de 25 USD, à vie).
2. **Générer une clé de signature** (obligatoire pour publier) :
   ```
   keytool -genkey -v -keystore mibem-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mibem
   ```
   Gardez ce fichier `.jks` et son mot de passe en lieu très sûr : il est indispensable
   pour toutes les futures mises à jour de l'application.
3. **Configurer la signature** dans `android/app/build.gradle` (section `signingConfigs`),
   ou plus simple : dans Android Studio, **Build → Generate Signed Bundle / APK**,
   suivez l'assistant avec votre fichier `.jks`. Choisissez **"Android App Bundle (.aab)"**
   — c'est le format exigé par le Play Store depuis 2021 (pas le `.apk`).
4. Sur la Play Console : créez une nouvelle application, remplissez la fiche
   (nom, description, catégorie, captures d'écran, icône — déjà générée dans ce projet),
   répondez au questionnaire de classification du contenu, ajoutez une **politique de
   confidentialité** (obligatoire même pour une app interne — un simple document en ligne
   expliquant que l'app ne collecte aucune donnée personnelle suffit ici, puisque tout
   reste sur l'appareil).
5. Téléversez le fichier `.aab` signé dans la section "Production" (ou "Test interne"
   pour un déploiement limité à l'équipe MIBEM d'abord — recommandé).
6. Google examine l'application (habituellement 1 à 7 jours) avant publication.

**Conseil** : pour un usage strictement interne à MIBEM COMPANY (comme c'est le cas ici),
vous pouvez éviter tout le processus Play Store et distribuer le `.apk` directement à
vos contrôleurs qualité par WhatsApp/e-mail — c'est plus rapide et évite les frais et
délais de révision. Le Play Store devient utile si vous voulez une distribution plus
large, des mises à jour automatiques, ou une meilleure image professionnelle.

---

## Personnaliser l'application avant de compiler

- **Nom de l'application / icône / couleurs** : déjà configurés aux couleurs MIBEM
  (bordeaux/or) avec votre logo.
- **Contenu de l'application** : le fichier `www/index.html` est une copie de
  l'application HTML. Si vous obtenez une nouvelle version de Claude, remplacez
  simplement ce fichier puis relancez `npx cap sync android` avant de recompiler.
- **Numéro de version** : modifiez `versionCode` et `versionName` dans
  `android/app/build.gradle` avant chaque nouvelle publication sur le Play Store
  (Google exige un `versionCode` toujours croissant).
