import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';

function FragmentsPage({ tags }) {
  // Liste dynamique de fragments (exemple)
  const [fragments, setFragments] = useState([
    { id: 1, title: 'Using hook state', code: 'const [count, setCount] = useState(0);', tags: [1] },
    { id: 2, title: 'For loop', code: 'for(let i=0; i<10; i++){ console.log(i); }', tags: [] },
    { id: 3, title: 'Arrow function', code: 'const add = (a, b) => a + b;', tags: [2, 3] }
  ]);

  // États pour le formulaire
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [editId, setEditId] = useState(null); // id du fragment en cours de modification
  const [selectedTags, setSelectedTags] = useState([]); // tags sélectionnés

  // Fonction pour ajouter ou modifier un fragment
  const addOrEditFragment = (e) => {
    e.preventDefault();
    if (title.trim() && code.trim()) {
      if (editId) {
        // Modification
        setFragments(fragments.map(frag =>
          frag.id === editId ? { ...frag, title: title, code: code, tags: selectedTags } : frag
        ));
        setEditId(null);
      } else {
        // Ajout
        setFragments([
          ...fragments,
          { id: Date.now(), title: title, code: code, tags: selectedTags }
        ]);
      }
      setTitle('');
      setCode('');
      setSelectedTags([]);
    }
  };

  // Préparer la modification
  const editFragment = (frag) => {
    setTitle(frag.title);
    setCode(frag.code);
    setEditId(frag.id);
    setSelectedTags(frag.tags || []);
  };

  // Fonction pour supprimer un fragment
  const deleteFragment = (id) => {
    setFragments(fragments.filter(frag => frag.id !== id));
    if (editId === id) {
      setEditId(null);
      setTitle('');
      setCode('');
      setSelectedTags([]);
    }
  };

  // Annuler la modification
  const cancelEdit = () => {
    setEditId(null);
    setTitle('');
    setCode('');
    setSelectedTags([]);
  };

  // Gérer la sélection des tags
  const handleTagChange = (tagId) => {
    setSelectedTags(selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId]
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Code Snippets</h2>
      {/* Formulaire d'ajout/modification */}
      <form onSubmit={addOrEditFragment} style={{ marginBottom: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
        <input
          type="text"
          placeholder="Snippet title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
          required
        />
        <input
          type="text"
          placeholder="Snippet code"
          value={code}
          onChange={e => setCode(e.target.value)}
          style={{ marginRight: '10px', padding: '5px', width: '300px' }}
          required
        />
        {/* Sélection des tags */}
        <div style={{ margin: '10px 0' }}>
          <span style={{ marginRight: '10px' }}>Tags:</span>
          {tags.length === 0 && <span style={{ color: '#888' }}>No tags available</span>}
          {tags.map(tag => (
            <label key={tag.id} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={() => handleTagChange(tag.id)}
              /> {tag.name}
            </label>
          ))}
        </div>
        <button type="submit" style={{ background: '#3333b2', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 15px', cursor: 'pointer' }}>
          {editId ? 'Update' : 'Add'}
        </button>
        {editId && (
          <button type="button" onClick={cancelEdit} style={{ marginLeft: '10px', background: '#aaa', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 15px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </form>
      {fragments.length === 0 && <p>No code snippets yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {fragments.map(frag => (
          <li key={frag.id} style={{ marginBottom: '20px', border: '1px solid #b288c0', borderRadius: '8px', padding: '10px' }}>
            <strong>{frag.title}</strong>
            <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>{frag.code}</pre>
            {/* Affichage des tags associés */}
            <div style={{ margin: '5px 0' }}>
              {frag.tags && frag.tags.length > 0 && (
                frag.tags.map(tagId => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? (
                    <span key={tagId} style={{ background: '#b288c0', color: 'white', borderRadius: '5px', padding: '2px 8px', marginRight: '5px', fontSize: '0.9em' }}>{tag.name}</span>
                  ) : null;
                })
              )}
            </div>
            <button onClick={() => editFragment(frag)} style={{ background: '#2980b9', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', marginRight: '8px' }}>Edit</button>
            <button onClick={() => deleteFragment(frag.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
FragmentsPage.propTypes = {
  tags: PropTypes.array.isRequired
};

function TagsPage({ tags, setTags }) {
  const [tagName, setTagName] = useState('');

  // Ajouter un tag
  const addTag = (e) => {
    e.preventDefault();
    if (tagName.trim()) {
      setTags([...tags, { id: Date.now(), name: tagName }]);
      setTagName('');
    }
  };

  // Supprimer un tag
  const deleteTag = (id) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tags</h2>
      {/* Formulaire d'ajout de tag */}
      <form onSubmit={addTag} style={{ marginBottom: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
        <input
          type="text"
          placeholder="Tag name"
          value={tagName}
          onChange={e => setTagName(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
          required
        />
        <button type="submit" style={{ background: '#3333b2', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 15px', cursor: 'pointer' }}>Add</button>
      </form>
      {tags.length === 0 && <p>No tags yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <li key={tag.id} style={{ marginRight: '10px', marginBottom: '10px', background: '#b288c0', color: 'white', borderRadius: '5px', padding: '5px 15px', display: 'flex', alignItems: 'center' }}>
            {tag.name}
            <button onClick={() => deleteTag(tag.id)} style={{ marginLeft: '8px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
TagsPage.propTypes = {
  tags: PropTypes.array.isRequired,
  setTags: PropTypes.func.isRequired
};

function InfoPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', background: '#fff', color: '#222' }}>
      <h2>Information</h2>
      <h3>App features</h3>
      <ul>
        <li>Add, edit, delete code snippets</li>
        <li>Associate tags to each snippet</li>
        <li>Add and delete tags</li>
        <li>Easy navigation between Snippets, Tags and Info</li>
        <li>Modern and minimal interface</li>
      </ul>
      <h3>Developer</h3>
      <p>Name: Essidy Osra<br/>Role: Code Wallet app developer</p>
      <h3>Data management</h3>
      <p>
        Code snippets and tags are stored locally on your computer. No data is sent to any external server. You keep full control over your information.
      </p>
    </div>
  );
}

function App() {
  // Les tags sont partagés entre FragmentsPage et TagsPage
  const [tags, setTags] = useState([
    { id: 1, name: 'React' },
    { id: 2, name: 'State' },
    { id: 3, name: 'Redux' }
  ]);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', color: '#222' }}>
      <Router>
        <nav style={{ background: '#b288c0', padding: '10px', display: 'flex', alignItems: 'center' }}>
          <Link to="/fragments" style={{ marginRight: '10px', color: 'white', textDecoration: 'none' }}>Snippets</Link>
          <Link to="/tags" style={{ marginRight: '10px', color: 'white', textDecoration: 'none' }}>Tags</Link>
          <Link to="/info" style={{ color: 'white', textDecoration: 'none', marginRight: 'auto' }}>Info</Link>
        </nav>
        <Routes>
          <Route path="/fragments" element={<FragmentsPage tags={tags} />} />
          <Route path="/tags" element={<TagsPage tags={tags} setTags={setTags} />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/" element={<FragmentsPage tags={tags} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
