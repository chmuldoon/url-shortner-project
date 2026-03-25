import { NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <span className="header-title">URL Shortener</span>
      <nav className="header-nav">
        <NavLink to="/create" className={({ isActive }) => (isActive ? 'active' : '')}>
          Create
        </NavLink>
        <NavLink to="/urls" className={({ isActive }) => (isActive ? 'active' : '')}>
          URLs
        </NavLink>
      </nav>
    </header>
  );
}
