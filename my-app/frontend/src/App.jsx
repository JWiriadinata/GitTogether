import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects'; // /'post'
import Profile from './pages/Profile'; // '/me'
import NotFound from './pages/NotFound';
import Auth from './components/Auth';
import Navbar from './components/NavBar';
function App() {
  return (
    <Router>
        <Navbar /> 
        <div className='container' >
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/projects" element={<Auth><Projects /></Auth>} />
                <Route path="/profile" element={<Auth><Profile /></Auth>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    </Router>
  );
}

export default App;