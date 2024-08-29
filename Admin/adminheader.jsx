import React from 'react';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <button style={styles.menuButton}>
          <img
            src="https://via.placeholder.com/20"
            alt="Menu"
            style={styles.icon}
          />
        </button>
        <div style={styles.brand}>
          <img
            src="https://via.placeholder.com/30"
            alt="Brand Logo"
            style={styles.logo}
          />
          <span style={styles.brandName}>Flowbite</span>
        </div>
        <input
          type="text"
          placeholder="Search"
          style={styles.searchInput}
        />
      </div>
      <div style={styles.rightSection}>
        <button style={styles.newWidgetButton}>
          <span style={styles.plusIcon}>+</span> New Widget
        </button>
        <div style={styles.iconContainer}>
          <img
            src="https://via.placeholder.com/20"
            alt="Notifications"
            style={styles.icon}
          />
          <img
            src="https://via.placeholder.com/20"
            alt="Grid"
            style={styles.icon}
          />
          <img
            src="https://via.placeholder.com/30"
            alt="Profile"
            style={styles.profileIcon}
          />
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
  },
  logo: {
    borderRadius: '50%',
    marginRight: '10px',
  },
  brandName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#111',
  },
  searchInput: {
    width: '300px',
    padding: '5px 10px',
    borderRadius: '5px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    color: '#111',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  newWidgetButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '20px',
  },
  plusIcon: {
    marginRight: '5px',
    fontSize: '18px',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '20px',
    cursor: 'pointer',
  },
  profileIcon: {
    borderRadius: '50%',
    cursor: 'pointer',
  },
};

export default Navbar;
