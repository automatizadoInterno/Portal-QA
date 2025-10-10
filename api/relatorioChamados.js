import { executarQueries } from "../lib/azureQuery.js";
import config from "../config.js";

export default async function handler(req, res) {
  try {
    console.log("🔑 AZURE_PAT:", process.env.AZURE_PAT ? "OK" : "FALTANDO");

    const pat = process.env.AZURE_PAT;
    if (!pat) {
      return res.status(500).json({
        success: false,
        error: "AZURE_PAT ausente nas variáveis de ambiente",
      });
    }

    // Executa a query para pegar chamados
    const items = await executarQueries(
      config.organization,
      config.queriesChamados,
      pat
    );

    console.log(`📦 Total de itens retornados: ${items.length}`);

    // Processa dados: Dev -> quantidade por status, Produto -> quantidade
    const devMap = {};
    const produtoMap = {};

    items.forEach((item) => {
      let dev = item["Assigned To"] || "";
      const state = item["State"] || "Unknown";
      const produto = item["Produto"] || "Outro";

      // Extrai apenas o nome antes do e-mail (ex: "Lucas Camargo <lucas@...>")
      if (dev.includes("<")) {
        dev = dev.split("<")[0].trim();
      }

      // Se não tiver nome, define como "Não atribuído"
      if (!dev) dev = "Não atribuído";

      // Mapeia dev por status
      if (!devMap[dev]) devMap[dev] = {};
      devMap[dev][state] = (devMap[dev][state] || 0) + 1;

      // Mapeia produto
      produtoMap[produto] = (produtoMap[produto] || 0) + 1;
    });

    console.log("✅ Processamento concluído com sucesso.");

    res.status(200).json({
      success: true,
      data: {
        devMap,
        produtoMap,
      },
    });
  } catch (err) {
    console.error("🔥 ERRO NO HANDLER relatorioChamados:", err);
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
