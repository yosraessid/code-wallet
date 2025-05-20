import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Fragments from './pages/Fragments';
import Form from './pages/Form';
import Tags from './pages/Tags';
import Info from './pages/Info';

const App = () => {
  const [fragments, setFragments] = useState([]);
  const [tags, setTags] = useState([]);
  const [stats, setStats] = useState({
    fragments: 0,
    tags: 0,
    databaseSize: 0
  });

  // Fonction pour sauvegarder un fragment
  const saveFragment = (fragment) => {
    if (fragment === null) {
      // Suppression
      setFragments(prev => prev.filter(f => f.id !== fragment.id));
    } else {
      // Ajout ou mise à jour
      const updatedFragments = [...fragments];
      const index = updatedFragments.findIndex(f => f.id === fragment.id);
      if (index !== -1) {
        updatedFragments[index] = fragment;
      } else {
        updatedFragments.push({
          ...fragment,
          id: Date.now()
        });
      }
      setFragments(updatedFragments);
    }
    updateStats();
  };

  // Fonction pour mettre à jour les statistiques
  const updateStats = () => {
    const fragmentTags = fragments.flatMap(f => f.tags || []);
    const uniqueTags = [...new Set(fragmentTags)];
    const totalTags = uniqueTags.length;
    const totalFragments = fragments.length;
    
    // Estimation de la taille de la base de données
    const databaseSize = fragments.reduce((acc, f) => 
      acc + (f.title.length + f.code.length + (f.tags || []).join(',').length), 0) / 1024;

    setStats({
      fragments: totalFragments,
      tags: totalTags,
      databaseSize: Math.round(databaseSize * 100) / 100
    });
  };

  // Fonction pour filtrer les fragments par tag
  const filterByTag = (tag) => {
    setFragments(prev => prev.filter(f => (f.tags || []).includes(tag)));
  };

  // Effet pour initialiser les tags uniques
  useEffect(() => {
    const uniqueTags = [...new Set(fragments.flatMap(f => f.tags || []))];
    setTags(uniqueTags);
  }, [fragments]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/fragments" element={
            <Fragments
              fragments={fragments}
              onEdit={(fragment) => saveFragment(fragment)}
              onInfo={(fragment) => console.log('Info:', fragment)}
            />
          } />
          
          <Route path="/tags" element={
            <Tags
              tags={tags}
              onTagClick={filterByTag}
            />
          } />

          <Route path="/new" element={
            <Form
              onSubmit={saveFragment}
              onCancel={() => navigate('/fragments')}
            />
          } />

          <Route path="/edit/:id" element={
            <Form
              fragment={fragments.find(f => f.id === parseInt(params.id))}
              onSubmit={saveFragment}
              onCancel={() => navigate('/fragments')}
            />
          } />

          <Route path="/info" element={
            <Info stats={stats} />
          } />

          <Route path="/" element={<Navigate to="/fragments" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
