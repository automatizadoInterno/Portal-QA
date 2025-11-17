import { useState, useEffect } from "react";
import styles from "./Relatorio.module.css";

function generateEmailHtml(items) {
  const cssStyles = `
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
       background-color: #f3f3f3; 
    }
    .container {
      max-width: 1100px;
      margin: 18px auto;
    }
    .title {
      color: #ff420a;
      text-align: center;
    }
    .card {
      background: #fff;
      border-radius: 10px;
      padding: 18px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .table th {
      color: #fff;
      background-color: #ff420a;
    }
    .table th,
    .table td {
      border: 1px solid black;
      padding: 12px;
      text-align: left;
    }
  `;

  const deployDate =
    items.length > 0 ? items[0]["Data deploy"] : "data não disponível";

  const tableRows = items
    .map((item) => {
      const resumoLimpo = (item.Resumo || "").replace(
        /<div[^>]*>|<\/div>|<span[^>]*>|<\/span>|<br\s*\/?>/gi,
        ""
      );

      return `
          <tr>
            <td>${item.ID || "&nbsp;"}</td>
            <td>${item.Title || "&nbsp;"}</td>
            <td>${resumoLimpo || "&nbsp;"}</td>
            <td>${item.Produto || "&nbsp;"}</td>
            <td>${item.Cliente || "&nbsp;"}</td>
            <td>${item["Data deploy"] || "&nbsp;"}</td>
            <td>${item["Iteration Path"] || "&nbsp;"}</td>
            <td>${item["Referencia no Ajuda"] || "&nbsp;"}</td> 
          </tr>
        `;
    })
    .join("");

  return `
    <!doctype html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <title>Relatório de Deploy</title>
      <style>${cssStyles}</style>
    </head>
    <body>
        <p>Prezados,
        <br><br>
        Segue o relatório diário de deploys realizados em  <strong>${deployDate}</strong>.
        <br>
        O documento contém links para as tarefas alteradas no dia.</p>
          <table class="table">
            <thead>
              <tr>
                <th>Azure ID</th>
                <th>Título</th>
                <th>Resumo</th>
                <th>Produto</th>
                <th>Cliente</th>
                <th>Data de Deploy</th>
                <th>Sprint</th>
                <th>Referência no Ajuda</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
    </body>
    </html>
  `;
}

const Relatorio = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch("/api/report")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          if (result.data.length === 0) {
            setError("Nenhum PBI disponível para envio");
            setItems([]);
          } else {
            setItems(result.data);
          }
        } else {
          setError(result.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      const emailHtml = generateEmailHtml(items);

      const resp = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: emailHtml }),
      });

      const result = await resp.json();
      if (!resp.ok || !result.success)
        throw new Error(result.error || "Falha ao enviar e-mail");

      setStatus(true);
    } catch (err) {
      setStatus(false);
      console.log(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handlePreview = () => {
    const emailHtml = generateEmailHtml(items);
    setPreviewHtml(emailHtml);
    setShowPreview(true);
  };

  if (loading) return <p className="loading"></p>;
  if (error)
    return (
      <p className="animeLeft" style={{ color: "red" }}>
        {error}
      </p>
    );

  return (
    <div className={`${styles.container} animeLeft`}>
      {status === null ? null : status ? (
        <p style={{ color: "green" }}>Email enviado com sucesso!</p>
      ) : (
        <p style={{ color: "red" }}>Falha ao enviar Email</p>
      )}

      <div className={styles.btnEnviar}>
        <button
          onClick={handleSendEmail}
          disabled={isSending || loading || error}
        >
          {isSending ? <p className="loading"></p> : "Enviar E-mail"}
        </button>

        <button
          onClick={handlePreview}
          disabled={loading || error}
          style={{ marginLeft: "12px" }}
        >
          Pré-visualizar E-mail
        </button>
      </div>

      {showPreview && (
        <div className="animeLeft">
          <button
            className={styles.btnGeral}
            onClick={() => setShowPreview(false)}
          >
            Fechar
          </button>
          <h2 style={{ color: "#ff420a", marginBottom: "20px" }}>
            Pré-visualização do E-mail
          </h2>
          <iframe
            title="preview"
            style={{ width: "100%", height: "450px", border: "1px solid #ccc" }}
            srcDoc={previewHtml}
          ></iframe>
        </div>
      )}

      {items.map((item) => (
        <div className={styles.card} key={item.ID}>
          <div>
            <h3>Azure ID</h3>
            <p>{item.ID}</p>
          </div>
          <div>
            <h3>Título</h3>
            <p>{item.Title}</p>
          </div>
          <div>
            <h3>Resumo</h3>
            <p>{item.Resumo.replace(/<\/?[^>]+(>|$)/gi, "")}</p>
          </div>
          <div>
            <h3>Produto</h3>
            <p>{item.Produto}</p>
          </div>
          <div>
            <h3>Cliente</h3>
            <p>{item.Cliente}</p>
          </div>
          <div>
            <h3>Data Deploy</h3>
            <p>{item["Data deploy"]}</p>
          </div>
          <div>
            <h3>Sprint</h3>
            <p>{item["Iteration Path"]}</p>
          </div>
          <div>
            <h3>Referência no Ajuda</h3>
            <p>{item["Referencia no Ajuda"].replace(/<\/?[^>]+(>|$)/gi, "")}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Relatorio;
