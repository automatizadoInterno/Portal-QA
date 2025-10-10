import { executarQueries } from "../lib/azureQuery.js";
import { sendEmail } from "../lib/sendEmail.js";
import config from "../config.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const pat = process.env.AZURE_PAT;
    const remetente = process.env.SMTP_USER;
    const senha = process.env.SMTP_PASS;

    if (!pat || !remetente || !senha) {
      return res.status(500).json({
        success: false,
        error: "Variáveis de ambiente ausentes (AZURE_PAT, SMTP_USER, SMTP_PASS)",
      });
    }

    // Busca dados no Azure
    const items = await executarQueries(
      config.organization,
      config.queriesChamados,
      pat
    );

    // Processa dados agrupando por Dev e por Produto
    const devMap = {};
    const produtoMap = {};

    items.forEach((item) => {
      const dev = item["Assigned To"] || "Não atribuído";
      const state = item["State"] || "Unknown";
      const produto = item["Produto"] || "Outro";

      if (!devMap[dev]) devMap[dev] = {};
      devMap[dev][state] = (devMap[dev][state] || 0) + 1;

      produtoMap[produto] = (produtoMap[produto] || 0) + 1;
    });

    // Monta o HTML
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #0078d4;">📊 Relatório Diário - Chamados Abertos</h2>

        <h3>Chamados por Desenvolvedor</h3>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #0078d4; color: white;">
              <th style="padding: 8px; border: 1px solid #ddd;">Desenvolvedor</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Status</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(devMap)
              .map(([dev, estados]) =>
                Object.entries(estados)
                  .map(
                    ([state, count]) => `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${dev}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${state}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${count}</td>
                  </tr>`
                  )
                  .join("")
              )
              .join("")}
          </tbody>
        </table>

        <h3>Chamados por Produto</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background-color: #0078d4; color: white;">
              <th style="padding: 8px; border: 1px solid #ddd;">Produto</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(produtoMap)
              .map(
                ([produto, count]) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${produto}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${count}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>

        <p style="margin-top: 30px; font-size: 12px; color: #777;">
          Relatório gerado automaticamente via Azure DevOps API.
        </p>
      </div>
    `;

    // Envia o e-mail
    await sendEmail({
      html,
      remetente,
      senha_app: senha,
      destinatario: config.destinatario,
      bcc: config.bcc_list,
      assunto: "📋 Relatório Diário de Chamados Abertos",
    });

    res.status(200).json({
      success: true,
      message: "Relatório enviado com sucesso!",
    });
  } catch (err) {
    console.error("Erro ao enviar relatório:", err);
    res.status(500).json({
      success: false,
      error: err.message || String(err),
    });
  }
}
