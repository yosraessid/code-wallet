const { contextBridge, ipcRenderer } = require('electron');
const { store, saveData, loadData, deleteData } = require('../main/store');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  store: {
    get: (key) => {
      try {
        return loadData(key);
      } catch (error) {
        console.error('Erreur de lecture:', error);
        // Tentative de restauration depuis la sauvegarde
        const backup = loadData(`backup_${key}`);
        if (backup) {
          saveData(key, backup);
          return backup;
        }
        return null;
      }
    },
    set: (key, value) => {
      try {
        return saveData(key, value);
      } catch (error) {
        console.error('Erreur de sauvegarde:', error);
        // Sauvegarde de secours
        return saveData(`backup_${key}`, value);
      }
    },
    delete: (key) => {
      try {
        return deleteData(key);
      } catch (error) {
        console.error('Erreur de suppression:', error);
        return false;
      }
    }
  }
});
