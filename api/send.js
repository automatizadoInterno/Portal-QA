import { sendEmail } from "../lib/sendEmail.js";
import config from "../config.js";

export default async function handler(req, res) {
  // Apenas aceita requisições POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const remetente = process.env.SMTP_USER;
    const senha = process.env.SMTP_PASS;
    if (!remetente || !senha) {
      return res
        .status(500)
        .json({ success: false, error: "Credenciais SMTP ausentes" });
    }

    const { html } = req.body;
    if (!html) {
      return res
        .status(400)
        .json({ success: false, error: 'O campo "html" é obrigatório' });
    }

    // O corpo da requisição pode opcionalmente sobrescrever o config
    const { destinatario, bcc, assunto } = req.body;

    await sendEmail({
      html,
      remetente,
      senha_app: senha,
      destinatario: destinatario || config.destinatario,
      bcc: bcc || config.bcc_list,
      assunto: assunto || config.assunto,
    });

    res
      .status(200)
      .json({ success: true, message: "E-mail enviado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
