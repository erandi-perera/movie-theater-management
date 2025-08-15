import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Calendar, Settings } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Film className="logo-icon" />
          <h1>CinemaMax</h1>
        </div>
        
        <nav className="navigation">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Film size={20} />
            Home
          </Link>
          <Link 
            to="/booking" 
            className={`nav-link ${isActive('/booking') ? 'active' : ''}`}
          >
            <Calendar size={20} />
            Book Tickets
          </Link>
          <Link 
            to="/admin" 
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            <Settings size={20} />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;