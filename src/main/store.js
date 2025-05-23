const Store = require('electron-store');
const path = require('path');
const os = require('os');

const schema = {
  fragments: {
    type: 'array',
    default: []
  },
  tags: {
    type: 'array',
    default: []
  },
  darkMode: {
    type: 'boolean',
    default: false
  }
};

// Configuration du store avec options de persistance améliorées
const store = new Store({
  name: 'code-wallet-data',
  schema,
  clearInvalidConfig: true,
  migrations: {
    '1.0.0': store => {
      // Migration pour assurer la compatibilité des données
      const fragments = store.get('fragments', []);
      const tags = store.get('tags', []);
      
      store.set('fragments', fragments);
      store.set('tags', tags);
    }
  },
  // Définir un chemin de stockage personnalisé qui persiste
  cwd: path.join(os.homedir(), '.code-wallet'),
  // Activer la sauvegarde automatique
  watch: true
});

// Fonction pour sauvegarder les données
const saveData = (key, data) => {
  try {
    store.set(key, data);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des données ${key}:`, error);
    return false;
  }
};

// Fonction pour charger les données
const loadData = (key) => {
  try {
    return store.get(key);
  } catch (error) {
    console.error(`Erreur lors du chargement des données ${key}:`, error);
    return null;
  }
};

// Fonction pour supprimer des données
const deleteData = (key) => {
  try {
    store.delete(key);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression des données ${key}:`, error);
    return false;
  }
};

module.exports = {
  store,
  saveData,
  loadData,
  deleteData
};
