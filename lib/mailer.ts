import nodemailer from "nodemailer";

const fallbackRecipient = "hoangngoccuong1414@gmail.com";

type SiteMail = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

let cachedTransporter: nodemailer.Transporter | null | undefined;

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function getMailerConfig() {
  const host = readEnv("SMTP_HOST");
  const portValue = readEnv("SMTP_PORT");
  const port = portValue ? Number(portValue) : undefined;
  const user = readEnv("SMTP_USER");
  const password = readEnv("SMTP_PASSWORD");

  if (!host || !port || !user || !password) {
    return undefined;
  }

  return {
    host,
    port,
    secure: readEnv("SMTP_SECURE") === "true" || port === 465,
    user,
    password,
    fromName: readEnv("SMTP_FROM_NAME") ?? "Max Hoang Website",
    fromEmail: readEnv("SMTP_FROM_EMAIL") ?? user,
    recipient: readEnv("CONTACT_TO_EMAIL") ?? fallbackRecipient
  };
}

function getTransporter() {
  if (cachedTransporter !== undefined) {
    return cachedTransporter;
  }

  const config = getMailerConfig();

  if (!config) {
    cachedTransporter = null;
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password
    }
  });

  return cachedTransporter;
}

export function getContactRecipient() {
  return readEnv("CONTACT_TO_EMAIL") ?? fallbackRecipient;
}

export function isMailerConfigured() {
  return Boolean(getMailerConfig());
}

export async function sendSiteMail({ subject, text, html, replyTo }: SiteMail) {
  const config = getMailerConfig();
  const transporter = getTransporter();

  if (!config || !transporter) {
    throw new Error(
      "Email delivery is not configured yet. Add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD."
    );
  }

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromEmail}>`,
    to: config.recipient,
    replyTo,
    subject,
    text,
    html
  });
}
