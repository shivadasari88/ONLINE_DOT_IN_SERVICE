import { Link } from 'react-router-dom';
import React, { useState } from 'react'; // ✅ Fixed missing import
import Logo from "../Assets/Logo.svg";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false); // ✅ Fixed useState

  const menuOptions = [
    { text: "Home", icon: <HomeIcon />, link: "/" },
    { text: "Dashboard", icon: <InfoIcon />, link: "/dashboard" },
    { text: "ProfilePage", icon: <CommentRoundedIcon />, link: "/profilepage" },
    { text: "Register", icon: <PhoneRoundedIcon />, link: "/register" },
    { text: "Login", icon: <ShoppingCartRoundedIcon />, link: "/login" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-logo-container">
        <img src={Logo} alt="Logo" />
      </div>

      {/* ✅ Desktop Navigation Links */}
      <div className="navbar-links-container">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profilepage">Profile</Link>
        <Link to="#">Services</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>

      {/* ✅ Mobile Menu Icon */}
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>

      {/* ✅ Mobile Sidebar Navigation (Drawer) */}
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component={Link} 
                  to={item.link}
                  onClick={() => setOpenMenu(false)} // ✅ Close menu after clicking
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
}

export default Navbar;
