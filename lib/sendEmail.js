import nodemailer from "nodemailer";

export async function sendEmail({
  html,
  remetente,
  senha_app,
  destinatario,
  bcc = [],
  assunto = "Relatório Diário de Deploy",
}) {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: { user: remetente, pass: senha_app },
  });

  const mailOptions = {
    from: remetente,
    to: destinatario,
    bcc: Array.isArray(bcc) ? bcc.join(",") : bcc,
    subject: assunto,
    html,
  };

  await transporter.sendMail(mailOptions);
}
