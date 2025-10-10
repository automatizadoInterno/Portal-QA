import React from "react";
import styles from "./Testes.module.css";

const Testes = () => {
  return (
    <div className={`${styles.dashboard} animeLeft`}>
      <h1 className={styles.title}>Relatórios de Testes Automatizados</h1>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <a
            href="https://automatizadointerno.github.io/relatorios-api/"
            target="blank"
          >
            {" "}
            <h2>API</h2>
            <p>Relatórios dos ultimos testes de API executados via Pipeline</p>
          </a>
        </div>
        <div className={styles.card}>
          <h2>WEB</h2>
          <p>Relatórios dos ultimos testes de API executados via Pipeline</p>
        </div>
      </div>
    </div>
  );
};

export default Testes;
