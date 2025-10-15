import React from "react";
import { Link } from "react-router-dom";
import styles from "./ServicosInternos.module.css";

const Email = () => {
  return (
    <div className={`${styles.dashboard} animeLeft`}>
      <h1 className={styles.title}>Serviços Internos</h1>
      <div className={styles.cardContainer}>
        <Link to={"relatorioDeploy"}>
          <div className={styles.card}>
            <h2>Email de Deploy</h2>
          </div>
        </Link>

        <Link to={"relatorioChamados"}>
          <div className={styles.card}>
            <h2>Feedback RUN</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Email;
