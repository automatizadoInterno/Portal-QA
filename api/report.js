import { executarQueries } from "../lib/azureQuery.js";
import config from "../config.js";

export default async function handler(req, res) {
  try {
    const pat = process.env.AZURE_PAT;
    if (!pat) {
      return res.status(500).json({
        success: false,
        error: "AZURE_PAT ausente nas variáveis de ambiente",
      });
    }

    const items = await executarQueries(
      config.organization,
      config.queries,
      pat
    );

    const itemsConverted = items.map((it) => {
      const copy = { ...it };
      const raw = copy["Data deploy"];
      if (raw) {
        const d = new Date(raw);
        if (!isNaN(d)) {
          copy["Data deploy"] = d
            .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
            .replace(",", "");
        }
      }
      return copy;
    });

    res.status(200).json({ success: true, data: itemsConverted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
