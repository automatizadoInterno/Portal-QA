import React from "react";
import styles from "./Testes.module.css";

const Testes = () => {
  return (
    <div className={`${styles.dashboard} animeLeft`}>
      <h1 className={styles.title}>Relatórios de Testes Automatizados</h1>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h2>API</h2>
        </div>
        <div className={styles.card}>
          <h2>WEB</h2>
        </div>
      </div>
    </div>
  );
};

export default Testes;
