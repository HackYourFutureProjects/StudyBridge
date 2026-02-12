import { logInfo } from "../../utils/logging.js";
import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Email transporter is not configured for production yet.",
      );
    }

    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      /*
  the mailsender is created using Ethereal (test email service)
  A preview URL will be logged in the console.
*/

      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    logInfo("Ethereal test account created");
    logInfo(`   User: ${testAccount.user}`);
  }
  return transporter;
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const tx = await getTransporter();

  const info = await tx.sendMail({
    from: "'studyBridge'<no-reply@studybridge.com>",
    to,
    subject: "Reset your password",
    text: `Reset your password (valid for 3 hours): ${resetLink}`,
    html: `
      <p>You requested a password reset for <b>studyBridge</b>.</p>
      <p>This link is valid for <b>3 hours</b>.</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p>— studyBridge Team</p>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);

  if (previewUrl) {
    logInfo(`Email preview URL: ${previewUrl}`);
  }
}
