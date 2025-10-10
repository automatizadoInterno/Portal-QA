import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul>
          <Link to={"/"}>
            <li className={styles.logo}>Portal QA</li>
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
