import React, { useEffect, useState } from "react";
import styles from "./Relatorio.module.css";

export default function ChamadosSemana() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  // Carrega os dados da API
  useEffect(() => {
    fetch("/api/relatorioChamados")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else setError("Erro ao carregar dados");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar dados");
        setLoading(false);
      });
  }, []);

  // Trecho de loading/erro igual ao outro projeto
  if (loading) return <p className="loading"></p>;
  if (error)
    return (
      <p
        className="animeLeft"
        style={{
          color: "red",
        }}
      >
        {error}
      </p>
    );

  const { devMap, produtoMap } = data;

  // Monta o HTML do relatório para envio de email
  const montarHtml = () => {
    let html = `<h1>Chamados da Semana</h1>`;

    html += `<h2>Por Dev</h2><ul>`;
    Object.entries(devMap).forEach(([dev, states]) => {
      html += `<li><strong>${dev}</strong><ul>`;
      Object.entries(states).forEach(([state, count]) => {
        html += `<li>${state}: ${count}</li>`;
      });
      html += `</ul></li>`;
    });
    html += `</ul>`;

    html += `<h2>Por Produto</h2><ul>`;
    Object.entries(produtoMap).forEach(([produto, count]) => {
      html += `<li>${produto}: ${count} chamado(s)</li>`;
    });
    html += `</ul>`;

    return html;
  };

  // Função para enviar o email
  const handleSendEmail = async () => {
    setIsSending(true);
    setSendError(null);

    try {
      const html = montarHtml();
      const res = await fetch("/api/sendRelatorioChamados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          destinatario: "lucas.camargo@buonny.com.br",
          bcc: ["lucas.s.camargo2022@outlook.com"],
          assunto: "Relatório Semanal de Chamados",
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Erro desconhecido");

      alert("E-mail enviado com sucesso!");
    } catch (err) {
      console.error(err);
      setSendError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.btnEnviar}>
        <button
          onClick={handleSendEmail}
          disabled={isSending || loading || !data}
        >
          {isSending ? <p className="loading"></p> : "Enviar E-mail"}
        </button>
        {sendError && <p className={styles.error}>Erro: {sendError}</p>}
      </div>

      <h1 className={styles.title}>Chamados da Semana</h1>

      <section className={styles.devSection}>
        <h2>Por Dev</h2>
        {Object.entries(devMap).map(([dev, states]) => (
          <div key={dev} className={styles.card}>
            <h3>{dev}</h3>
            <ul>
              {Object.entries(states).map(([state, count]) => (
                <li key={state}>
                  <span className={styles.state}>{state}</span>: {count}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.produtoSection}>
        <h2>Por Produto</h2>
        <div className={styles.produtoGrid}>
          {Object.entries(produtoMap).map(([produto, count]) => (
            <div key={produto} className={styles.card}>
              <h3>{produto}</h3>
              <p>{count} chamado(s)</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
