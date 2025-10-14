import React from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <nav>
        <ul className={styles.nav}>
          <li>
            <Link className={styles.linkContainer} to={"/"}>
              <span>
                <img src="assets/foguete.png" alt="" />
              </span>{" "}
              <p className={styles.navItem}>Deploys</p>
            </Link>
          </li>
          <li>
            <Link className={styles.linkContainer} to={"testes"}>
              <span>
                <img src="assets/frasco.png" alt="" />
              </span>{" "}
              <p className={styles.navItem}>
                Testes <br /> Automatizados
              </p>
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.outletContainer}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
