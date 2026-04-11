import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default NotFound;