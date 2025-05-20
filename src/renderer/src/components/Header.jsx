import { Link } from 'react-router-dom';
import { useState } from 'react'; // Importer useState si le mode sombre était géré ici
import PropTypes from 'prop-types';

function Header({
  // Passe les props nécessaires depuis App.jsx si elles étaient utilisées ici
  // Par exemple : darkMode, setDarkMode
}) {
  // Si tu avais la logique du mode sombre ici, remets-la
  // const [darkMode, setDarkMode] = useState(false);

  // Style pour le logo texte temporaire
  const logoStyle = {
    color: '#ffffff', // Texte blanc pour le logo
    fontSize: '1.6em', // Taille un peu plus grande
    fontWeight: 'bold',
    marginRight: '25px',
    textDecoration: 'none',
    letterSpacing: '0.5px' // Petit espacement pour le style
  };

  const navLinkStyle = {
    color: '#ffffff', // Texte blanc pour les liens
    textDecoration: 'none',
    fontSize: '1.1em', // Taille de texte un peu plus grande
    padding: '5px 10px', // Espacement autour du texte
    borderRadius: '4px', // Coins légèrement arrondis
    transition: 'background-color 0.3s ease' // Animation douce au survol
  };

  const navLinkHoverStyle = {
     backgroundColor: 'rgba(255, 255, 255, 0.2)' // Fond semi-transparent au survol
  };

  return (
    <nav style={{
      background: '#b288c0', // Couleur de ta charte graphique
      padding: '15px 25px', // Plus d'espacement
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Petite ombre pour la séparation
    }}>
      {/* Logo temporaire (texte) */}
      <Link to="/" style={logoStyle}>Code Wallet</Link>

      {/* Liens de navigation */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/fragments" style={navLinkStyle} onMouseOver={(e) => e.target.style.backgroundColor = navLinkHoverStyle.backgroundColor} onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>Snippets</Link>
        <Link to="/tags" style={{...navLinkStyle, marginLeft: '15px'}} onMouseOver={(e) => e.target.style.backgroundColor = navLinkHoverStyle.backgroundColor} onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>Tags</Link>
        <Link to="/info" style={{...navLinkStyle, marginLeft: '15px'}} onMouseOver={(e) => e.target.style.backgroundColor = navLinkHoverStyle.backgroundColor} onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>Info</Link>

        {/* Bouton mode sombre (si tu le remets un jour) */}
        {/* <button onClick={() => setDarkMode(!darkMode)} style={{ ... }}> */}
        {/* {darkMode ? 'Light mode' : 'Dark mode'} */}
        {/* </button> */}
      </div>
    </nav>
  );
}

// PropTypes si tu utilises la validation de props
// Header.propTypes = {
//   darkMode: PropTypes.bool.isRequired,
//   setDarkMode: PropTypes.func.isRequired,
// };

export default Header; 