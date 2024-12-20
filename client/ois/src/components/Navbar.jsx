import { Link } from 'react-router-dom'
import React from 'react';
import './Navbar.css'

function Navbar() {
  return (
    <nav className='navbar'>
        <div className="navbar-left">
    <a href="/" className="logo">
      HERE
    </a>
  </div>
  <div className="navbar-right">
    <ul className="nav-links">
      <li>
        <a href='/dashboard'>Home</a>
      </li>
      <li>
        <a href='#'>Profile</a>
      </li>
      <li>
        <a href='#'>Services</a>
      </li>
      <li>
      <Link to ='/register'>Register</Link>
      </li>
      <li>
      <Link to ='/login'>Login</Link>
      </li>
    </ul>
  </div>
  
    </nav>
  )
}

export default Navbar;
/*
<Link to ='/'>Home</Link>
        <Link to ='/register'>Register</Link>
        <Link to ='/login'>Login</Link>
        */