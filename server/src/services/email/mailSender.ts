import { logInfo } from "../../utils/logging.js";
import nodemailer from "nodemailer";
import { Resend } from "resend";

let transporter: nodemailer.Transporter | null = null;

export async function initEmailTransporter() {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing required env var: RESEND_API_KEY (production)");
    }
    logInfo("Production email: Resend API ready.");
    return;
  }
}

/**
 * Development-only Ethereal transporter.
 */
async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Production transporter not used. Resend API is used in production.",
    );
  }

  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  logInfo("Ethereal test account created");
  logInfo(`   User: ${testAccount.user}`);

  return transporter;
}

/**
 * Sends password reset email.
 * - Development: Ethereal (nodemailer) + preview URL
 * - Production: Resend API
 */
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const from =
    process.env.EMAIL_FROM || "Study Bridge <noreply@studybridgeweb.nl>";

  const subject = "Reset your password";
  const text = `Reset your password (valid for 3 hours): ${resetLink}`;
  const html = `
    <p>You requested a password reset for <b>Study Bridge</b>.</p>
    <p>This link is valid for <b>3 hours</b>.</p>
    <p><a href="${resetLink}">Reset Password</a></p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p>— Study Bridge Team</p>
  `;

  // PRODUCTION → Resend API
  if (process.env.NODE_ENV === "production") {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("Missing required env var: RESEND_API_KEY");

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    logInfo(`Password reset email sent to ${to} via Resend`);
    return;
  }

  // DEVELOPMENT → Ethereal
  const tx = await getTransporter();

  const info = await tx.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) logInfo(`Email preview URL: ${previewUrl}`);
}
