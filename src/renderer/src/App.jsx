import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FragmentsPage from './components/FragmentsPage.jsx';
import FragmentFormPage from './components/FragmentFormPage.jsx';
import TagsPage from './components/TagsPage.jsx';
import InfoPage from './components/InfoPage.jsx';
import CodeModal from './components/CodeModal.jsx';
import Header from './components/Header.jsx';
import './assets/app.css';

const Store = window.electron?.store;

function App() {
  const [fragments, setFragments] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [modalCode, setModalCode] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(() => {
    return Store?.get('darkMode') || false;
  });

  // Chargement initial depuis le store
  React.useEffect(() => {
    const storedFragments = Store?.get('fragments') || [];
    const storedTags = Store?.get('tags') || [];
    setFragments(storedFragments);
    setTags(storedTags);
  }, []);

  // Sauvegarde dans le store à chaque modification
  React.useEffect(() => {
    Store?.set('fragments', fragments);
  }, [fragments]);

  React.useEffect(() => {
    Store?.set('tags', tags);
  }, [tags]);

  React.useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    Store?.set('darkMode', darkMode);
  }, [darkMode]);

  // --- Raccourcis clavier globaux ---
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        window.location.hash = '#/form';
      }
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        window.location.hash = '#/tags';
      }
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        window.location.hash = '#/info';
      }
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openCodeModal = (code) => {
    setModalCode(code);
    setIsModalOpen(true);
  };

  const closeCodeModal = () => {
    setIsModalOpen(false);
    setModalCode('');
  };

  const addOrEditFragment = (fragmentData) => {
    setFragments(prevFragments => {
      const existingFragmentIndex = prevFragments.findIndex(frag => frag.id === fragmentData.id);
      const updatedFragments = existingFragmentIndex > -1
        ? prevFragments.map(frag => frag.id === fragmentData.id ? fragmentData : frag)
        : [...prevFragments, fragmentData];
      Store?.set('fragments', updatedFragments);
      return updatedFragments;
    });
  };

  const deleteFragment = (id) => {
    setFragments(prevFragments => {
      const updatedFragments = prevFragments.filter(frag => frag.id !== id);
      Store?.set('fragments', updatedFragments);
      return updatedFragments;
    });
  };

  const addTag = (tagData) => {
    if (!tagData || !tagData.name) return;
    setTags(prevTags => {
      const newTag = {
        id: Date.now(),
        name: tagData.name
      };
      const updatedTags = [...prevTags, newTag];
      Store?.set('tags', updatedTags);
      return updatedTags;
    });
  };

  const editTag = (updatedTag) => {
    setTags(prevTags => {
      const updatedTags = prevTags.map(tag => tag.id === updatedTag.id ? updatedTag : tag);
      Store?.set('tags', updatedTags);
      return updatedTags;
    });
  };

  const deleteTag = (id) => {
    setTags(prevTags => {
      const updatedTags = prevTags.filter(tag => tag.id !== id);
      Store?.set('tags', updatedTags);
      return updatedTags;
    });
    
    // Supprime également le tag des fragments qui l'utilisent
    setFragments(prevFragments => {
      const updatedFragments = prevFragments.map(fragment => ({
        ...fragment,
        tags: fragment.tags.filter(tagId => tagId !== id)
      }));
      Store?.set('fragments', updatedFragments);
      return updatedFragments;
    });
  };

  const navigateToEdit = (frag) => {
    // navigation à implémenter si besoin
  };

  const navigateToNewForm = () => {
    // navigation à implémenter si besoin
  };

  return (
    <Router>
      <div
        style={{ minHeight: '100vh', background: darkMode ? '#18191a' : '#f5f5f5', color: darkMode ? '#f5f5f5' : '#222' }}
        // Drag & Drop handler
        onDragOver={e => e.preventDefault()}
        onDrop={async e => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type === 'text/plain') {
            const text = await file.text();
            // Naviguer vers le formulaire avec le contenu du fichier
            window.location.hash = `#/form?code=${encodeURIComponent(text)}`;
          }
        }}
      >
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route
            path="/"
            element={<FragmentsPage fragments={fragments} tags={tags} openCodeModal={openCodeModal} navigateToEdit={navigateToEdit} navigateToNewForm={navigateToNewForm} />}
          />
          <Route
            path="/form"
            element={<FragmentFormPage tags={tags} onAddOrEditFragment={addOrEditFragment} onDeleteFragment={deleteFragment} />}
          />
          <Route
            path="/tags"
            element={<TagsPage tags={tags} onAddTag={addTag} onEditTag={editTag} onDeleteTag={deleteTag} fragments={fragments} />}
          />
          <Route
            path="/info"
            element={<InfoPage />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <CodeModal
          code={modalCode}
          isOpen={isModalOpen}
          onClose={closeCodeModal}
        />
      </div>
    </Router>
  );
}

export default App;