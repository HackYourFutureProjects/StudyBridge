import { logInfo } from "../../utils/logging.js";
import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

// read required SMTP env vars and fail with a clear message if missing.
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

// parse and validate SMTP port from env.
function getSmtpPort(): number {
  const rawPort = process.env.SMTP_PORT;
  const port = rawPort ? Number.parseInt(rawPort, 10) : 465;

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid SMTP_PORT value: ${rawPort}`);
  }

  return port;
}

// resolve secure flag. If not explicitly set, infer from port (465 => true).
function getSmtpSecure(port: number): boolean {
  if (process.env.SMTP_SECURE !== undefined) {
    return process.env.SMTP_SECURE === "true";
  }

  return port === 465;
}

// Production startup initializer (fail-fast):
// - Creates SMTP transporter from env
// - Verifies credentials/connectivity at boot
// - Skips in non-production
export async function initEmailTransporter() {
  if (process.env.NODE_ENV !== "production") return;
  if (transporter) return;

  const host = getRequiredEnv("SMTP_HOST");
  const port = getSmtpPort();
  const secure = getSmtpSecure(port);
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.verify(); // Fail startup early if SMTP config is invalid
  logInfo(`Production SMTP transporter initialized (${host}:${port})`);
}

// returns existing transporter if ready.
// In production, transporter must already be initialized at startup.
// In development, lazily creates Ethereal test transporter.
async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Production email transporter is not initialized. Call initEmailTransporter() at startup.",
    );
  }

  // Development-only Ethereal test account (for preview URL and local testing)
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

// Sends password reset email using whichever transporter is active
// (production SMTP or development Ethereal).
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const tx = await getTransporter();

  const info = await tx.sendMail({
    from: process.env.EMAIL_FROM || "'studyBridge' <no-reply@studybridge.com>",
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

  // Ethereal provides a preview URL only in development mode.
  if (process.env.NODE_ENV !== "production") {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logInfo(`Email preview URL: ${previewUrl}`);
    }
  }
}
