const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 860,
    minWidth: 380,
    minHeight: 600,
    icon: path.join(__dirname, 'app', 'icon.png'),
    backgroundColor: '#f3f1ea',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: false
    }
  });
  mainWindow = win;

  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Menu minimal (Fichier / Affichage / Aide)
  const template = [
    {
      label: 'Fichier',
      submenu: [
        { role: 'reload', label: 'Recharger' },
        { type: 'separator' },
        { role: 'quit', label: 'Quitter' }
      ]
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'zoomIn', label: 'Zoom +' },
        { role: 'zoomOut', label: 'Zoom -' },
        { role: 'resetZoom', label: 'Zoom 100%' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' },
        { role: 'toggleDevTools', label: 'Outils développeur' }
      ]
    },
    {
      label: 'Aide',
      submenu: [
        {
          label: 'Vérifier les mises à jour',
          click: () => {
            autoUpdater.checkForUpdatesAndNotify().catch(() => {
              dialog.showMessageBox(win, {
                title: 'Mises à jour',
                message: "Impossible de vérifier les mises à jour (connexion internet requise).",
                type: 'warning'
              });
            });
          }
        },
        {
          label: 'À propos de MIBEM QHSE',
          click: () => {
            dialog.showMessageBox(win, {
              title: 'MIBEM COMPANY — Contrôle Qualité',
              message: 'MIBEM QHSE — Contrôle & auto-contrôle des lignes',
              detail: 'Application de contrôle qualité pour les lignes de conditionnement MIBEM COMPANY.\nVersion ' + app.getVersion(),
              type: 'info'
            });
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // Ouvrir les liens externes dans le navigateur par défaut, pas dans l'appli
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

/* ===================== Mises à jour automatiques (electron-updater + GitHub Releases) ===================== */
function setupAutoUpdater() {
  autoUpdater.on('update-available', (info) => {
    if (mainWindow) {
      dialog.showMessageBox(mainWindow, {
        title: 'Mise à jour disponible',
        message: `Une nouvelle version (${info.version}) de MIBEM QHSE est disponible.`,
        detail: 'Elle va être téléchargée en arrière-plan. Vous serez averti quand elle sera prête à être installée.',
        type: 'info'
      });
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    if (!mainWindow) return;
    dialog.showMessageBox(mainWindow, {
      title: 'Mise à jour prête',
      message: `La version ${info.version} a été téléchargée.`,
      detail: 'Redémarrer maintenant pour l\'installer ? Vous pouvez aussi continuer à travailler et redémarrer plus tard.',
      type: 'question',
      buttons: ['Redémarrer maintenant', 'Plus tard'],
      defaultId: 0,
      cancelId: 1
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on('error', (err) => {
    console.error('Erreur de mise à jour automatique :', err);
  });

  // Vérifie au démarrage, puis toutes les 4 heures
  autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  }, 4 * 60 * 60 * 1000);
}

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

