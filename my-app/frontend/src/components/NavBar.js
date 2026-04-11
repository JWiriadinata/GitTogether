import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', gap: '15px', padding: '10px', background: '#f4f4f4' }}>
      <Link to="/">Home</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
};

export default Navbar;